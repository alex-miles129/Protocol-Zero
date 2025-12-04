// Define the order of columns for each application type
export const columnOrders = {
  ems: [
    'characterName',
    'age',
    'timezone',
    'previousExperience',
    'whyEMS',
    'availability',
    'medicalBackground',
    'specializations',
    'emergencyScenario',
    'teamworkExample',
    'stressManagement',
    'discordId',           // Move administrative fields to end
    'submissionDate',      
    'status',             
    'moderatorId',        
    'processedDate',      
  ],
  police: [
    'characterName',
    'age',
    'timezone',
    'previousExperience',
    'whyPolice',
    'availability',
    'lawEnforcementBackground',
    'physicalFitness',
    'conflictResolution',
    'communityEngagement',
    'tacticalScenario',
    'ethicalDilemma',
    'partnershipApproach',
    'discordId',
    'submissionDate',
    'status',
    'moderatorId',
    'processedDate',
  ],
  doj: [
    'submissionDate',      // A - Timestamp
    'discordId',          // B - Discord Name
    'characterName',      // C - Character Name
    'age',               // D - Age
    'timezone',          // E - Timezone
    'joinReason',        // F - Why join DOJ
    'legalBackground',   // G - Legal Background
    'specialization',    // H - Specialization
    'caseStudy',        // I - Case Study
    'ethicsScenario',   // J - Ethics Scenario
    'prosecutionStrategy', // K - Prosecution Strategy
    'defenseStrategy',   // L - Defense Strategy
    'judicialPhilosophy', // M - Judicial Philosophy
    'legalWritingSample', // N - Legal Writing Sample
    'legalEducation',    // O - Legal Education
    'caseHistory',       // P - Case History
    'previousExperience', // Q - Previous Experience
    'dateOfBirth',       // R - DOB
    'status',           // S - Status
    'reviewedBy',       // T - Reviewed By
    'reviewedAt',       // U - Reviewed At
  ],
  doc: [
    'submissionDate',    // A - Timestamp
    'username',          // B - Username
    'discordId',         // C - Discord Name
    'characterName',     // D - Character Name
    'characterAge',      // E - Character Age
    'age',              // F - Age
    'timezone',         // G - Timezone
    'rpExperience',     // H - RP Experience
    'roleQualification', // I - What makes you a good fit
    'background',       // J - Background
    'workReason',       // K - Why work at penitentiary
    'inmateHandling',   // L - How handle unruly inmates
    'status',          // Q - Status
    'reviewedBy',      // R - Reviewed By
    'reviewedAt',      // S - Reviewed At
  ],
};

// Format the form data into an ordered array for spreadsheet insertion
export function formatApplicationData(type: keyof typeof columnOrders, formData: Record<string, string>) {
  // Ensure formData exists
  if (!formData) {
    throw new Error('Form data is required');
  }

  const order = columnOrders[type];
  if (!order) {
    throw new Error(`No column order defined for application type: ${type}`);
  }

  // Add administrative fields with default values
  const timestamp = new Date().toISOString();
  const enrichedFormData = {
    ...formData,
    submissionDate: timestamp,
    timestamp: timestamp,        // Add timestamp field explicitly
    status: 'pending',
    reviewedBy: '',             // Ensure consistent naming
    reviewedAt: '',             // Ensure consistent naming
    moderatorId: '',            // Keep for backward compatibility
    processedDate: '',          // Keep for backward compatibility
  };

  // Map through the order array and safely access formData
  const formattedData = order.map(field => {
    // Ensure we have a valid field name
    if (!field) {
      console.warn('Undefined field in column order');
      return '';
    }
    
    // Handle special cases for administrative fields
    if (field === 'status' && !enrichedFormData[field]) {
      return 'pending';
    }
    
    // Safely access the form data with fallback to empty string
    return enrichedFormData[field] || '';
  });

  // Log the formatted data for debugging
  console.log('Formatted application data:', {
    type,
    originalData: formData,
    enrichedData: enrichedFormData,
    formattedResult: formattedData
  });

  return formattedData;
} 