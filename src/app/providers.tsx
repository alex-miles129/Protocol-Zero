'use client';

import { SessionProvider } from "next-auth/react";
import { BasketProvider } from "@/contexts/BasketContext";
 
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BasketProvider>
        {children}
      </BasketProvider>
    </SessionProvider>
  );
} 