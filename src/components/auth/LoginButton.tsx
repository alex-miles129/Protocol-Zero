'use client';

import { Button } from "@/components/ui/button";
import { Icons } from "@/config/siteConfig";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("discord", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLogin}
      className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground text-background hover:opacity-90 transition-opacity"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Icons.loginDiscord className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Icons.loginDiscord className="mr-2 h-4 w-4" />
          Login with Discord
        </>
      )}
    </Button>
  );
} 