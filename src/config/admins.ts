import fs from 'fs';
import path from 'path';

export interface AdminUser {
  email: string;
  discordId: string;
  designation: string | 'all';
}

// List of valid designations
export const VALID_DESIGNATIONS = ['all', 'whitelist', 'police', 'ems', 'doj', 'doc'] as const;
export type Designation = typeof VALID_DESIGNATIONS[number];

// Code-defined admins
export const adminUsers: AdminUser[] = [
  {
    email: 'mastermindaggaming@gmail.com',
    discordId: '964445991422005278',
    designation: 'all'  // This admin has access to EMS sections
  },
  {
    email: 'baranwalshubhankar3@gmail.com',
    discordId: '910570306576457821',
    designation: 'all'  // This admin has access to EMS sections
  },
  {
    email: 'baranwalshubhankar3@gmail.com',
    discordId: '910570306576457821',
    designation: 'all'  // This admin has access to EMS sections
  }
];

// Function to read admins from file
const getFileAdmins = (): AdminUser[] => {
  try {
    const adminFilePath = path.join(process.cwd(), 'admin.txt');
    
    if (!fs.existsSync(adminFilePath)) {
      fs.writeFileSync(adminFilePath, '# Admin users (one per line)\n# Format: email,discordId\n');
      return [];
    }

    const adminFileContent = fs.readFileSync(adminFilePath, 'utf-8');
    const adminLines = adminFileContent
      .split('\n')
      .filter(line => line && !line.startsWith('#')); // Skip empty lines and comments

    return adminLines.map(line => {
      const [email, discordId] = line.trim().split(',');
      return { 
        email, 
        discordId, 
        designation: 'all' // File-based admins get full access
      };
    });
  } catch (error) {
    console.error('Error reading admin file:', error);
    return [];
  }
};

export const isValidDesignation = (designation: string): boolean => {
  return VALID_DESIGNATIONS.includes(designation as Designation);
};

export const getAdminAccess = (email: string): AdminUser | undefined => {
  // Convert email to lowercase for case-insensitive comparison
  const normalizedEmail = email.toLowerCase();
  
  // Check code-defined admins first
  const codeAdmin = adminUsers.find(
    admin => admin.email.toLowerCase() === normalizedEmail
  );
  if (codeAdmin) return codeAdmin;

  // Then check file-based admins
  const fileAdmins = getFileAdmins();
  return fileAdmins.find(
    admin => admin.email.toLowerCase() === normalizedEmail
  );
};

export const canAccessSection = (admin: AdminUser, section: string): boolean => {
  if (!isValidDesignation(admin.designation) || !isValidDesignation(section)) {
    return false;
  }
  if (admin.designation === 'all') return true;
  return admin.designation === section;
}; 