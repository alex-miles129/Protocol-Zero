import { google } from 'googleapis';
import { getSheetId } from '@/lib/utils';
import { EMSApplication } from '@/types/applications';
import { Session } from 'next-auth';

export async function getEMSApplications(sheets: any, session?: Session | null) {
  const sheetId = getSheetId('ems');
  if (!sheetId) {
    throw new Error('EMS sheet ID not found');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Sheet1!A2:Q', // Read up to column Q to include reviewedAt
  });

  const rows = response.data.values || [];
  return rows
    .filter((row: any[]) => row && row.length > 0 && row[0]) // Filter out empty rows
    .map((row: any[]): EMSApplication => {
      // Ensure row has enough elements, pad with empty strings if needed
      const paddedRow = [...row];
      while (paddedRow.length < 17) {
        paddedRow.push('');
      }
      
      return {
        id: paddedRow[0] || '',
        type: 'ems',
        submittedAt: paddedRow[0] || '',
        status: paddedRow[14] || 'pending',
        reviewedBy: paddedRow[15] || '',
        reviewedAt: paddedRow[16] || '',
        
        // User Information
        username: paddedRow[1] || '',
        discordId: paddedRow[2] || '',
        
        // OOC Information
        age: paddedRow[4] || '',
        timezone: paddedRow[5] || '',
        weeklyHours: paddedRow[6] || '',
        priorExperience: paddedRow[7] || '',
        joinReason: paddedRow[8] || '',
        
        // IC Information
        fullName: paddedRow[3] || '',
        dateOfBirth: paddedRow[12] || '',
        address: paddedRow[13] || '',
        medicalCertifications: paddedRow[10] || '',
        backgroundStory: paddedRow[11] || '',
        icJoinReason: paddedRow[9] || '',
        
        // Add email from session if available
        email: session?.user?.email || ''
      };
    });
} 