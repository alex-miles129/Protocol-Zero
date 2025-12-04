import { teamMembers } from '@/config/siteConfig';
import { TeamMemberCard } from './TeamMemberCard';

export function TeamSection() {
  return (
    <section id="team" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Vertical "OUR TEAM" text */}
          <div className="hidden lg:flex flex-col items-center self-start pt-2.5 pr-8 lg:pr-12">
            <div 
              className="[writing-mode:vertical-lr] text-xs font-semibold text-primary space-y-1 tracking-[0.2em] uppercase"
            >
              <span>O</span>
              <span>U</span>
              <span>R</span>
              <div className="h-2 my-1"></div> {/* Visual spacer */}
              <span>T</span>
              <span>E</span>
              <span>A</span>
              <span>M</span>
            </div>
            <div className="mt-4 h-20 w-px bg-border/60"></div>
          </div>

          {/* Main content area (Title + Cards) */}
          <div className="flex-1">
            <div className="mb-12 sm:mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">
                MEET OUR TEAM
              </h2>
            </div>
            {teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {teamMembers.map((member) => (
                  <TeamMemberCard key={member.name} member={member} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Team information is not available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
