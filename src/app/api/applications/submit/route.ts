import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { google } from 'googleapis';
import { GOOGLE_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_WHITELIST_SHEET_ID } from "@/config/googleConfig";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to submit an application" },
        { status: 401 }
      );
    }

    const formData = await req.json();

    // Initialize Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: GOOGLE_PRIVATE_KEY,
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare row data
    const timestamp = new Date().toISOString();
    const rowData = [
      timestamp, // A - TimeStamp
      session.user.name, // B - Username
      formData.discordId, // C - Your Discord Username
      formData.characterName, // D - What is your Character Name
      formData.experience, // E - Do you have experience with other RP servers
      formData.backstory, // F - Provide a brief backstory
      formData.powergaming, // G - What is powergaming
      formData.newLifeRule, // H - Explain the "New Life Rule"
      formData.rdmVdm, // I - What is RDM and VDM
      formData.stayingInCharacter, // J - Explain the concept of staying in character
      formData.ruleBreaking, // K - You witness a player breaking rules
      formData.gunpoint, // L - Your character is held at gunpoint
      formData.agreeToRules, // M - Do you agree to follow all rules
      formData.hasMicrophone, // N - Do you have a microphone
      formData.memorableExperience, // O - Describe a memorable RP experience
      formData.streamer, // P - Are you a streamer
      formData.streamerLink || '', // Q - If so, please provide your channel link
      'pending', // R - Status
      '', // S - Updated By
      '' // T - Time of Update
    ];

    // Log the data being sent for debugging
    console.log('Submitting application data:', {
      formData,
      rowData
    });

    // Append to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_WHITELIST_SHEET_ID,
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
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    );
  }
} 