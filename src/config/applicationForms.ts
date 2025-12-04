import { ApplicationFormConfig } from '../types/applications';

export const emsFormConfig: ApplicationFormConfig = {
  type: 'ems',
  title: 'EMS Application Form',
  description: 'Apply to join the Emergency Medical Services team in Protocol: Zero.',
  questions: [
    // OOC Section
    {
      id: 'discordId',
      label: 'Discord ID',
      type: 'text',
      required: true,
      placeholder: '12256525845',
      section: 'ooc'
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      placeholder: 'Must be 18 or older',
      section: 'ooc'
    },
    {
      id: 'timezone',
      label: 'Timezone',
      type: 'text',
      required: true,
      placeholder: 'Example - EST, GMT, PST',
      section: 'ooc'
    },
    {
      id: 'weeklyHours',
      label: 'How many hours do you play per week?',
      type: 'number',
      required: true,
      placeholder: 'Enter average number of hours you can commit weekly',
      section: 'ooc'
    },
    {
      id: 'priorExperience',
      label: 'Do you have any prior EMS experience (IRL or RP)?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe any relevant experience in emergency medical services, either in real life or other roleplay servers. Include specific roles, responsibilities, and duration.',
      section: 'ooc'
    },
    {
      id: 'joinReason',
      label: 'Why do you want to join EMS?',
      type: 'textarea',
      required: true,
      placeholder: 'Explain your motivation for joining the EMS department. What drives you to serve the community in this role?',
      section: 'ooc'
    },
    // IC Section
    {
      id: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Your character\'s full legal name',
      section: 'ic'
    },
    {
      id: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'text',
      required: true,
      placeholder: 'MM/DD/YYYY',
      section: 'ic'
    },
    {
      id: 'address',
      label: 'Address',
      type: 'text',
      required: true,
      placeholder: 'Your character\'s current residential address in Protocol: Zero',
      section: 'ic'
    },
    {
      id: 'medicalCertifications',
      label: 'Medical Certifications (if any)',
      type: 'textarea',
      required: false,
      placeholder: 'List any medical certifications, training, or education your character has obtained. Include dates and institutions if applicable.',
      section: 'ic'
    },
    {
      id: 'backgroundStory',
      label: 'Background Story',
      type: 'textarea',
      required: true,
      placeholder: 'Provide a detailed background story for your character. Include their upbringing, education, life experiences, and what led them to pursue a career in emergency medical services.',
      section: 'ic'
    },
    {
      id: 'icJoinReason',
      label: 'Why do you want to become a medic in Protocol: Zero?',
      type: 'textarea',
      required: true,
      placeholder: 'From your character\'s perspective, explain their motivation to join the EMS department in Protocol: Zero. What events or experiences shaped this decision?',
      section: 'ic'
    }
  ]
};

export const policeFormConfig: ApplicationFormConfig = {
  type: 'police',
  title: 'Police Department Application Form',
  description: 'Apply to join the Protocol: Zero Police Department.',
  questions: [
    // OOC Section
    {
      id: 'discordId',
      label: 'Discord ID',
      type: 'text',
      required: true,
      placeholder: '12256525845',
      section: 'ooc'
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      placeholder: 'Must be 18 or older',
      section: 'ooc'
    },
    {
      id: 'timezone',
      label: 'Timezone',
      type: 'text',
      required: true,
      placeholder: 'Example - EST, GMT, PST',
      section: 'ooc'
    },
    {
      id: 'hasWorkingMic',
      label: 'Do you have a working microphone?',
      type: 'boolean',
      required: true,
      placeholder: 'Select an option',
      section: 'ooc'
    },
    {
      id: 'policeRpExperience',
      label: 'RP Experience (Police-related)',
      type: 'textarea',
      required: true,
      placeholder: 'Detail your experience with police roleplay. Include servers, roles, duration, and notable achievements. If you have real law enforcement experience, you may include that as well.',
      section: 'ooc'
    },
    {
      id: 'joinReason',
      label: 'Why do you want to be a police officer in this server?',
      type: 'textarea',
      required: true,
      placeholder: 'Explain your motivation for joining law enforcement. What makes you a good fit for this role? What do you hope to contribute to the community?',
      section: 'ooc'
    },
    // IC Section
    {
      id: 'characterName',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Your character\'s full legal name',
      section: 'ic'
    },
    {
      id: 'dateOfBirth',
      label: 'DOB',
      type: 'text',
      required: true,
      placeholder: 'MM/DD/YYYY',
      section: 'ic'
    },
    {
      id: 'priorEmployment',
      label: 'Prior Employment',
      type: 'textarea',
      required: true,
      placeholder: 'List your character\'s previous employment history, including positions held, duration, and reasons for leaving.',
      section: 'ic'
    },
    {
      id: 'fitnessForRole',
      label: 'What makes you fit to serve in the Protocol: Zero PD?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your character\'s qualities, skills, and experiences that make them suitable for law enforcement. Include both physical and mental attributes.',
      section: 'ic'
    },
    {
      id: 'stressHandling',
      label: 'How do you handle high-stress situations?',
      type: 'textarea',
      required: true,
      placeholder: 'Provide examples of how your character has handled stressful situations in the past and their approach to managing pressure in law enforcement scenarios.',
      section: 'ic'
    },
    {
      id: 'backgroundStory',
      label: 'IC Background/Bio',
      type: 'textarea',
      required: true,
      placeholder: 'Write a detailed background story for your character, including their upbringing, significant life events, and what motivated them to pursue a career in law enforcement.',
      section: 'ic'
    }
  ]
};

