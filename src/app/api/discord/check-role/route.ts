import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID as string;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN as string;
const REQUIRED_ROLE_ID = "1443336304040349927";

// Helper function to handle rate limits with retry
async function fetchWithRateLimitHandling(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(url, options);
    
    // If rate limited, wait and retry
    if (response.status === 429) {
      const rateLimitData = await response.json().catch(() => ({}));
      const retryAfter = (rateLimitData.retry_after || 1) * 1000; // Convert to milliseconds
      
      console.log(`Rate limited. Waiting ${retryAfter}ms before retry ${attempt + 1}/${retries}`);
      await new Promise(resolve => setTimeout(resolve, retryAfter));
      continue;
    }
    
    return response;
  }
  
  // If all retries failed, return the last response
  return fetch(url, options);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", hasRole: false },
        { status: 401 }
      );
    }

    // Fetch user's member information from the Discord server
    const memberResponse = await fetchWithRateLimitHandling(
      `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/members/${session.user.id}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    // If member not found or not in server, return false
    if (memberResponse.status === 404) {
      return NextResponse.json({ hasRole: false });
    }

    if (!memberResponse.ok) {
      console.error('Failed to fetch member from Discord:', {
        status: memberResponse.status,
        data: await memberResponse.json().catch(() => ({})),
      });
      return NextResponse.json(
        { error: "Failed to fetch Discord member", hasRole: false },
        { status: 502 }
      );
    }

    const memberData = await memberResponse.json();
    
    // Check if user has the required role
    const hasRole = memberData.roles?.includes(REQUIRED_ROLE_ID) || false;

    return NextResponse.json({ hasRole });
  } catch (error) {
    console.error('Error checking Discord role:', error);
    return NextResponse.json(
      { error: "Failed to check role", hasRole: false },
      { status: 500 }
    );
  }
}


