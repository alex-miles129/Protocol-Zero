'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { discordInviteLink, fivemJoinLink, Icons } from '@/config/siteConfig';
import Link from 'next/link';

interface PlayNowModalProps {
  children: React.ReactNode; // Trigger element
}

export function PlayNowModal({ children }: PlayNowModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">Ready to Play?</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Join our community and dive into the action.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/profile" target="_blank" rel="noopener noreferrer">
              <Icons.joinDiscord className="mr-2 h-5 w-5" /> Apply Now
            </Link>
          </Button>
          <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
             <Link href={fivemJoinLink} target="_blank" rel="noopener noreferrer"> {/* Assuming FiveM link opens in new tab or client */}
              <Icons.fivem className="mr-2 h-5 w-5" /> Join FiveM Server
            </Link>
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