export const dojFormConfig: ApplicationFormConfig = {
  type: 'doj',
  title: 'Department of Justice Application Form',
  description: 'Apply to join the Protocol: Zero Department of Justice.',
  questions: [
    // OOC Section
    {
      id: 'discordId',
      label: 'Discord ID',
      type: 'text',
      required: true,
      placeholder: '12256525845',
      section: 'ooc'
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      placeholder: 'Must be 18 or older',
      section: 'ooc'
    },
    {
      id: 'timezone',
      label: 'Timezone',
      type: 'text',
      required: true,
      placeholder: 'Example - EST, GMT, PST',
      section: 'ooc'
    },
    {
      id: 'understandsGuidelines',
      label: 'Do you understand DOJ guidelines and legal RP?',
      type: 'boolean',
      required: true,
      placeholder: 'Confirm your understanding of DOJ guidelines and legal roleplay requirements',
      section: 'ooc'
    },
    {
      id: 'legalRpBackground',
      label: 'RP Background in Legal Field (if any)',
      type: 'textarea',
      required: false,
      placeholder: 'Describe your experience with legal roleplay, including previous servers, roles (judge, attorney, etc.), and notable cases. Include any relevant real-world legal experience if applicable.',
      section: 'ooc'
    },
    // IC Section
    {
      id: 'characterName',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Your character\'s full legal name',
      section: 'ic'
    },
    {
      id: 'dateOfBirth',
      label: 'DOB',
      type: 'text',
      required: true,
      placeholder: 'MM/DD/YYYY',
      section: 'ic'
    },
    {
      id: 'desiredRole',
      label: 'Desired DOJ Role (Judge, Attorney, etc.)',
      type: 'text',
      required: true,
      placeholder: 'Specify which role within the DOJ you are applying for',
      section: 'ic'
    },
    {
      id: 'legalEducation',
      label: 'Legal Education (IC)',
      type: 'textarea',
      required: true,
      placeholder: 'Detail your character\'s legal education, including law school, specializations, and any additional certifications or training.',
      section: 'ic'
    },
    {
      id: 'caseHistory',
      label: 'Case History (If applicable)',
      type: 'textarea',
      required: false,
      placeholder: 'List notable cases your character has been involved in, including their role, outcome, and any significant precedents set.',
      section: 'ic'
    },
    {
      id: 'joinReason',
      label: 'Why do you want to join DOJ in Protocol: Zero?',
      type: 'textarea',
      required: true,
      placeholder: 'Explain your character\'s motivation for joining the Department of Justice. What do they hope to achieve in this role?',
      section: 'ic'
    }
  ]
};

export const docFormConfig: ApplicationFormConfig = {
  type: 'doc',
  title: 'DOC Application Form',
  description: 'Apply to join the Department of Corrections staff.',
  questions: [
    // OOC Section
    {
      id: 'discordId',
      label: 'Discord ID',
      type: 'text',
      required: true,
      placeholder: '12256525845',
      section: 'ooc'
    },
    {
      id: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      placeholder: 'Must be 18 or older',
      section: 'ooc'
    },
    {
      id: 'timezone',
      label: 'Timezone',
      type: 'text',
      required: true,
      placeholder: 'Example - EST, GMT, PST',
      section: 'ooc'
    },
    {
      id: 'rpExperience',
      label: 'RP Experience',
      type: 'textarea',
      required: true,
      placeholder: 'Detail your roleplay experience, particularly in correctional or prison-related scenarios. Include servers, roles, and memorable experiences.',
      section: 'ooc'
    },
    {
      id: 'roleQualification',
      label: 'What makes you a good fit for the DOC role?',
      type: 'textarea',
      required: true,
      placeholder: 'Explain why you would be a good fit for the Department of Corrections. What qualities and experience do you bring that would enhance prison roleplay?',
      section: 'ooc'
    },
    // IC Section
    {
      id: 'characterName',
      label: 'Character Name',
      type: 'text',
      required: true,
      placeholder: 'Your character\'s full legal name',
      section: 'ic'
    },
    {
      id: 'characterAge',
      label: 'Age',
      type: 'number',
      required: true,
      placeholder: 'Your character\'s current age',
      section: 'ic'
    },
    {
      id: 'background',
      label: 'Background',
      type: 'textarea',
      required: true,
      placeholder: 'Provide a detailed background story for your character, including their criminal history, conviction details, and life experiences that led them to their current situation.',
      section: 'ic'
    },
    {
      id: 'workReason',
      label: 'Why do you want to work at the Penitentiary?',
      type: 'textarea',
      required: true,
      placeholder: 'From your character\'s perspective, explain their motivation for working at the penitentiary. What are their goals and expectations?',
      section: 'ic'
    },
    {
      id: 'inmateHandling',
      label: 'How would you handle unruly inmates?',
      type: 'textarea',
      required: true,
      placeholder: 'Describe your approach to handling difficult or unruly inmates while maintaining professionalism and safety.',
      section: 'ic'
    }
  ]
};

export const applicationForms = {
  ems: emsFormConfig,
  police: policeFormConfig,
  doj: dojFormConfig,
  doc: docFormConfig
}; 