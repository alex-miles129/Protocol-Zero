import { Application } from "@/types/applications";

interface ApplicationDetailsProps {
  application: Application;
}

export function ApplicationDetails({ application }: ApplicationDetailsProps) {
  const renderFields = () => {
    switch (application.type) {
      case 'whitelist':
        return (
          <>
            <Field label="Status" value={application.status || 'PENDING'} />
            <Field label="Submitted At" value={application.submittedAt} />
            
            {/* User Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">User Information</h3>
            <Field label="Discord ID" value={application.discordId} />
            
            {/* Character Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Character Information</h3>
            <Field 
              label="Character Name" 
              value={application.characterName}
            />
            <Field 
              label="Do you have experience with other roleplaying games or servers? Please specify." 
              value={application.experience}
            />
            <Field 
              label="Provide a brief backstory for your main character" 
              value={application.backstory}
            />
            
            {/* Rules Understanding */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Rules Understanding</h3>
            <Field 
              label="What is powergaming? Provide an example." 
              value={application.powergaming}
            />
            <Field 
              label="Explain the 'New Life Rule' and how it affects your character after death." 
              value={application.newLifeRule}
            />
            <Field 
              label="What is RDM and VDM?" 
              value={application.rdmVdm}
            />
            <Field 
              label="Explain the concept of 'staying in character.' Why is it important?" 
              value={application.stayingInCharacter}
            />
            <Field 
              label="You witness a player breaking the rules. How do you handle the situation?" 
              value={application.ruleBreaking}
            />
            <Field 
              label="Your character is held at gunpoint during a robbery. How do you respond?" 
              value={application.gunpoint}
            />
            
            {/* Technical & Additional */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Technical & Additional Information</h3>
            <Field label="Agrees To Rules" value={application.agreeToRules} />
            <Field label="Has Microphone" value={application.hasMicrophone} />
            <Field label="Memorable RP Experience" value={application.memorableExperience} />
            <Field label="Is Streamer" value={application.streamer} />
            {application.streamerLink && (
              <Field label="Streamer Link" value={application.streamerLink} />
            )}
          </>
        );

      case 'ems':
        return (
          <>
            <Field label="Status" value={application.status || 'PENDING'} />
            <Field label="Submitted At" value={application.submittedAt} />
            
            {/* OOC Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Out of Character Information</h3>
            <Field label="Discord ID" value={application.discordId} />
            <Field label="Age" value={application.age} />
            <Field label="Timezone" value={application.timezone} />
            <Field label="Weekly Hours Available" value={application.weeklyHours} />
            <Field label="Prior EMS Experience" value={application.priorExperience} />
            <Field label="Why Join EMS? (OOC)" value={application.joinReason} />
            
            {/* IC Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">In Character Information</h3>
            <Field label="Full Name" value={application.fullName} />
            <Field label="Date of Birth" value={application.dateOfBirth} />
            <Field label="Current Address" value={application.address} />
            <Field label="Medical Certifications" value={application.medicalCertifications} />
            <Field label="Character Background" value={application.backgroundStory} />
            <Field label="Why Join EMS? (IC)" value={application.icJoinReason} />
          </>
        );

      case 'police':
        return (
          <>
            {/* OOC Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Out of Character Information</h3>
            <Field label="Discord ID" value={application.discordId} />
            <Field label="Age" value={application.age} />
            <Field label="Timezone" value={application.timezone} />
            <Field label="Working Microphone" value={application.hasWorkingMic ? 'Yes' : 'No'} />
            <Field label="RP Experience (Police-related)" value={application.policeRpExperience} />
            <Field label="Why Join Police?" value={application.joinReason} />
            
            {/* IC Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">In Character Information</h3>
            <Field label="Full Name" value={application.characterName} />
            <Field label="Date of Birth" value={application.dateOfBirth} />
            <Field label="Prior Employment" value={application.priorEmployment} />
            <Field label="Fitness for Role" value={application.fitnessForRole} />
            <Field label="Stress Handling" value={application.stressHandling} />
            <Field label="IC Background/Bio" value={application.backgroundStory} />
          </>
        );

      case 'doj':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field 
                label="Status" 
                value={application.status.toUpperCase()} 
              />
              <Field 
                label="Submitted At" 
                value={new Date(application.submittedAt).toLocaleString()} 
              />
            </div>
            
            {/* OOC Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Out of Character Information</h3>
            <Field 
              label="Discord ID" 
              value={application.discordId} 
            />
            <Field 
              label="Age" 
              value={application.age} 
              description="Must be 18 or older"
            />
            <Field 
              label="Timezone" 
              value={application.timezone} 
              description="Example - EST, GMT, PST"
            />
            <Field 
              label="Do you understand DOJ guidelines and legal RP?" 
              value={application.understandsGuidelines ? 'Yes' : 'No'} 
            />
            <Field 
              label="RP Background in Legal Field" 
              value={application.legalRpBackground} 
              description="Experience with legal roleplay, including previous servers, roles, and notable cases"
            />
            
            {/* IC Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">In Character Information</h3>
            <Field 
              label="Name" 
              value={application.characterName} 
              description="Character's full legal name"
            />
            <Field 
              label="DOB" 
              value={application.dateOfBirth} 
              description="MM/DD/YYYY"
            />
            <Field 
              label="Desired DOJ Role" 
              value={application.desiredRole} 
              description="Judge, Attorney, etc."
            />
            <Field 
              label="Legal Education (IC)" 
              value={application.legalEducation} 
              description="Law school, specializations, certifications, training"
            />
            <Field 
              label="Case History" 
              value={application.caseHistory || 'None'} 
              description="Notable cases, roles, outcomes, precedents set"
            />
            <Field 
              label="Why do you want to join DOJ in Protocol: Zero?" 
              value={application.joinReason} 
            />
          </>
        );

      case 'doc':
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field 
                label="Status" 
                value={application.status.toUpperCase()} 
              />
              <Field 
                label="Submitted At" 
                value={new Date(application.submittedAt).toLocaleString()} 
              />
            </div>
            
            {/* OOC Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">Out of Character Information</h3>
            <Field 
              label="Discord ID" 
              value={application.discordId}
            />
            <Field 
              label="Age" 
              value={application.age}
              description="Must be 18 or older"
            />
            <Field 
              label="Timezone" 
              value={application.timezone}
              description="Example - EST, GMT, PST"
            />
            <Field 
              label="RP Experience" 
              value={application.rpExperience}
              description="Correctional/prison-related roleplay experience"
            />
            <Field 
              label="What makes you a good fit for the DOC role?" 
              value={application.roleQualification}
              description="Qualities and experience for prison roleplay"
            />
            
            {/* IC Information */}
            <h3 className="text-lg font-semibold mt-4 mb-2">In Character Information</h3>
            <Field 
              label="Character Name" 
              value={application.characterName}
              description="Character's full legal name"
            />
            <Field 
              label="Character Age" 
              value={application.characterAge}
              description="Character's current age"
            />
            <Field 
              label="Background" 
              value={application.background}
              description="Character's background story and criminal history"
            />
            <Field 
              label="Why Work at Penitentiary?" 
              value={application.workReason}
              description="Character's motivation and goals"
            />
            <Field 
              label="How would you handle unruly inmates?" 
              value={application.inmateHandling}
              description="Approach to handling difficult situations"
            />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Status" value={application.status.toUpperCase()} />
        <Field label="Submitted At" value={new Date(application.submittedAt).toLocaleString()} />
        {application.reviewedBy && (
          <>
            <Field label="Reviewed By" value={application.reviewedBy} />
            <Field label="Reviewed At" value={new Date(application.reviewedAt || '').toLocaleString()} />
          </>
        )}
      </div>
      <div className="space-y-4">
        {renderFields()}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string | boolean | undefined;
  description?: string;
}

function Field({ label, value, description }: FieldProps) {
  if (value === undefined || value === null) return null;
  
  // Convert boolean values to Yes/No
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
  
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm whitespace-pre-wrap">{displayValue}</p>
      {description && (
        <p className="text-xs text-muted-foreground italic">{description}</p>
      )}
    </div>
  );
} 