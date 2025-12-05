'use client';

import { useEffect } from 'react';
import { PageLayout } from '@/components/PageLayout';

export default function ContactPage() {
  useEffect(() => {
    // Redirect to Discord user profile
    window.location.href = 'https://discord.com/users/964445991422005278';
  }, []);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto text-center py-24">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent mb-4">
          Contact Us
        </h1>
        <p className="text-foreground/60 mb-8">
          Redirecting you to Discord...
        </p>
        <p className="text-foreground/80">
          If you are not redirected automatically,{' '}
          <a 
            href="https://discord.com/users/964445991422005278" 
            className="text-primary hover:underline"
          >
            click here
          </a>
          {' '}to contact us on Discord.
        </p>
      </div>
    </PageLayout>
  );
}

