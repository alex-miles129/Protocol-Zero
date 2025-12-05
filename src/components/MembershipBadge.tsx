'use client';

import React from 'react';

interface MembershipBadgeProps {
  type: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'ultimate' | 'supreme';
  className?: string;
}

export function MembershipBadge({ type, className = '' }: MembershipBadgeProps) {
  const badgeConfig = {
    bronze: {
      mainColor: '#CD7F32',
      lightColor: '#E6A85C',
      darkColor: '#8B5A2B',
      starColor: '#FFD700',
    },
    silver: {
      mainColor: '#C0C0C0',
      lightColor: '#E8E8E8',
      darkColor: '#808080',
      starColor: '#FFFFFF',
    },
    gold: {
      mainColor: '#FFD700',
      lightColor: '#FFE44D',
      darkColor: '#B8860B',
      starColor: '#FFFFFF',
    },
    platinum: {
      mainColor: '#E5E4E2',
      lightColor: '#F5F5F5',
      darkColor: '#B8B8B8',
      starColor: '#FFD700',
      accentColor: '#4169E1',
    },
    diamond: {
      mainColor: '#00BFFF',
      lightColor: '#4DD0E1',
      darkColor: '#0080FF',
      starColor: '#FFFFFF',
    },
    ultimate: {
      mainColor: '#00FF7F',
      lightColor: '#4DFF9F',
      darkColor: '#00CC66',
      starColor: '#FFD700',
    },
    supreme: {
      mainColor: '#9D00FF',
      lightColor: '#B84DFF',
      darkColor: '#6B00CC',
      starColor: '#FFD700',
    },
  };

  const config = badgeConfig[type];

  return (
    <div className={`relative ${className}`}>
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`mainGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.lightColor} stopOpacity="1" />
            <stop offset="50%" stopColor={config.mainColor} stopOpacity="1" />
            <stop offset="100%" stopColor={config.darkColor} stopOpacity="1" />
          </linearGradient>
          <filter id={`glow-${type}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Left wing */}
        <path
          d="M 25 50 L 15 60 L 20 70 L 25 80 L 35 85 L 45 80 L 50 70 L 45 60 L 35 55 Z"
          fill={`url(#mainGrad-${type})`}
          filter={`url(#glow-${type})`}
          className="drop-shadow-lg"
        />

        {/* Center badge - hexagon/shield */}
        <path
          d="M 55 35 L 85 35 L 95 45 L 95 65 L 85 75 L 55 75 L 45 65 L 45 45 Z"
          fill={`url(#mainGrad-${type})`}
          filter={`url(#glow-${type})`}
          className="drop-shadow-lg"
        />

        {/* Right wing */}
        <path
          d="M 95 45 L 105 55 L 100 65 L 95 75 L 85 80 L 75 75 L 70 65 L 75 55 L 85 50 Z"
          fill={`url(#mainGrad-${type})`}
          filter={`url(#glow-${type})`}
          className="drop-shadow-lg"
        />

        {/* Star in center */}
        <path
          d="M 70 50 L 72 58 L 80 58 L 73 63 L 75 71 L 70 66 L 65 71 L 67 63 L 60 58 L 68 58 Z"
          fill={config.starColor}
          className="drop-shadow-md"
          opacity="0.95"
        />

        {/* Platinum special design - crossed swords */}
        {type === 'platinum' && (
          <>
            <path
              d="M 60 50 L 65 45 L 70 50 L 65 55 Z"
              fill={config.starColor}
              opacity="0.9"
            />
            <path
              d="M 70 50 L 75 45 L 80 50 L 75 55 Z"
              fill={config.starColor}
              opacity="0.9"
            />
            <line
              x1="55"
              y1="45"
              x2="85"
              y2="65"
              stroke={config.accentColor}
              strokeWidth="1.5"
              opacity="0.6"
            />
            <line
              x1="85"
              y1="45"
              x2="55"
              y2="65"
              stroke={config.accentColor}
              strokeWidth="1.5"
              opacity="0.6"
            />
          </>
        )}

        {/* Diamond facets */}
        {type === 'diamond' && (
          <>
            <path
              d="M 70 45 L 75 50 L 70 55 L 65 50 Z"
              fill="#FFFFFF"
              opacity="0.4"
            />
            <path
              d="M 70 55 L 75 60 L 70 65 L 65 60 Z"
              fill="#FFFFFF"
              opacity="0.4"
            />
            <path
              d="M 65 50 L 70 55 L 65 60 L 60 55 Z"
              fill="#FFFFFF"
              opacity="0.3"
            />
            <path
              d="M 75 50 L 80 55 L 75 60 L 70 55 Z"
              fill="#FFFFFF"
              opacity="0.3"
            />
          </>
        )}

        {/* Ultimate tier - emerald green with gold accents */}
        {type === 'ultimate' && (
          <>
            <circle cx="70" cy="55" r="10" fill={config.starColor} opacity="0.7" />
            <path
              d="M 60 45 L 80 45 L 75 55 L 65 55 Z"
              fill={config.mainColor}
              opacity="0.5"
            />
            <path
              d="M 65 55 L 75 55 L 70 65 L 60 60 Z"
              fill={config.mainColor}
              opacity="0.5"
            />
          </>
        )}
      </svg>
    </div>
  );
}

