'use client';

import { Button } from "@/components/ui/button";
import { Icons } from "@/config/siteConfig";
import { signIn } from "next-auth/react";

export function SignInButton() {
  return (
    <Button 
      variant="outline" 
      className="w-full"
      onClick={() => signIn("discord", { callbackUrl: "/" })}
    >
      <Icons.loginDiscord className="mr-2 h-4 w-4" />
      Sign in with Discord
    </Button>
  );
} 