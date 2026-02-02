'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  
  // Ukryj na stronie logowania
  if (pathname === '/auth') return null;
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center gap-1 px-4 ${
            isActive('/') ? 'text-amber-600' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs font-medium">Główna</span>
        </Link>
        
        <Link 
          href="/add" 
          className={`flex flex-col items-center justify-center gap-1 px-4 ${
            isActive('/add') ? 'text-amber-600' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Dodaj</span>
        </Link>
        
        <Link 
          href="/collection" 
          className={`flex flex-col items-center justify-center gap-1 px-4 ${
            isActive('/collection') ? 'text-amber-600' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <span className="text-xs font-medium">Kolekcja</span>
        </Link>
        
        <Link 
          href="/profile" 
          className={`flex flex-col items-center justify-center gap-1 px-4 ${
            isActive('/profile') ? 'text-amber-600' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Profil</span>
        </Link>
      </div>
    </nav>
  );
}
