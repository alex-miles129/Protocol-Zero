'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [previousChildren, setPreviousChildren] = useState<React.ReactNode>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevOpacity, setPrevOpacity] = useState(1);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Only transition if pathname actually changed
    if (pathname !== prevPathnameRef.current) {
      setIsTransitioning(true);
      setPreviousChildren(displayChildren);
      setPrevOpacity(1);
      prevPathnameRef.current = pathname;
      
      // Start crossfade: new page fades in while old page fades out
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        // Fade out previous page
        setPrevOpacity(0);
        // Complete the transition
        setTimeout(() => {
          setIsTransitioning(false);
          setPreviousChildren(null);
          setPrevOpacity(1);
        }, 500);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // Pathname didn't change, just update children
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div className="relative w-full min-h-screen">
      {/* Previous page - fading out */}
      {previousChildren && isTransitioning && (
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out"
          style={{ 
            pointerEvents: 'none',
            zIndex: 1,
            opacity: prevOpacity
          }}
        >
          {previousChildren}
        </div>
      )}
      
      {/* Current page - fading in */}
      <div
        className={`relative transition-opacity duration-500 ease-in-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ zIndex: 2 }}
      >
        {displayChildren}
      </div>
    </div>
  );
}

