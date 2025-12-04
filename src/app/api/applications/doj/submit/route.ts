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
    const sheetId = getSheetId('doj');
    if (!sheetId) {
      throw new Error('DOJ sheet ID not found');
    }

    // Column order in sheet (matching form structure):
    // A. Timestamp
    // B. Discord Username (from session - logged in user)
    // C. Discord ID (from form - first question)
    // D. Age
    // E. Timezone
    // F. Understands Guidelines
    // G. RP Background
    // H. Character Name
    // I. DOB
    // J. Desired Role
    // K. Legal Education
    // L. Case History
    // M. Why Join DOJ
    // N. Status
    // O. Reviewed By
    // P. Reviewed At

    // Prepare row data in exact sheet column order
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,                                    // A. Timestamp
      session.user.name || '',                      // B. Discord Username (from session)
      formData.discordId || '',                     // C. Discord ID (from form)
      formData.age || '',                          // D. Age
      formData.timezone || '',                     // E. Timezone
      formData.understandsGuidelines ? 'TRUE' : 'FALSE', // F. Understands Guidelines
      formData.legalRpBackground || '',            // G. RP Background
      formData.characterName || '',                // H. Character Name
      formData.dateOfBirth || '',                  // I. DOB
      formData.desiredRole || '',                  // J. Desired Role
      formData.legalEducation || '',               // K. Legal Education
      formData.caseHistory || '',                  // L. Case History
      formData.joinReason || '',                   // M. Why Join DOJ
      'pending',                                   // N. Status
      '',                                          // O. Reviewed By
      ''                                           // P. Reviewed At
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