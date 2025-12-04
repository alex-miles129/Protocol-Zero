import React from 'react';
import type { NavItem, TeamMember } from '@/types';
import { Home, Info, ListOrdered, Mail, Store, Users, LogIn, Play, Gamepad2, UserCircle, ExternalLink, Heart, Youtube, Instagram, Discord } from 'lucide-react';

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/#team', icon: Info },
  { label: 'Rules', href: '/rules', icon: ListOrdered },
  { label: 'Contact', href: '/#contact', icon: Mail },
  { label: 'Store', href: 'store', icon: Store },
];

export const teamMembers: TeamMember[] = [
  {
    name: 'John Doe',
    role: 'Lead Developer',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'portrait professional',
  },
  {
    name: 'Jane Smith',
    role: 'Community Manager',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'portrait professional',
  },
  {
    name: 'Alex Johnson',
    role: 'Head Admin',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'portrait professional',
  },
  {
    name: 'Sarah Williams',
    role: 'Content Creator',
    imageUrl: 'https://placehold.co/300x300.png',
    dataAiHint: 'portrait professional',
  },
];

export const siteName = "Protocol: Zero";

export const discordInviteLink = "https://discord.gg/ydtT9UzQUz";
export const fivemJoinLink = "fivem://connect/pmgjr8"; // Replace with actual FiveM server IP or link

export const socialLinks = {
  youtube: "https://youtube.com",
  instagram: "https://instagram.com/crimetownrp",
  discord: discordInviteLink,
};

export const Icons = {
  home: Home,
  info: Info,
  rules: ListOrdered,
  contact: Mail,
  store: Store,
  joinDiscord: Users,
  loginDiscord: LogIn,
  play: Play,
  fivem: Gamepad2,
  user: UserCircle,
  heart: Heart,
  youtube: Youtube,
  instagram: Instagram,
  discord: Discord,
  logo: () => (
    <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" stroke="hsl(var(--foreground))" strokeWidth="5" fill="url(#logoGradient)" />
      <text x="50" y="60" fontFamily="var(--font-geist-sans)" fontSize="30" fill="hsl(var(--primary-foreground))" textAnchor="middle" fontWeight="bold">CT</text>
    </svg>
  )
};

// Footer specific links
export const footerNavigationLinks: NavItem[] = [
  { label: 'Home', href: '/', icon: ExternalLink },
  { label: 'Rules', href: '/rules', icon: ExternalLink },
  { label: 'About', href: '/#team', icon: ExternalLink },
];

export const footerResourceLinks: NavItem[] = [
  { label: 'Apply Now', href: '/profile', icon: ExternalLink },
  { label: 'Store', href: '/store', icon: ExternalLink },
  { label: 'Discord', href: discordInviteLink, icon: ExternalLink },
];
