import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Siren, Shield, Scale, Building2 } from "lucide-react"
import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { ScrollProgressBar } from "@/components/ScrollProgressBar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WhitelistApplicationForm } from "@/components/WhitelistApplicationForm"
import { DepartmentApplicationForm } from "@/components/DepartmentApplicationForm"
import { applicationForms } from "@/config/applicationForms"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Applications | Protocol: Zero',
  description: 'Submit applications for whitelist and department positions in Protocol: Zero',
};

const DISCORD_SERVER_ID = process.env.DISCORD_SERVER_ID as string;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN as string;
const REQUIRED_ROLE_ID = "1443336304040349927";
const WHITELIST_ROLE_ID = "1443336304040349927";

async function checkUserHasRole(userId: string, roleId: string): Promise<boolean> {
  try {
    const memberResponse = await fetch(
      `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/members/${userId}`,
      {
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
      }
    );

    if (memberResponse.status === 404 || !memberResponse.ok) {
      return false;
    }

    const memberData = await memberResponse.json();
    return memberData.roles?.includes(roleId) || false;
  } catch (error) {
    console.error('Error checking Discord role:', error);
    return false;
  }
}

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/")
  }

  // Check if user has the required role for department forms
  const userId = (session.user as any).id;
  const hasRequiredRole = userId 
    ? await checkUserHasRole(userId, REQUIRED_ROLE_ID)
    : false;

  // Check if user has the whitelist role
  const hasWhitelistRole = userId 
    ? await checkUserHasRole(userId, WHITELIST_ROLE_ID)
    : false;

  const departmentIcons = {
    ems: Siren,
    police: Shield,
    doj: Scale,
    doc: Building2
  };

  // Format titles to be "DEPARTMENT APPLICATION"
  const formatTitle = (title: string) => {
    const baseName = title
      .replace(/ Form$/, '')
      .replace(/ Application Form$/, '')
      .replace(/ Application$/, '')
      .replace(/Department of Justice/, 'DOJ')
      .replace(/Department of Corrections/, 'DEPARTMENT OF CORRECTIONS');
    
    return `${baseName} APPLICATION`;
  };

  return (
    <>
      <ScrollProgressBar />
      <SiteHeader />
      {/* Fixed Background Image */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm"
          style={{
            backgroundImage: "url('https://files.fivemerr.com/images/a3535ea4-5558-4b1f-9041-0ac835b40417.png')",
          }}
        />
        {/* Dark overlay with blur for better text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <main className="relative min-h-screen">
        <div className="relative z-10 container max-w-7xl py-8 min-h-[calc(100vh-4rem-4rem)]">
        <div className="grid grid-cols-12 gap-6">
          {/* Profile Sidebar */}
          <div className="col-span-3">
            <Card className="bg-card/50 backdrop-blur border-border/20 sticky top-24">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-16 w-16 border-2 border-border/20">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-xl">{session.user.name}</CardTitle>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <h1 className="text-4xl font-bold mb-8">Applications</h1>
            
            {/* Note about whitelist requirement */}
            <div className="mb-6 p-4 bg-purple-600/10 rounded-lg border border-purple-600/20">
              <p className="text-sm text-foreground/70">
                Note: To Gain Access To All Forms, Get Whitelisted First !!
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Whitelisting Application Card */}
              <Card className="bg-card/50 backdrop-blur border-border/20 relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LineChart className="h-6 w-6" />
                      <CardTitle>WHITELIST APPLICATION</CardTitle>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold bg-foreground/10 text-foreground rounded">BETA</span>
                  </div>
                  <CardDescription className="mt-2">
                    Please provide the necessary details to submit your request for whitelisting, ensuring you include all required information to facilitate a timely review and approval process.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <WhitelistApplicationForm disabled={hasWhitelistRole} />
                </CardContent>
              </Card>

              {/* Department Application Cards - Only visible to users with required role */}
              {hasRequiredRole && Object.entries(applicationForms).map(([type, config]) => {
                const Icon = departmentIcons[type as keyof typeof departmentIcons];
                return (
                  <Card key={type} className="bg-card/50 backdrop-blur border-border/20 relative overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className="h-6 w-6" />}
                          <CardTitle>{formatTitle(config.title)}</CardTitle>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold bg-foreground/10 text-foreground rounded">BETA</span>
                      </div>
                      <CardDescription className="mt-2">
                        {config.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DepartmentApplicationForm config={config} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
} 