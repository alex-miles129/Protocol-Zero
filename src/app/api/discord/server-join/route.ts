import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID as string;

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

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is in the server with rate limit handling
    const guildsResponse = await fetchWithRateLimitHandling(
      'https://discord.com/api/users/@me/guilds',
      {
        headers: { Authorization: `Bearer ${session.user.accessToken}` }
      }
    );

    const guildsData = await guildsResponse.json();

    // Handle Discord API errors or unexpected responses
    if (!guildsResponse.ok) {
      // If still rate limited after retries, return appropriate error
      if (guildsResponse.status === 429) {
        const rateLimitData = guildsData as { retry_after?: number; message?: string };
        return NextResponse.json(
          { 
            error: "Discord API rate limit exceeded",
            retryAfter: rateLimitData.retry_after || 1
          },
          { status: 429 }
        );
      }
      
      console.error('Failed to fetch user guilds from Discord:', {
        status: guildsResponse.status,
        data: guildsData,
      });
      return NextResponse.json(
        { error: "Failed to fetch Discord guilds" },
        { status: 502 }
      );
    }

    if (!Array.isArray(guildsData)) {
      console.error('Unexpected Discord guilds response (not an array):', guildsData);
      return NextResponse.json(
        { error: "Unexpected Discord response format" },
        { status: 502 }
      );
    }

    const isInServer = guildsData.some((guild: any) => guild.id === DISCORD_SERVER_ID);

    // If not in server, add them with rate limit handling
    if (!isInServer) {
      const addMemberResponse = await fetchWithRateLimitHandling(
        `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/members/${session.user.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: session.user.accessToken,
          }),
        }
      );

      // Check if adding member failed due to rate limit
      if (addMemberResponse.status === 429) {
        const rateLimitData = await addMemberResponse.json().catch(() => ({}));
        return NextResponse.json(
          { 
            error: "Discord API rate limit exceeded while adding member",
            retryAfter: (rateLimitData as { retry_after?: number }).retry_after || 1
          },
          { status: 429 }
        );
      }

      if (!addMemberResponse.ok) {
        console.error('Failed to add member to Discord server:', {
          status: addMemberResponse.status,
          data: await addMemberResponse.json().catch(() => ({})),
        });
      }
    }

    return NextResponse.json({ success: true, isInServer });
  } catch (error) {
    console.error('Error managing Discord server membership:', error);
    return NextResponse.json(
      { error: "Failed to manage server membership" },
      { status: 500 }
    );
  }
} 