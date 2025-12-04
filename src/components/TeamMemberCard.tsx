
import type { TeamMember } from '@/types';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const fallbackInitials = member.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || member.name.substring(0,2).toUpperCase();

  return (
    <div className={cn(
        "p-0.5 rounded-lg transition-all duration-300 group", // Use rounded-lg to match inner card
        // On group hover, the outer div gets the animated gradient background
        "group-hover:hover-rainbow-border-effect" 
      )}
    >
      {/* Inner Card component for content, with transparent border on hover */}
      <Card className="bg-card border border-border/50 group-hover:border-transparent shadow-md group-hover:shadow-primary/40 transition-all duration-300 rounded-lg flex items-center p-4 sm:p-5 space-x-4 sm:space-x-5 h-full">
        <Avatar className="h-16 w-16 sm:h-[70px] sm:w-[70px] flex-shrink-0 border-2 border-border/70">
          <AvatarImage src={member.imageUrl} alt={member.name} data-ai-hint={member.dataAiHint || "profile avatar"} />
          <AvatarFallback>{fallbackInitials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center">
          <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">
            {member.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-0.5">
            {member.role}
          </CardDescription>
        </div>
      </Card>
    </div>
  );
}
