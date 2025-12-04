import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { google } from 'googleapis';
import { getSheetId } from "@/lib/utils";
import {
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
} from "@/config/googleConfig";
import { getWhitelistApplications } from "./handlers/whitelist";
import { getEMSApplications } from "./handlers/ems";
import { getPoliceApplications } from "./handlers/police";
import { getDOJApplications } from "./handlers/doj";
import { getDOCApplications } from "./handlers/doc";
import { getAdminAccess, canAccessSection } from "@/config/admins";
import { sendFormResponseToDiscord } from "@/lib/webhook";

// Define column positions for each application type
const COLUMN_POSITIONS = {
  whitelist: {
    status: 'R',
    reviewedBy: 'S',
    reviewedAt: 'T'
  },
  ems: {
    status: 'O', // Column 15
    reviewedBy: 'P', // Column 16
    reviewedAt: 'Q' // Column 17
  },
  police: {
    status: 'O', // Column 15
    reviewedBy: 'P', // Column 16
    reviewedAt: 'Q' // Column 17
  },
  doj: {
    status: 'N', // Column 14
    reviewedBy: 'O', // Column 15
    reviewedAt: 'P' // Column 16
  },
  doc: {
    status: 'M',    // Column M - Status
    reviewedBy: 'N', // Column N - Reviewed By
    reviewedAt: 'O'  // Column O - Reviewed At
  }
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      console.log('Unauthorized: No session or user');
      return NextResponse.json(
        { success: false, error: "You must be logged in to access this page" },
        { status: 401 }
      );
    }

    const adminAccess = getAdminAccess(session.user.email);
    if (!adminAccess) {
      console.log('Unauthorized: Not an admin');
      return NextResponse.json(
        { success: false, error: "You do not have permission to access this page" },
        { status: 403 }
      );
    }

    // Initialize Google Sheets (read-only) using service account config
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: GOOGLE_PRIVATE_KEY,
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    let allApplications = [];

    // Helper function to fetch applications with error handling
    const fetchApplications = async (fetcher: Function, type: string) => {
      try {
        // Only fetch applications if admin has access to this section
        if (canAccessSection(adminAccess, type)) {
          const apps = await fetcher(sheets, session);
          console.log(`Found ${apps.length} ${type} applications`);
          return apps;
        }
        return [];
      } catch (error) {
        console.error(`Error fetching ${type} applications:`, error);
        return [];
      }
    };

    // Fetch all application types
    const [whitelist, ems, police, doj, doc] = await Promise.all([
      fetchApplications(getWhitelistApplications, 'whitelist'),
      fetchApplications(getEMSApplications, 'ems'),
      fetchApplications(getPoliceApplications, 'police'),
      fetchApplications(getDOJApplications, 'doj'),
      fetchApplications(getDOCApplications, 'doc')
    ]);

    // Combine all applications
    allApplications = [
      ...whitelist,
      ...ems,
      ...police,
      ...doj,
      ...doc
    ];

    return NextResponse.json({ success: true, applications: allApplications });
  } catch (error) {
    console.error('Error in GET /api/admin/applications:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to access this page" },
        { status: 401 }
      );
    }

    const adminAccess = getAdminAccess(session.user.email);
    if (!adminAccess) {
      return NextResponse.json(
        { success: false, error: "You do not have permission to access this page" },
        { status: 403 }
      );
    }

    const { id, type, status } = await request.json();

    // Check if admin has access to this application type
    if (!canAccessSection(adminAccess, type)) {
      return NextResponse.json(
        { success: false, error: "You do not have permission to modify this type of application" },
        { status: 403 }
      );
    }

    // Initialize Google Sheets (read/write) using service account config
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: GOOGLE_PRIVATE_KEY,
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get the appropriate sheet ID
    const sheetId = getSheetId(type);
    if (!sheetId) {
      throw new Error(`Invalid application type: ${type}`);
    }

    // Get column positions for this application type
    const positions = COLUMN_POSITIONS[type as keyof typeof COLUMN_POSITIONS];
    if (!positions) {
      throw new Error(`Column positions not defined for type: ${type}`);
    }

    // Find the row with matching ID and get full row data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:Z', // Get full row to extract username and discordId
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
      throw new Error('Application not found');
    }

    // Extract applicant information from the row
    // Username is in column B (index 1) - from session (for admin panel display)
    // Discord ID is in column C (index 2) - from form (for webhook)
    const row = rows[rowIndex];
    const applicantName = row[1] || ''; // Username from session (for display)
    const applicantId = row[2] || '';   // Discord ID from form (for webhook)

    // Update status
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Sheet1!${positions.status}${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status]]
      }
    });

    // Update reviewer
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Sheet1!${positions.reviewedBy}${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[session.user.name]]
      }
    });

    // Update review timestamp
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Sheet1!${positions.reviewedAt}${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[new Date().toISOString()]]
      }
    });

    // Send webhook notification to Discord
    try {
      const guildId = process.env.DISCORD_SERVER_ID || '';
      const action = status === 'approved' ? 'accept' : 'reject';
      const reason = null; // You can add a reason field to the request body if needed
      const adminName = session.user.name || '';

      // Only send webhook if server ID is configured
      if (guildId) {
        await sendFormResponseToDiscord(
          guildId,
          action,
          applicantName,
          applicantId,
          type as 'whitelist' | 'police' | 'ems' | 'doj' | 'doc',
          reason,
          adminName
        );
      } else {
        console.warn('DISCORD_SERVER_ID not configured, skipping webhook notification');
      }
    } catch (webhookError) {
      // Log error but don't fail the request if webhook fails
      console.error('Failed to send webhook notification:', webhookError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/admin/applications:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update application" },
      { status: 500 }
    );
  }
} 