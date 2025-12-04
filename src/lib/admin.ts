import fs from 'fs';
import path from 'path';

interface AdminUser {
  email: string;
  discordId: string;
}

export async function isUserAdmin(email: string, discordId: string): Promise<boolean> {
  try {
    const adminFilePath = path.join(process.cwd(), 'admin.txt');
    
    // Check if admin.txt exists, if not create it
    if (!fs.existsSync(adminFilePath)) {
      fs.writeFileSync(adminFilePath, '# Admin users (one per line)\n# Format: email,discordId\n');
      return false;
    }

    const adminFileContent = fs.readFileSync(adminFilePath, 'utf-8');
    const adminLines = adminFileContent
      .split('\n')
      .filter(line => line && !line.startsWith('#')); // Skip empty lines and comments

    const adminUsers: AdminUser[] = adminLines.map(line => {
      const [email, discordId] = line.trim().split(',');
      return { email, discordId };
    });

    return adminUsers.some(admin => 
      admin.email === email && admin.discordId === discordId
    );
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
} 