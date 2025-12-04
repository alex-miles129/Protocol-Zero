import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import {
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_EMS_SHEET_ID,
  GOOGLE_POLICE_SHEET_ID,
  GOOGLE_DOJ_SHEET_ID,
  GOOGLE_DOC_SHEET_ID,
  GOOGLE_WHITELIST_SHEET_ID
} from '@/config/googleConfig';
import { ApplicationType } from '@/types/applications';

const getSheetId = (type: ApplicationType): string => {
  switch (type) {
    case 'whitelist':
      return GOOGLE_WHITELIST_SHEET_ID;
    case 'ems':
      return GOOGLE_EMS_SHEET_ID;
    case 'police':
      return GOOGLE_POLICE_SHEET_ID;
    case 'doj':
      return GOOGLE_DOJ_SHEET_ID;
    case 'doc':
      return GOOGLE_DOC_SHEET_ID;
    default:
      throw new Error('Invalid application type');
  }
};

const auth = new google.auth.JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as ApplicationType;

    if (!type) {
      return NextResponse.json({ error: 'Application type is required' }, { status: 400 });
    }

    const sheetId = getSheetId(type);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:Z'
    });

    const rows = response.data.values || [];
    if (rows.length <= 1) return NextResponse.json({ applications: [] });

    // First row is header
    const headers = rows[0];
    
    // Convert rows to objects
    const applications = rows.slice(1).map(row => {
      const application: any = {
        submittedAt: row[0],
        status: row[1],
        reviewedBy: row[2],
        reviewedAt: row[3]
      };

      // Map remaining columns to form fields
      for (let i = 4; i < row.length; i++) {
        if (headers[i]) {
          application[headers[i]] = row[i];
        }
      }

      return application;
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, formData } = body;

    if (!type || !formData) {
      return NextResponse.json(
        { error: 'Type and form data are required' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const sheetId = getSheetId(type as ApplicationType);

    const rowData = [
      timestamp,
      'pending',
      '', // reviewedBy
      '', // reviewedAt
      ...Object.values(formData)
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:Z',
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type, rowIndex, status, reviewedBy } = body;

    if (!type || rowIndex === undefined || !status || !reviewedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sheetId = getSheetId(type as ApplicationType);
    const timestamp = new Date().toISOString();

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Sheet1!B${rowIndex + 1}:D${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status, reviewedBy, timestamp]]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
} 