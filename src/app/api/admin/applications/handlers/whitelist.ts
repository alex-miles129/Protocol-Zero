import { google } from 'googleapis';
import { getSheetId } from '@/lib/utils';
import { WhitelistApplication } from '@/types/applications';
import { Session } from 'next-auth';

export async function getWhitelistApplications(sheets: any, session?: Session | null) {
  const sheetId = getSheetId('whitelist');
  if (!sheetId) {
    throw new Error('Whitelist sheet ID not found');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:T' // Range A through T
  });

  const rows = response.data.values || [];
  return rows.map((row: any[]): WhitelistApplication => ({
    // Base fields
    id: row[0],
    type: 'whitelist',
    submittedAt: row[0],
    status: row[17] || 'pending',    // Column R - Status
    reviewedBy: row[18] || '',       // Column S - Reviewed By
    reviewedAt: row[19] || '',       // Column T - Reviewed At
    
    // User Information
    username: row[1] || '',          // Column B - Discord Username
    discordId: row[2] || '',         // Column C - Discord ID
    
    // Character Information
    characterName: row[3] || '',     // Column D - Character Name
    experience: row[4] || '',        // Column E - Experience
    backstory: row[5] || '',         // Column F - Backstory

    // Rules Understanding
    powergaming: row[6] || '',       // Column G - Powergaming
    newLifeRule: row[7] || '',       // Column H - New Life Rule
    rdmVdm: row[8] || '',           // Column I - RDM/VDM
    stayingInCharacter: row[9] || '', // Column J - Staying In Character
    ruleBreaking: row[10] || '',      // Column K - Rule Breaking
    gunpoint: row[11] || '',         // Column L - Gunpoint

    // Technical & Additional
    agreeToRules: row[12] || '',     // Column M - Agrees to Rules
    hasMicrophone: row[13] || '',    // Column N - Has Microphone
    memorableExperience: row[14] || '', // Column O - Memorable Experience
    streamer: row[15] || '',         // Column P - Is Streamer
    streamerLink: row[16] || '',     // Column Q - Streamer Link
  }));
} 