'use server';

import { z } from 'zod';
import { google } from 'googleapis';
import { GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_CONTACT_SHEET_ID } from '@/config/googleConfig';

const contactFormSchema = z.object({
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export async function submitContactForm(data: ContactFormValues) {
  console.log('Received contact form submission on server:', data);

  // Validate data again on the server
  const parsedData = contactFormSchema.safeParse(data);
  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map(e => e.message).join(', ');
    console.log('Validation failed:', errorMessages);
    return { success: false, message: `Invalid data: ${errorMessages}` };
  }

  const { username, message } = parsedData.data;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: GOOGLE_PRIVATE_KEY,
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Log the configuration (without sensitive data) for debugging
    console.log('Google Sheets Configuration:', {
      hasServiceAccount: !!GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!GOOGLE_PRIVATE_KEY,
      hasSheetId: !!GOOGLE_CONTACT_SHEET_ID,
    });

    const timestamp = new Date().toISOString();
    const rowValues = [
      timestamp,
      username,
      message,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_CONTACT_SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowValues],
      },
    });

    console.log('Data successfully written to Google Sheet.');
    const response = { success: true, message: 'Your message has been sent and recorded!' };
    console.log('Sending response:', response);
    return response;
  } catch (error) {
    // Enhanced error logging with proper TypeScript typing
    const err = error as { 
      message?: string; 
      code?: string | number; 
      status?: number;
      errors?: unknown[];
    };
    
    console.error('Detailed error information:', {
      error: err,
      message: err.message || 'Unknown error',
      code: err.code,
      status: err.status,
      details: err.errors,
      config: {
        hasServiceAccount: !!GOOGLE_SERVICE_ACCOUNT_EMAIL,
        hasPrivateKey: !!GOOGLE_PRIVATE_KEY,
        hasSheetId: !!GOOGLE_CONTACT_SHEET_ID,
      }
    });

    if (process.env.NODE_ENV === 'development') {
      const response = { 
        success: false, 
        message: `Debug Error: ${err.message || 'Unknown error'}. Check server console for details.` 
      };
      console.log('Sending error response:', response);
      return response;
    }
    
    const response = { success: false, message: 'Failed to save your message. Please try again later.' };
    console.log('Sending error response:', response);
    return response;
  }
}
