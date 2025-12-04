import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white" style={{
            textShadow: '0 0 20px rgba(255,255,255,0.5)',
            filter: 'drop-shadow(2px 0 0 rgba(255,0,0,0.3)) drop-shadow(-2px 0 0 rgba(0,255,255,0.3))'
          }}>
            404
          </h1>
          <div className="h-16 w-px bg-gray-400"></div>
          <p className="text-xl md:text-2xl text-white font-light">
            This page could not be found.
          </p>
        </div>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors mt-8"
        >
          <Home className="w-4 h-4" />
          Go back home
        </Link>
      </div>
    </div>
  );
}

