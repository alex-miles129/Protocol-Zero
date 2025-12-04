'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const POP_OUT_START_THRESHOLD = 20; // Start popping out at 20% scroll
const POP_OUT_END_THRESHOLD = 80;   // Return to thin after 80% scroll

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPopped, setIsPopped] = useState(false);

  const handleScroll = () => {
    const totalScroll = document.documentElement.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Handle case where windowHeight is 0 to prevent division by zero
    const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;
    
    setScrollProgress(parseFloat(scroll.toFixed(2)));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Call handleScroll once on mount to set initial progress/pop state
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollProgress > POP_OUT_START_THRESHOLD && scrollProgress < POP_OUT_END_THRESHOLD) {
      setIsPopped(true);
    } else {
      setIsPopped(false);
    }
  }, [scrollProgress]);

  return (
    <>
      {/* Thin static background track for the scrollbar */}
      <div className="fixed top-0 left-0 h-full w-[2px] z-[59] bg-red-950/40 backdrop-blur-sm" />

      {/* The dynamic progress indicator */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full z-[60]", // Positioned at the very left edge
          "bg-gradient-to-b from-red-700 via-red-600 to-red-500",
          "shadow-[0_0_3px_theme(colors.red.500),0_0_8px_theme(colors.red.600),0_0_14px_theme(colors.red.700)]",
          "transition-[width] duration-300 ease-in-out", // Animate width changes
          isPopped ? "w-1" : "w-[2px]" // Popped: 4px wide (w-1). Not popped: 2px wide
        )}
        style={{
          transform: `translateY(-${100 - scrollProgress}%)`,
        }}
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </>
  );
}
