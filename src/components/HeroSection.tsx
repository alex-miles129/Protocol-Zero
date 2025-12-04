"use client";
import { Button } from '@/components/ui/button';
import { Icons } from '@/config/siteConfig';
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <>
      {/* Background: static cinematic image with dark-to-red overlay */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center brightness-75"
          style={{
            backgroundImage:
              "url('https://files.fivemerr.com/images/a263eed9-088f-4cf7-b47b-efd4f327fd05.png')",
          }}
        />
        {/* Overlay: keep dark focus on left, no red tint on right side */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <section className="relative min-h-screen flex items-center">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-16 py-24 flex flex-col lg:flex-row items-center lg:items-center">
          {/* Left column: copy + CTA */}
          <div className="w-full lg:w-1/2 max-w-xl space-y-6 text-left">
            <p className="text-sm sm:text-base tracking-[0.25em] text-foreground/70 uppercase">
              Welcome to
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground via-[#0c0c18] to-foreground">
              Protocol: Zero
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-foreground/80 max-w-lg">
              A high-intensity survival roleplay experience set in a collapsing city. Forge alliances, make impossible choices,
              and carve your legacy out of the chaos.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              {session?.user ? (
                <Button
                  size="lg"
                  asChild
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-8 rounded-full shadow-lg shadow-red-900/40 transition-transform duration-200 hover:scale-105"
                >
                  <Link href="/profile">
                    <Icons.play className="mr-2 h-5 w-5" />
                    Apply Now
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-8 rounded-full shadow-lg shadow-red-900/40 transition-transform duration-200 hover:scale-105"
                  onClick={() => signIn("discord", { callbackUrl: "/" })}
                >
                  <Icons.loginDiscord className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              )}
            </div>
          </div>

          {/* Right spacer to mimic composition (image is handled by background) */}
          <div className="hidden lg:block w-1/2" />
        </div>

        {/* Scroll Indicator - Three Downward Chevrons */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-[2px] animate-pulse">
          {/* Top arrow - darkest */}
          <svg
            className="w-6 h-6 text-red-900 drop-shadow-[0_0_8px_rgba(127,29,29,0.8)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          {/* Middle arrow - lighter */}
          <svg
            className="w-6 h-6 text-red-700 drop-shadow-[0_0_8px_rgba(185,28,28,0.8)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          {/* Bottom arrow - lightest */}
          <svg
            className="w-6 h-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>
    </>
  );
}
// Note for AI: The Image component used for background is a placeholder for a looping video.
// The "filter blur-sm brightness-50" classes are to simulate the video effect.
