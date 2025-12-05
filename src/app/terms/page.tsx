import { PageLayout } from '@/components/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Protocol: Zero',
  description: 'Terms and Conditions for Protocol: Zero',
};

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent mb-4">
          Terms and Conditions
        </h1>
        <p className="text-foreground/60 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-foreground/80">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Protocol: Zero services, including but not limited to our website, 
              Discord server, and FiveM server, you agree to be bound by these Terms and Conditions. 
              If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Service Description</h2>
            <p>
              Protocol: Zero provides a roleplay gaming experience on the FiveM platform. We offer 
              various services including but not limited to in-game content, Discord community access, 
              and premium memberships. All services are provided "as is" without warranties of any kind.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. User Conduct</h2>
            <p>Users must adhere to the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Follow all server rules and community guidelines</li>
              <li>Respect other players and staff members</li>
              <li>Do not engage in harassment, discrimination, or toxic behavior</li>
              <li>Do not exploit bugs or use unauthorized modifications</li>
              <li>Maintain appropriate language and behavior in all communications</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Purchases and Refunds</h2>
            <p>
              All purchases made through our store are final. Refunds are only available in exceptional 
              circumstances at the discretion of the administration team. Premium memberships and 
              in-game items are non-transferable and bound to your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Account Responsibility</h2>
            <p>
              You are responsible for maintaining the security of your account. You must not share 
              your account credentials with others. Any activity that occurs under your account is 
              your responsibility.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
            <p>
              All content, including but not limited to logos, designs, scripts, and game modifications, 
              are the property of Protocol: Zero. You may not reproduce, distribute, or create derivative 
              works without explicit written permission.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to our services at any time, 
              with or without cause, and with or without notice, for any reason including violation 
              of these terms or server rules.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Limitation of Liability</h2>
            <p>
              Protocol: Zero shall not be liable for any indirect, incidental, special, or consequential 
              damages arising from your use of our services. We do not guarantee uninterrupted or error-free 
              service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. Changes will be 
              effective immediately upon posting. Your continued use of our services after changes 
              are posted constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Contact</h2>
            <p>
              For questions regarding these Terms and Conditions, please contact us through our 
              Discord server or the contact page.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

