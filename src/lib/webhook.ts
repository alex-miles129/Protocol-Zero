/**
 * Sends a form response to Discord webhook endpoint
 * @param guildId - Discord server/guild ID
 * @param action - 'accept' or 'reject'
 * @param applicantName - Discord username of the applicant
 * @param applicantId - Discord ID of the applicant
 * @param formType - Type of form: 'whitelist', 'police', 'ems', 'doj', 'doc', 'staff'
 * @param reason - Optional reason for acceptance/rejection
 * @param adminName - Name of the admin who processed the application
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function sendFormResponseToDiscord(
  guildId: string,
  action: 'accept' | 'reject',
  applicantName: string,
  applicantId: string,
  formType: 'whitelist' | 'police' | 'ems' | 'doj' | 'doc' | 'staff',
  reason: string | null = null,
  adminName: string | null = null
): Promise<boolean> {
  const webhookUrl = process.env.WEBHOOK_URL || 'http://your-server-ip:3000/webhook/form-response';
  const apiKey = process.env.WEBHOOK_API_KEY || '';

  const data = {
    guildId: guildId,
    action: action,
    applicantName: applicantName,
    applicantId: applicantId,
    formType: formType,
    reason: reason,
    adminName: adminName,
    apiKey: apiKey
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      console.error(`Webhook request failed with status: ${response.status}`);
      return false;
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error sending to Discord webhook:', error);
    return false;
  }
}

