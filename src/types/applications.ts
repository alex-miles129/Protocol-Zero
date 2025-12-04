export interface BaseApplication {
  id: string;
  type: ApplicationType;
  submittedAt: string;
  status: string;
  reviewedBy: string;
  reviewedAt?: string;
  username: string;
  discordId: string;
}

export interface WhitelistApplication extends BaseApplication {
  type: 'whitelist';
  characterName: string;
  experience: string;
  backstory: string;
  powergaming: string;
  newLifeRule: string;
  rdmVdm: string;
  stayingInCharacter: string;
  ruleBreaking: string;
  gunpoint: string;
  agreeToRules: string;
  hasMicrophone: string;
  memorableExperience: string;
  streamer: string;
  streamerLink?: string;
}

export interface EMSApplication extends BaseApplication {
  type: 'ems';
  age: string;
  timezone: string;
  weeklyHours: string;
  priorExperience: string;
  joinReason: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  medicalCertifications: string;
  backgroundStory: string;
  icJoinReason: string;
}

export interface PoliceApplication extends BaseApplication {
  type: 'police';
  age: string;
  timezone: string;
  hasWorkingMic: boolean;
  policeRpExperience: string;
  joinReason: string;
  characterName: string;
  dateOfBirth: string;
  priorEmployment: string;
  fitnessForRole: string;
  stressHandling: string;
  backgroundStory: string;
}

export interface DOJApplication extends BaseApplication {
  type: 'doj';
  // OOC Information
  username: string;      // Discord Username
  discordId: string;    // Discord Username (same as above)
  age: string;          // Age (must be 18+)
  timezone: string;     // Timezone
  understandsGuidelines: boolean;  // Do you understand DOJ guidelines and legal RP?
  legalRpBackground: string;       // RP Background in Legal Field (optional)
  
  // IC Information
  characterName: string;    // Character's full legal name
  dateOfBirth: string;     // DOB
  desiredRole: string;     // Desired DOJ Role
  legalEducation: string;  // Legal Education (IC)
  caseHistory: string;     // Case History (optional)
  joinReason: string;      // Why do you want to join DOJ in Protocol: Zero?
  
  // Base fields from BaseApplication are already included:
  // id, type, submittedAt, status, reviewedBy, reviewedAt, email
}

export interface DOCApplication extends BaseApplication {
  type: 'doc';
  // OOC Information
  username: string;      // Discord Handle
  age: string;          // Age (must be 18+)
  timezone: string;     // Timezone
  rpExperience: string; // RP Experience in correctional/prison scenarios
  roleQualification: string; // What makes you a good fit for the DOC role
  
  // IC Information
  characterName: string;    // Character's full legal name
  characterAge: string;     // Character's current age
  background: string;       // Detailed background story
  workReason: string;       // Why work at the penitentiary
  inmateHandling: string;   // How would you handle unruly inmates
}

export type Application = 
  | WhitelistApplication 
  | EMSApplication 
  | PoliceApplication 
  | DOJApplication 
  | DOCApplication;

export type ApplicationType = 'whitelist' | 'ems' | 'police' | 'doj' | 'doc';

export interface ApplicationQuestion {
  id: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'textarea';
  required: boolean;
  section: 'ooc' | 'ic';
  placeholder?: string;
}

export interface ApplicationFormConfig {
  type: ApplicationType;
  title: string;
  description: string;
  questions: ApplicationQuestion[];
} 