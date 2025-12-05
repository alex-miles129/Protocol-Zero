import { PageLayout } from '@/components/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Protocol: Zero',
  description: 'Shipping and delivery policy for Protocol: Zero',
};

export default function ShippingPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent mb-4">
          Shipping Policy
        </h1>
        <p className="text-foreground/60 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-foreground/80">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Digital Products and Services</h2>
            <p>
              Protocol: Zero primarily offers digital products and services including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Premium memberships</li>
              <li>In-game items and currency</li>
              <li>Discord roles and access</li>
              <li>Virtual property and vehicles</li>
            </ul>
            <p>
              All digital products are delivered instantly upon successful payment. You will receive 
              immediate access to your purchased items through your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Delivery Time</h2>
            <p>
              Digital products are typically delivered within 24 hours of purchase. In most cases, 
              items are available immediately after payment confirmation. If you do not receive 
              your items within 24 hours, please contact our support team.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Physical Products</h2>
            <p>
              Currently, Protocol: Zero does not offer physical products for sale. If this changes 
              in the future, shipping information will be updated accordingly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Delivery Confirmation</h2>
            <p>
              Upon successful delivery of digital items, you will receive a confirmation email or 
              in-game notification. Please ensure your account email is up to date to receive 
              delivery confirmations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Issues with Delivery</h2>
            <p>
              If you experience any issues with receiving your purchased items:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Check your account inventory or membership status</li>
              <li>Verify that payment was successfully processed</li>
              <li>Wait up to 24 hours for automatic processing</li>
              <li>Contact our support team through Discord if issues persist</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">International Availability</h2>
            <p>
              Our digital services are available worldwide. There are no geographical restrictions 
              on accessing our digital products and services, provided you have a stable internet 
              connection and meet our service requirements.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p>
              For questions regarding shipping or delivery of your purchases, please contact our 
              support team through Discord.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

