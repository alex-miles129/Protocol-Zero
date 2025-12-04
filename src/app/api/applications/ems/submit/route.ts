import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { google } from 'googleapis';
import { getSheetId } from '@/lib/utils';
import {
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
} from "@/config/googleConfig";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to submit an application" },
        { status: 401 }
      );
    }

    const formData = await request.json();

    // Initialize Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: GOOGLE_PRIVATE_KEY,
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get the appropriate Google Sheet ID
    const sheetId = getSheetId('ems');
    if (!sheetId) {
      throw new Error('EMS sheet ID not found');
    }

    // Column order in sheet:
    // 1. Timestamp
    // 2. Discord Username
    // 3. Discord ID
    // 4. Full Name
    // 5. Age
    // 6. Timezone
    // 7. Weekly Hours
    // 8. Prior Experience
    // 9. Join Reason (OOC)
    // 10. IC Join Reason
    // 11. Medical Certifications
    // 12. Background Story
    // 13. Date of Birth
    // 14. Address
    // 15. Status
    // 16. Moderator

    // Prepare row data in exact sheet column order
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,                              // 1. Timestamp
      session.user.name || '',                // 2. Discord Username
      formData.discordId || '',              // 3. Discord ID
      formData.fullName || '',               // 4. Full Name
      formData.age || '',                    // 5. Age
      formData.timezone || '',               // 6. Timezone
      formData.weeklyHours || '',            // 7. Weekly Hours
      formData.priorExperience || '',        // 8. Prior Experience
      formData.joinReason || '',             // 9. Join Reason (OOC)
      formData.icJoinReason || '',           // 10. IC Join Reason
      formData.medicalCertifications || '',   // 11. Medical Certifications
      formData.backgroundStory || '',        // 12. Background Story
      formData.dateOfBirth || '',            // 13. Date of Birth
      formData.address || '',                // 14. Address
      'pending',                             // 15. Status
      ''                                     // 16. Moderator (empty initially)
    ];

    // Log the data being sent for debugging
    console.log('Submitting application data:', {
      formData,
      rowData
    });

    // Append to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
} 