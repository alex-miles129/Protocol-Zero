'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkServerMembership = async () => {
      if (session?.user) {
        try {
          await fetch('/api/discord/server-join', {
            method: 'POST',
          });
        } catch (error) {
          console.error('Error checking server membership:', error);
        }
      }
    };

    const checkAdminStatus = async () => {
      if (session?.user) {
        try {
          console.log("Profile - Checking admin status");
          const response = await fetch('/api/admin/check');
          const data = await response.json();
          console.log("Profile - Admin check response:", data);
          setIsAdmin(data.isAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };

    checkServerMembership();
    checkAdminStatus();
  }, [session]);

  if (status === "loading") {
    return (
      <>
        {/* Fixed Background Image */}
        <div className="fixed inset-0 w-full h-full -z-10">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm"
            style={{
              backgroundImage: "url('https://files.fivemerr.com/images/0b45f2fd-c726-4422-9f1b-f0906462a0f8.png')",
            }}
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 container max-w-6xl py-8 min-h-[calc(100vh-4rem-4rem)]">Loading...</div>
      </>
    );
  }

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/admin');
  };

  return (
    <>
      {/* Fixed Background Image */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm"
          style={{
            backgroundImage: "url('https://files.fivemerr.com/images/0b45f2fd-c726-4422-9f1b-f0906462a0f8.png')",
          }}
        />
        {/* Dark overlay with blur for better text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 container max-w-6xl py-8 min-h-[calc(100vh-4rem-4rem)]">
      <div className="w-full max-w-3xl mx-auto">
        <h1 
          className={cn(
            "text-4xl font-bold mb-8 text-foreground transition-all duration-300",
            "hover:text-transparent hover:bg-clip-text",
            "hover:bg-gradient-to-r hover:from-foreground hover:via-foreground/80 hover:to-foreground",
            "cursor-default"
          )}
        >
          Your Profile
        </h1>
        <Card className="bg-card/50 backdrop-blur border-border/20">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar className="h-20 w-20 border-2 border-border/20">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-2xl">{session?.user?.name}</CardTitle>
              <CardDescription>{session?.user?.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">Discord ID</h3>
                <p className="text-muted-foreground">{session?.user?.id}</p>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Account Status</h3>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <p className="text-muted-foreground">Verified Discord User</p>
                </div>
              </div>
              <div className="pt-4 space-y-3 border-t border-border/20">
                <Button 
                  asChild
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="lg"
                >
                  <Link href="/applications">
                    Applications
                  </Link>
                </Button>
                {isAdmin && (
                  <Button 
                    onClick={handleAdminClick}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                    size="lg"
                  >
                    Admin Panel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
} 