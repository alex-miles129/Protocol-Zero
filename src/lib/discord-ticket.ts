interface OpenMembershipTicketInput {
  userId: string;
  orderId: string;
  transactionId: string;
  amount: number;
  currency: string;
}

interface OpenMembershipTicketResult {
  success: boolean;
  ticketId?: string;
  error?: string;
}

const DISCORD_API_BASE = 'https://discord.com/api/v10';
const MEMBERSHIP_TICKET_CHANNEL_ID =
  process.env.DISCORD_MEMBERSHIP_TICKET_CHANNEL_ID || '1443336419270459483';

type DiscordChannel = {
  id: string;
  type: number;
};

async function discordFetchWithRetry(
  path: string,
  init: RequestInit,
  retries = 3
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const response = await fetch(`${DISCORD_API_BASE}${path}`, init);

    if (response.status !== 429) {
      return response;
    }

    const rateLimitData = await response.json().catch(() => ({}));
    const retryAfterMs = Math.ceil(((rateLimitData as any)?.retry_after || 1) * 1000);
    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
  }

  return fetch(`${DISCORD_API_BASE}${path}`, init);
}

export async function openMembershipPurchaseTicket(
  input: OpenMembershipTicketInput
): Promise<OpenMembershipTicketResult> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) {
    return { success: false, error: 'DISCORD_BOT_TOKEN is not configured' };
  }

  const baseHeaders = {
    Authorization: `Bot ${botToken}`,
    'Content-Type': 'application/json',
  };

  const contentLines = [
    'New membership purchase ticket opened automatically after payment.',
    `User: <@${input.userId}>`,
    `Order Number: ${input.orderId}`,
    `Transaction ID: ${input.transactionId}`,
    `Amount: ${input.currency} ${input.amount.toFixed(2)}`,
    'Category: Membership Purchase',
  ];
  // Detect channel type and choose correct ticket creation API.
  const channelResponse = await discordFetchWithRetry(
    `/channels/${MEMBERSHIP_TICKET_CHANNEL_ID}`,
    {
      method: 'GET',
      headers: baseHeaders,
    }
  );

  if (!channelResponse.ok) {
    const errorPayload = await channelResponse.text().catch(() => 'Unknown Discord API error');
    return {
      success: false,
      error: `Failed to read ticket channel metadata: ${channelResponse.status} ${errorPayload}`,
    };
  }

  const channel = (await channelResponse.json()) as DiscordChannel;
  const threadName = `membership-${input.orderId.slice(-8)}`;

  // Forum channel (15): create post/thread directly in forum.
  if (channel.type === 15) {
    const forumThreadResponse = await discordFetchWithRetry(
      `/channels/${MEMBERSHIP_TICKET_CHANNEL_ID}/threads`,
      {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify({
          name: threadName,
          auto_archive_duration: 1440,
          message: {
            content: contentLines.join('\n'),
            allowed_mentions: { users: [input.userId] },
          },
        }),
      }
    );

    if (!forumThreadResponse.ok) {
      const errorPayload = await forumThreadResponse.text().catch(() => 'Unknown Discord API error');
      return {
        success: false,
        error: `Failed to create forum membership ticket: ${forumThreadResponse.status} ${errorPayload}`,
      };
    }

    const forumThread = (await forumThreadResponse.json()) as { id: string };
    return { success: true, ticketId: forumThread.id };
  }

  // Text-like channels: create message, then create a thread from that message.
  const messageResponse = await discordFetchWithRetry(
    `/channels/${MEMBERSHIP_TICKET_CHANNEL_ID}/messages`,
    {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({
        content: contentLines.join('\n'),
        allowed_mentions: { users: [input.userId] },
      }),
    }
  );

  if (!messageResponse.ok) {
    const errorPayload = await messageResponse.text().catch(() => 'Unknown Discord API error');
    return {
      success: false,
      error: `Failed to create ticket seed message: ${messageResponse.status} ${errorPayload}`,
    };
  }

  const messageData = (await messageResponse.json()) as { id: string };
  const threadResponse = await discordFetchWithRetry(
    `/channels/${MEMBERSHIP_TICKET_CHANNEL_ID}/messages/${messageData.id}/threads`,
    {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({
        name: threadName,
        auto_archive_duration: 1440,
      }),
    }
  );

  if (threadResponse.ok) {
    const threadData = (await threadResponse.json()) as { id: string };
    return { success: true, ticketId: threadData.id };
  }

  // If thread creation fails but message exists, return message ID as a ticket reference.
  return { success: true, ticketId: messageData.id };
}
