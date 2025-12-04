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

    // Log the raw form data received
    console.log('Raw form data received:', {
      sessionUser: session.user,
      formData: formData
    });

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
    const sheetId = getSheetId('police');
    if (!sheetId) {
      throw new Error('Police sheet ID not found');
    }

    // Column order in sheet:
    // A. Timestamp
    // B. Submitter Discord Username
    // C. Discord Name (Include #0000)
    // D. Age
    // E. Timezone
    // F. Working Microphone
    // G. RP Experience (Police-related)
    // H. Why Join Police
    // I. Full Name (IC)
    // J. DOB
    // K. Prior Employment
    // L. Fitness for Role
    // M. Stress Handling
    // N. IC Background/Bio
    // U. Status (Administrative)
    // V. Reviewed By (Administrative)
    // W. Reviewed At (Administrative)

    // Prepare row data in exact sheet column order
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp,                                    // A - Timestamp
      session.user.name || '',                      // B - Submitter Discord Username
      formData.discordId || '',                    // C - Discord Name
      formData.age || '',                          // D - Age
      formData.timezone || '',                     // E - Timezone
      formData.hasWorkingMic ? 'Yes' : 'No',      // F - Working Microphone
      formData.policeRpExperience || '',          // G - RP Experience
      formData.joinReason || '',                   // H - Why Join Police
      formData.characterName || '',                // I - Full Name (IC)
      formData.dateOfBirth || '',                  // J - DOB
      formData.priorEmployment || '',              // K - Prior Employment
      formData.fitnessForRole || '',              // L - Fitness for Role
      formData.stressHandling || '',              // M - Stress Handling
      formData.backgroundStory || '',             // N - IC Background/Bio
      '',                                         // O - Empty
      '',                                         // P - Empty
      '',                                         // Q - Empty
      '',                                         // R - Empty
      '',                                         // S - Empty
      '',                                         // T - Empty
      'pending',                                  // U - Status
      '',                                         // V - Reviewed By
      ''                                          // W - Reviewed At
    ];

    // Log detailed mapping of form fields to spreadsheet columns
    console.log('Form fields to spreadsheet mapping:', {
      timestamp: {
        column: 'A',
        value: timestamp
      },
      submitterDiscordName: {
        column: 'B',
        value: session.user.name
      },
      discordName: {
        column: 'C',
        formValue: formData.discordId,
        finalValue: rowData[2]
      },
      age: {
        column: 'D',
        formValue: formData.age,
        finalValue: rowData[3]
      },
      timezone: {
        column: 'E',
        formValue: formData.timezone,
        finalValue: rowData[4]
      },
      workingMic: {
        column: 'F',
        formValue: formData.hasWorkingMic,
        finalValue: rowData[5]
      },
      policeRpExperience: {
        column: 'G',
        formValue: formData.policeRpExperience,
        finalValue: rowData[6]
      },
      joinReason: {
        column: 'H',
        formValue: formData.joinReason,
        finalValue: rowData[7]
      },
      characterName: {
        column: 'I',
        formValue: formData.characterName,
        finalValue: rowData[8]
      },
      dateOfBirth: {
        column: 'J',
        formValue: formData.dateOfBirth,
        finalValue: rowData[9]
      },
      priorEmployment: {
        column: 'K',
        formValue: formData.priorEmployment,
        finalValue: rowData[10]
      },
      fitnessForRole: {
        column: 'L',
        formValue: formData.fitnessForRole,
        finalValue: rowData[11]
      },
      stressHandling: {
        column: 'M',
        formValue: formData.stressHandling,
        finalValue: rowData[12]
      },
      backgroundStory: {
        column: 'N',
        formValue: formData.backgroundStory,
        finalValue: rowData[13]
      },
      // Administrative columns at the end
      status: {
        column: 'U',
        value: 'pending'
      },
      reviewedBy: {
        column: 'V',
        value: ''
      },
      reviewedAt: {
        column: 'W',
        value: ''
      }
    });

    // Log the final row data being sent to spreadsheet
    console.log('Final row data for spreadsheet:', {
      totalColumns: rowData.length,
      data: rowData.map((value, index) => ({
        column: String.fromCharCode(65 + index),
        value: value
      }))
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
    // Log detailed error information
    console.error('Submission error details:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
} 