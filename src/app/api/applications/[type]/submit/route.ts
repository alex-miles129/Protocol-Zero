import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { google } from 'googleapis';
import { getSheetId } from '@/lib/utils';
import { formatApplicationData } from '@/utils/applicationFormatters';
import {
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
} from "@/config/googleConfig";

export async function POST(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'You must be logged in to submit an application' },
        { status: 401 }
      );
    }

    // Get application data from request
    const formData = await request.json();
    const { type } = params;

    // Validate form data
    if (!formData || typeof formData !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { status: 400 }
      );
    }

    // Validate application type
    if (!type || typeof type !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid application type' },
        { status: 400 }
      );
    }

    // Get the appropriate Google Sheet ID based on application type
    const sheetId = getSheetId(type);
    if (!sheetId) {
      return NextResponse.json(
        { success: false, error: 'Invalid application type' },
        { status: 400 }
      );
    }

    // Initialize Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: GOOGLE_PRIVATE_KEY,
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Enrich form data with user information
    const enrichedFormData = {
      ...formData,
      email: session.user.email || '',
      username: session.user.name || '',
    };

    // Format the data using the formatter
    const rowData = formatApplicationData(type as any, enrichedFormData);

    // Log the data being sent for debugging
    console.log('Submitting application:', {
      type,
      sheetId,
      rowLength: rowData.length,
      data: rowData
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

    return NextResponse.json({ 
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 