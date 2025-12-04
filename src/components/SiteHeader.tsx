 "use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { siteName, Icons } from '@/config/siteConfig';
import { cn } from '@/lib/utils';
import { UserMenu } from "@/components/auth/UserMenu";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

export function SiteHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo only */}
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10">
            <Icons.logo />
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-[11px] tracking-[0.3em] uppercase">
          <Link
            href="/"
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/how-it-works"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            How it works
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/rules"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                Rules
              </Link>
              <Link
                href="/store"
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                Store
              </Link>
              <UserMenu user={session.user} />
            </>
          ) : (
            <button
              type="button"
              onClick={() => signIn("discord", { callbackUrl: "/" })}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Login
            </button>
          )}
        </nav>

        {/* Mobile: simple menu button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8 text-sm uppercase tracking-[0.2em]">
                <Link
                  href="/"
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  How it works
                </Link>
                {session?.user ? (
                  <>
                    <Link
                      href="/rules"
                      className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                      Rules
                    </Link>
                    <Link
                      href="/store"
                      className="text-foreground/70 hover:text-foreground transition-colors"
                    >
                      Store
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => signIn("discord", { callbackUrl: "/" })}
                    className="text-foreground/70 hover:text-foreground text-left transition-colors"
                  >
                    Login
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
