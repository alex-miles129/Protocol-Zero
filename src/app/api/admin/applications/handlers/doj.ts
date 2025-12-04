import { google } from 'googleapis';
import { getSheetId } from '@/lib/utils';
import { DOJApplication } from '@/types/applications';
import { Session } from 'next-auth';

export async function getDOJApplications(sheets: any, session?: Session | null) {
  const sheetId = getSheetId('doj');
  if (!sheetId) {
    throw new Error('DOJ sheet ID not found');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:P', // Read from row 2 (skip header), up to column P
  });

  const rows = response.data.values || [];
  return rows
    .filter((row: any[]) => row && row.length > 0 && row[0]) // Filter out empty rows
    .map((row: any[]): DOJApplication => {
      // Ensure row has enough elements, pad with empty strings if needed
      const paddedRow = [...row];
      while (paddedRow.length < 16) {
        paddedRow.push('');
      }
      
      return {
        // Base fields
        id: paddedRow[0] || '',
        type: 'doj',
        submittedAt: paddedRow[0] || '',
        status: paddedRow[13] || 'pending',    // Column N - Status
        reviewedBy: paddedRow[14] || '',       // Column O - Reviewed By
        reviewedAt: paddedRow[15] || '',       // Column P - Reviewed At
        email: session?.user?.email || '',

        // OOC Information
        username: paddedRow[1] || '',          // Column B - Discord Username (from session)
        discordId: paddedRow[2] || '',         // Column C - Discord ID (from form)
        age: paddedRow[3] || '',               // Column D - Age
        timezone: paddedRow[4] || '',           // Column E - Timezone
        understandsGuidelines: paddedRow[5] === 'TRUE' || paddedRow[5] === true, // Column F - Understands Guidelines
        legalRpBackground: paddedRow[6] || '', // Column G - RP Background in Legal Field

        // IC Information
        characterName: paddedRow[7] || '',     // Column H - Full Name
        dateOfBirth: paddedRow[8] || '',        // Column I - DOB
        desiredRole: paddedRow[9] || '',       // Column J - Desired DOJ Role
        legalEducation: paddedRow[10] || '',    // Column K - Legal Education
        caseHistory: paddedRow[11] || '',      // Column L - Case History
        joinReason: paddedRow[12] || ''        // Column M - Why join DOJ
      };
    });
} 