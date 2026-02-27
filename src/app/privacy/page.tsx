import { PageLayout } from '@/components/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Protocol: Zero',
  description: 'Privacy Policy for Protocol: Zero',
};

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent mb-4">
          Privacy Policy
        </h1>
        <p className="text-foreground/60 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-foreground/80">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Username, email address, and Discord ID</li>
              <li><strong>Game Data:</strong> In-game statistics, character information, and gameplay records</li>
              <li><strong>Purchase Information:</strong> Transaction history and payment details (processed securely through third-party providers)</li>
              <li><strong>Communication Data:</strong> Messages sent through our Discord server and support channels</li>
              <li><strong>Technical Data:</strong> IP address, device information, and connection logs for security purposes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p>We use collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our gaming services</li>
              <li>To process transactions and manage your account</li>
              <li>To communicate with you about your account and our services</li>
              <li>To enforce server rules and maintain a safe gaming environment</li>
              <li>To improve our services and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information. We may share your information only in the 
              following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With payment processors to complete transactions (they have their own privacy policies)</li>
              <li>With service providers who assist in operating our services (under strict confidentiality agreements)</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, 
              no method of transmission over the internet is 100% secure. While we strive to protect 
              your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt-out of certain communications</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p>
              To exercise these rights, please contact us through our Discord support channel.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our 
              website. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Third-Party Services</h2>
            <p>
              Our services may contain links to third-party websites or services. We are not responsible 
              for the privacy practices of these external sites. We encourage you to review their 
              privacy policies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Children's Privacy</h2>
            <p>
              Our services are not intended for users under the age of 13. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a 
              child, please contact us immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and 
              comply with legal obligations. When you delete your account, we will delete or anonymize 
              your personal data within 30 days, except where we are required to retain it by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant 
              changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please 
              contact us through our Discord support channel.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}


