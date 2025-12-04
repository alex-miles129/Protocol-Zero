import { google } from 'googleapis';
import { getSheetId } from '@/lib/utils';
import { DOCApplication } from '@/types/applications';
import { Session } from 'next-auth';

export async function getDOCApplications(sheets: any, session?: Session | null) {
  const sheetId = getSheetId('doc');
  if (!sheetId) {
    throw new Error('DOC sheet ID not found');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1:O', // Range A through M for all fields
  });

  const rows = response.data.values || [];
  return rows.map((row: any[]): DOCApplication => ({
    // Base fields
    id: row[0],                  // Column A - Timestamp
    type: 'doc',
    submittedAt: row[0],         // Column A - Timestamp
    status: row[12] || 'pending', // Column M - Status
    reviewedBy: row[13] || '',              // Will be set when reviewed
    reviewedAt: row[14] || '',              // Will be set when reviewed
    email: session?.user?.email || '',

    // OOC Information
    username: row[1] || '',       // Column B - Discord Name
    discordId: row[2] || '',      // Column B - Discord Name (same as username)
    age: row[4] || '',           // Column D - Age (18)
    timezone: row[6] || '',      // Column E - TimeZone
    rpExperience: row[7] || '',  // Column F - RP Experience
    roleQualification: row[8] || '', // Column G - What makes you a good fit

    // IC Information
    characterName: row[3] || '',  // Column C - Character Name
    characterAge: row[5] || '',   // Column D - Age (same as OOC age)
    background: row[9] || '',    // Column H - Background
    workReason: row[10] || '',    // Column I - Why work at penitentiary
    inmateHandling: row[11] || '', // Column J - How handle unruly inmates
  }));
} 