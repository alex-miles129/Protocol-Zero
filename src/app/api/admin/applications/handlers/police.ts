import { google } from 'googleapis';
import { getSheetId } from '@/lib/utils';
import { PoliceApplication } from '@/types/applications';
import { Session } from 'next-auth';

export async function getPoliceApplications(sheets: any, session?: Session | null) {
  const sheetId = getSheetId('police');
  if (!sheetId) {
    throw new Error('Police sheet ID not found');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:Q', // Updated range to include columns through Q
  });

  const rows = response.data.values || [];
  return rows.map((row: any[]): PoliceApplication => ({
    id: row[0],
    type: 'police',
    submittedAt: row[0],
    username: row[1] || '', // B - Discord Username
    discordId: row[2] || '', // C - Discord Name
    age: row[3] || '', // D - Age
    timezone: row[4] || '', // E - Timezone
    hasWorkingMic: row[5] === 'Yes', // F - Working Microphone
    policeRpExperience: row[6] || '', // G - RP Experience
    joinReason: row[7] || '', // H - Why Join Police
    characterName: row[8] || '', // I - Full Name (IC)
    dateOfBirth: row[9] || '', // J - DOB
    priorEmployment: row[10] || '', // K - Prior Employment
    fitnessForRole: row[11] || '', // L - Fitness for Role
    stressHandling: row[12] || '', // M - Stress Handling
    backgroundStory: row[13] || '', // N - IC Background/Bio
    status: row[14] || 'pending', // O - Status
    reviewedBy: row[15] || '', // P - Reviewed By
    reviewedAt: row[16] || '', // Q - Reviewed At
    email: session?.user?.email || ''
  }));
} 