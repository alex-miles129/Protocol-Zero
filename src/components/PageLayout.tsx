import { SiteHeader } from '@/components/SiteHeader';

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-foreground/60">
              © {new Date().getFullYear()} Protocol: Zero. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 flex-wrap justify-center">
              <a href="/terms" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                Terms and Conditions
              </a>
              <a href="/shipping" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                Shipping
              </a>
              <a href="/privacy" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="/contact-us" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 