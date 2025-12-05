'use client';

import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent mb-4">
            Contact Us
          </h1>
          <p className="text-foreground/60 text-lg">
            Have questions or need support? Reach out to us on Discord!
          </p>
        </div>

        <div className="bg-background/50 border border-border/40 rounded-lg p-8 md:p-12 space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-6 rounded-full">
                <MessageCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold">Connect with Us on Discord</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              The best way to reach us is through Discord. Click the button below to connect with our team directly. 
              We're here to help with any questions, support requests, or feedback you may have.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <Button
              onClick={() => window.open('https://discord.com/users/964445991422005278', '_blank')}
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-6 text-lg"
              size="lg"
            >
              Connect Now
            </Button>
            <p className="text-sm text-foreground/60">
              This will open Discord in a new tab
            </p>
          </div>

          <div className="border-t border-border/40 pt-8 space-y-4">
            <h3 className="text-xl font-semibold">Other Ways to Reach Us</h3>
            <div className="space-y-3 text-foreground/70">
              <p>
                <strong className="text-foreground">Discord Server:</strong> Join our community Discord server 
                for general discussions, support, and updates.
              </p>
              <p>
                <strong className="text-foreground">Response Time:</strong> We typically respond within 24-48 hours 
                during business days.
              </p>
              <p>
                <strong className="text-foreground">Support Hours:</strong> Our support team is available 
                Monday through Friday, 9 AM - 6 PM IST.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

