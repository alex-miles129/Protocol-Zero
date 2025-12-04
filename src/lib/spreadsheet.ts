import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { 
  GOOGLE_SERVICE_ACCOUNT_EMAIL, 
  GOOGLE_PRIVATE_KEY,
  GOOGLE_EMS_SHEET_ID,
  GOOGLE_POLICE_SHEET_ID,
  GOOGLE_DOJ_SHEET_ID,
  GOOGLE_LIFER_SHEET_ID
} from '@/config/googleConfig';

// Configure Google Sheets credentials
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Initialize auth client
const auth = new JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: SCOPES,
});

// Initialize Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// Map of form types to their respective sheet IDs
const SHEET_IDS = {
  ems: GOOGLE_EMS_SHEET_ID,
  police: GOOGLE_POLICE_SHEET_ID,
  doj: GOOGLE_DOJ_SHEET_ID,
  doc: GOOGLE_LIFER_SHEET_ID,
};

export async function appendToSheet(
  type: keyof typeof SHEET_IDS,
  values: string[]
) {
  try {
    // Get the appropriate sheet ID
    const spreadsheetId = SHEET_IDS[type];

    // Append the values to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:Z', // Use full range to ensure consistent column ordering
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error appending to sheet:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 