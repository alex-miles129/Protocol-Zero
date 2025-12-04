import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Protocol: Zero',
  description: 'Learn how Protocol: Zero works with tailor-made scripts, blockchain technology, and robust infrastructure.',
};

export default function HowItWorksPage() {
  return (
    <>
      <ScrollProgressBar />
      <SiteHeader />
      <main className="relative">
        <HowItWorksSection />
      </main>
      <SiteFooter />
    </>
  );
}

