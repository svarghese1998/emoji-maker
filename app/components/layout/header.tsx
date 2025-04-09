'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, signOut } = useAuth();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (path: string) => pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false); // Close mobile menu if open
  };

  const AuthButton = () => {
    if (isSignedIn) {
      return (
        <button 
          onClick={handleSignOut}
          className="text-[#2D3047] hover:text-[#FF4500] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-[#2D3047]/5"
        >
          Sign Out
        </button>
      );
    }
    return (
      <SignInButton mode="modal">
        <button className="text-[#2D3047] hover:text-[#FF4500] transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-[#2D3047]/5">
          Sign In
        </button>
      </SignInButton>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="relative flex justify-between items-center p-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 z-20">
          <Image src="/ai-moji-logo.svg" alt="AI-moji Logo" width={40} height={40} className="drop-shadow-sm" priority />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#FFB5A7] to-[#FF8FA3] bg-clip-text text-transparent">
            AI-moji
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden z-20 p-2 touch-manipulation"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
        >
          <div className={`w-6 h-0.5 bg-[#2D3047] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-6 h-0.5 bg-[#2D3047] my-1.5 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-[#2D3047] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Desktop navigation">
          <ul className="flex gap-6">
            <li>
              <Link 
                href="/" 
                className={`transition-colors duration-200 px-3 py-2 rounded-lg ${
                  isActive('/') 
                    ? 'text-[#FF4500] font-medium' 
                    : 'text-[#2D3047] hover:text-[#FF4500] hover:bg-[#2D3047]/5'
                }`}
                aria-current={isActive('/') ? 'page' : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/create" 
                className={`transition-colors duration-200 px-3 py-2 rounded-lg ${
                  isActive('/create') 
                    ? 'text-[#FF4500] font-medium' 
                    : 'text-[#2D3047] hover:text-[#FF4500] hover:bg-[#2D3047]/5'
                }`}
                aria-current={isActive('/create') ? 'page' : undefined}
              >
                Create ✨
              </Link>
            </li>
            <li>
              <Link 
                href="/gallery" 
                className={`transition-colors duration-200 px-3 py-2 rounded-lg ${
                  isActive('/gallery') 
                    ? 'text-[#FF4500] font-medium' 
                    : 'text-[#2D3047] hover:text-[#FF4500] hover:bg-[#2D3047]/5'
                }`}
                aria-current={isActive('/gallery') ? 'page' : undefined}
              >
                Gallery
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-4 pl-4 border-l border-[#2D3047]/10">
            <AuthButton />
            {isSignedIn && <UserButton afterSignOutUrl="/"/>}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div 
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`
            fixed inset-0 bg-white/95 backdrop-blur-sm z-10 md:hidden
            transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <nav className="flex flex-col items-center justify-center h-full" aria-label="Mobile navigation">
            <ul className="flex flex-col gap-8 text-center">
              <li>
                <Link 
                  href="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl transition-colors duration-200 px-6 py-3 rounded-xl inline-block min-w-[200px] ${
                    isActive('/') 
                      ? 'text-[#FF4500] font-medium bg-[#FF4500]/5' 
                      : 'text-[#2D3047] hover:text-[#FF4500] active:bg-[#2D3047]/5'
                  }`}
                  aria-current={isActive('/') ? 'page' : undefined}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/create" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl transition-colors duration-200 px-6 py-3 rounded-xl inline-block min-w-[200px] ${
                    isActive('/create') 
                      ? 'text-[#FF4500] font-medium bg-[#FF4500]/5' 
                      : 'text-[#2D3047] hover:text-[#FF4500] active:bg-[#2D3047]/5'
                  }`}
                  aria-current={isActive('/create') ? 'page' : undefined}
                >
                  Create ✨
                </Link>
              </li>
              <li>
                <Link 
                  href="/gallery" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl transition-colors duration-200 px-6 py-3 rounded-xl inline-block min-w-[200px] ${
                    isActive('/gallery') 
                      ? 'text-[#FF4500] font-medium bg-[#FF4500]/5' 
                      : 'text-[#2D3047] hover:text-[#FF4500] active:bg-[#2D3047]/5'
                  }`}
                  aria-current={isActive('/gallery') ? 'page' : undefined}
                >
                  Gallery
                </Link>
              </li>
              <li className="mt-4">
                <div className="flex flex-col items-center gap-6">
                  {isSignedIn ? (
                    <>
                      <button 
                        onClick={handleSignOut}
                        className="text-xl text-[#2D3047] hover:text-[#FF4500] transition-colors duration-200 px-6 py-3 rounded-xl hover:bg-[#2D3047]/5 min-w-[200px]"
                      >
                        Sign Out
                      </button>
                      <UserButton afterSignOutUrl="/"/>
                    </>
                  ) : (
                    <SignInButton mode="modal">
                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="text-xl text-[#2D3047] hover:text-[#FF4500] transition-colors duration-200 px-6 py-3 rounded-xl hover:bg-[#2D3047]/5 min-w-[200px]"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  )}
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 