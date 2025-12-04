import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rules | Protocol: Zero',
  description: 'Server rules and guidelines for Protocol: Zero',
};

export default function RulesPage() {
  return (
    <>
      <ScrollProgressBar />
      <SiteHeader />
      {/* Fixed Background Image */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm"
          style={{
            backgroundImage: "url('https://files.fivemerr.com/images/3b1a1463-44f2-48f9-869d-3f533e0fc66e.png')",
          }}
        />
        {/* Dark overlay with blur for better text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <main className="relative min-h-screen">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent mb-4">
          Community Guidelines: Rules for a Positive Roleplaying Experience
        </h1>
        <p className="text-foreground/60 mb-8">Last Updated | March 06, 2025</p>
        
        <div className="space-y-12">
          {/* General Rules Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">General Rules</h2>
            <div className="space-y-3">
              <div className="pl-4 space-y-2">
                <p className="text-foreground/80">• Staying updated on any rule modifications on our website or Discord is your responsibility.</p>
                <p className="text-foreground/80">• Playing content that is protected by copyright (DMCA) is strictly prohibited.</p>
                <div className="pl-4 text-sm text-foreground/70">
                  - This includes copyrighted movies, music, and other protected materials
                  - Obtain appropriate permissions from rights holders before performing covers
                  - Maintain a lawful and respectful environment
                </div>
                <p className="text-foreground/80">• You must have a working, clear microphone.</p>
                <p className="text-foreground/80">• Engaging in Erotic Roleplay (ERP) is strictly prohibited.</p>
                <p className="text-foreground/80">• Influencing or encouraging others to break rules is prohibited.</p>
                <p className="text-foreground/80">• Real-life events roleplay (suicide, terrorism, pandemics) is prohibited.</p>
                <p className="text-foreground/80">• Zero-tolerance policy towards racism, trolling, discrimination, homophobia, and sexism.</p>
              </div>
            </div>
          </section>

          {/* Account And Donations Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Account And Donations</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Account</h3>
                <div className="pl-4 space-y-2">
                  <p className="text-foreground/80">• You are solely responsible for all activities on your account.</p>
                  <p className="text-foreground/80">• Buying or selling accounts outside official channels is prohibited.</p>
                  <p className="text-foreground/80">• Lost Discord accounts cannot have Allowlist status transferred.</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Donations</h3>
                <div className="pl-4 space-y-2">
                  <p className="text-foreground/80">• 24-hour window for refund requests on donations and purchases.</p>
                  <p className="text-foreground/80">• Purchases and perks are permanently linked to specific characters.</p>
                  <p className="text-foreground/80">• Banned players will not receive refunds for purchases.</p>
                  <p className="text-foreground/80">• Chargebacks result in irreversible consequences.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Crime And Gangs Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Crime And Gangs</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Gangs</h3>
                <div className="pl-4 space-y-2">
                  <p className="text-foreground/80">• Gangs should focus on creative roleplay beyond just conflict.</p>
                  <p className="text-foreground/80">• Verbal roleplay must precede violence.</p>
                  <p className="text-foreground/80">• Maximum of two traphouses per group.</p>
                  <p className="text-foreground/80">• No idle camping at delivery spots when taxing.</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Criminal Activities</h3>
                <div className="pl-4 space-y-2">
                  <p className="text-foreground/80">• Maximum 5 criminals per activity (6 for Oil Rig).</p>
                  <p className="text-foreground/80">• No external help or radio communication beyond the group.</p>
                  <p className="text-foreground/80">• Cooldown periods after activities:</p>
                  <div className="pl-4 text-sm text-foreground/70">
                    - 45 minutes for stores
                    - 90 minutes for Vangelico
                    - 120 minutes for Fleeca/Drug Runs
                    - 180 minutes for major heists
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Roleplay Rules Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Roleplay Rules</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Combat and Death</h3>
                <div className="pl-4 space-y-2">
                  <p className="text-foreground/80">• Initiate roleplay before any violent confrontation.</p>
                  <p className="text-foreground/80">• Random Deathmatch (RDM) is prohibited.</p>
                  <p className="text-foreground/80">• Vehicle Deathmatch (VDM) is forbidden.</p>
                  <p className="text-foreground/80">• New Life Rule applies after incapacitation.</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Metagaming and Powergaming</h3>
                <div className="pl-4 space-y-2">
                  <p className="text-foreground/80">• No using out-of-game information in-game.</p>
                  <p className="text-foreground/80">• No forcing roleplay outcomes unfairly.</p>
                  <p className="text-foreground/80">• No spam jumping or unrealistic actions.</p>
                  <p className="text-foreground/80">• Third-party VOIP is prohibited while connected.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Value of Life Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Value of Life</h2>
            <div className="pl-4 space-y-2">
              <p className="text-foreground/80">• Prioritize your character's life in all situations.</p>
              <p className="text-foreground/80">• Comply when at clear disadvantage (gun to head, outnumbered).</p>
              <p className="text-foreground/80">• Realistic escape attempts only when situation permits.</p>
              <p className="text-foreground/80">• No unrealistic heroics or suicide missions.</p>
            </div>
          </section>

          {/* Economy Rules Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Economy Rules</h2>
            <div className="pl-4 space-y-2">
              <p className="text-foreground/80">• No transferring starter money between characters.</p>
              <p className="text-foreground/80">• Asset transfers between characters are forbidden.</p>
              <p className="text-foreground/80">• LSRS application limitations must be respected.</p>
              <p className="text-foreground/80">• No bypassing asset fees through external transfers.</p>
            </div>
          </section>

          <div className="mt-8 p-4 bg-purple-600/10 rounded-lg border border-purple-600/20">
            <p className="text-sm text-foreground/70">
              Note: These rules are subject to change. Breaking any of these rules may result in temporary or permanent suspension from the server.
              For questions about specific rules, please contact our staff team on Discord.
            </p>
          </div>
          </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
} 