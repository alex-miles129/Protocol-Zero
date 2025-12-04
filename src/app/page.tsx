import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { HeroSection } from '@/components/HeroSection';
import { TeamSection } from '@/components/TeamSection';
import { ScrollProgressBar } from '@/components/ScrollProgressBar';

export default function HomePage() {
  return (
    <>
      <ScrollProgressBar />
      <SiteHeader />
      <main className="relative">
        <HeroSection />
        <div className="relative bg-background/40 backdrop-blur-md">
          <TeamSection />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
