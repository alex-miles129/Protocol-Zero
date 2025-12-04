import React from 'react';
import Image from 'next/image';
import type { NavItem, TeamMember } from '@/types';
import { Home, Info, ListOrdered, Mail, Store, Users, LogIn, Play, Gamepad2, UserCircle, Heart, ExternalLink } from 'lucide-react';

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/#team', icon: Info },
  { label: 'Rules', href: '/rules', icon: ListOrdered },
  { label: 'Contact', href: '/#contact', icon: Mail },
  { label: 'Store', href: 'https://crimetownrp.tebex.io/', icon: Store },
];

export const teamMembers: TeamMember[] = [
  {
    name: 'Alex Miles',
    role: 'Lead Developer & Founder',
    imageUrl: 'https://files.fivemerr.com/images/3010e41f-bc18-4445-9cc3-63c375e897c1.png',
    dataAiHint: 'portrait professional',
  },
  {
    name: 'Im Aviral',
    role: 'Developer & Founder',
    imageUrl: 'https://files.fivemerr.com/images/ea37b94a-7f3d-48a1-ac76-07a5f7be8d69.png',
    dataAiHint: 'portrait professional',
  },
  {
    name: 'XYZ',
    role: 'Management',
    imageUrl: 'https://files.fivemerr.com/images/3010e41f-bc18-4445-9cc3-63c375e897c1.png',
    dataAiHint: 'portrait professional',
  },
  {
    name: 'XYY',
    role: 'Management',
    imageUrl: 'https://files.fivemerr.com/images/3010e41f-bc18-4445-9cc3-63c375e897c1.png',
    dataAiHint: 'portrait professional',
  },
  
];

export const siteName = "Protocol: Zero";

export const discordInviteLink = "https://discord.gg/ydtT9UzQUz"; // General Discord invite
export const fivemJoinLink = "fivem://connect/pmgjr8"; // Replace with actual FiveM server IP or link

// Footer specific links
export const footerNavigationLinks: NavItem[] = [
  { label: 'Home', href: '/', icon: ExternalLink },
  { label: 'Rules', href: '/rules', icon: ExternalLink },
  { label: 'Quick Links', href: '#quick-links', icon: ExternalLink },
];

export const footerResourceLinks: NavItem[] = [
  { label: 'Apply Now', href: '/profile', icon: ExternalLink },
  { label: 'Store', href: 'https://crimetownrp.tebex.io/', icon: ExternalLink },
  { label: 'Discord', href: discordInviteLink, icon: ExternalLink },
];


export const socialLinks = {
  youtube: "https://youtube.com",
  instagram: "https://instagram.com",
  discord: discordInviteLink,
}

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
  logo: () => (
    <Image
      src="https://files.fivemerr.com/images/39e7f953-1e9f-4767-9387-2f0fb46fe926.png"
      alt="Protocol: Zero Logo"
      width={48}
      height={48}
      unoptimized
    />
  ),
  youtube: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.5823 6.7009C21.3263 5.7959 20.6223 5.1069 19.7053 4.8669C18.0433 4.4189 12.0003 4.4189 12.0003 4.4189C12.0003 4.4189 5.95734 4.4189 4.29534 4.8669C3.37834 5.1069 2.67434 5.7959 2.41834 6.7009C2.14834 7.6859 2.14834 12.0009 2.14834 12.0009C2.14834 12.0009 2.14834 16.3159 2.41834 17.2999C2.67434 18.2049 3.37834 18.8939 4.29534 19.1339C5.95734 19.5819 12.0003 19.5819 12.0003 19.5819C12.0003 19.5819 18.0433 19.5819 19.7053 19.1339C20.6223 18.8939 21.3263 18.2049 21.5823 17.2999C21.8523 16.3159 21.8523 12.0009 21.8523 12.0009C21.8523 12.0009 21.8523 7.6859 21.5823 6.7009Z" fill="#FF0000"/>
      <path d="M9.75007 14.8641V9.13715L14.6251 12.0006L9.75007 14.8641Z" fill="white"/>
    </svg>
  ),
  instagram: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="instaGradient" cx="0.3" cy="0.7" r="1">
          <stop offset="0" stopColor="#FFDC80"/>
          <stop offset="0.25" stopColor="#FCB045"/>
          <stop offset="0.5" stopColor="#FD1D1D"/>
          <stop offset="0.75" stopColor="#E1306C"/>
          <stop offset="1" stopColor="#833AB4"/>
        </radialGradient>
      </defs>
      <path d="M12 2.163C10.0638 2.163 9.77052 2.17067 9.01009 2.2052C8.24966 2.23973 7.61101 2.35685 7.0001 2.59108C6.3857 2.82784 5.83137 3.16596 5.32091 3.67643C4.81044 4.18689 4.47232 4.74122 4.23556 5.35562C4.00133 5.96654 3.88421 6.60519 3.84968 7.36562C3.81515 8.12605 3.80748 8.41933 3.80748 10.3555V13.6445C3.80748 15.5807 3.81515 15.8739 3.84968 16.6344C3.88421 17.3948 4.00133 18.0335 4.23556 18.6444C4.47232 19.2588 4.81044 19.8131 5.32091 20.3236C5.83137 20.8341 6.3857 21.1722 7.0001 21.4089C7.61101 21.6432 8.24966 21.7603 9.01009 21.7948C9.77052 21.8293 10.0638 21.837 12 21.837C13.9362 21.837 14.2295 21.8293 14.9899 21.7948C15.7503 21.7603 16.389 21.6432 16.9999 21.4089C17.6143 21.1722 18.1686 20.8341 18.6791 20.3236C19.1896 19.8131 19.5277 19.2588 19.7644 18.6444C19.9987 18.0335 20.1158 17.3948 20.1503 16.6344C20.1848 15.8739 20.1925 15.5807 20.1925 13.6445V10.3555C20.1925 8.41933 20.1848 8.12605 20.1503 7.36562C20.1158 6.60519 19.9987 5.96654 19.7644 5.35562C19.5277 4.74122 19.1896 4.18689 18.6791 3.67643C18.1686 3.16596 17.6143 2.82784 16.9999 2.59108C16.389 2.35685 15.7503 2.23973 14.9899 2.2052C14.2295 2.17067 13.9362 2.163 12 2.163Z" fill="url(#instaGradient)"/>
      <path d="M12 6.84656C9.16227 6.84656 6.84656 9.16227 6.84656 12C6.84656 14.8377 9.16227 17.1534 12 17.1534C14.8377 17.1534 17.1534 14.8377 17.1534 12C17.1534 9.16227 14.8377 6.84656 12 6.84656ZM12 15.3645C10.1455 15.3645 8.63545 13.8545 8.63545 12C8.63545 10.1455 10.1455 8.63545 12 8.63545C13.8545 8.63545 15.3645 10.1455 15.3645 12C15.3645 13.8545 13.8545 15.3645 12 15.3645Z" fill="white"/>
      <circle cx="16.9092" cy="7.09078" r="1.22727" fill="white"/>
    </svg>
  ),
  discord: () => (
    <svg width="20" height="20" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
        <g>
            <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fillRule="nonzero">
            </path>
        </g>
    </svg>
  )
};

    