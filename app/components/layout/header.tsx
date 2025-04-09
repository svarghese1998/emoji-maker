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
            fixed inset-0 bg-white z-10 md:hidden
            transition-all duration-300 ease-in-out
            ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
          `}
        >
          <nav className="flex flex-col h-full pt-20" aria-label="Mobile navigation">
            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto">
              <ul className="flex flex-col gap-2 p-4">
                <li>
                  <Link 
                    href="/" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-lg transition-all duration-200 px-4 py-3 rounded-xl flex items-center gap-2 ${
                      isActive('/') 
                        ? 'text-[#FF4500] font-medium bg-[#FF4500]/5' 
                        : 'text-[#2D3047] hover:text-[#FF4500] active:bg-[#2D3047]/5'
                    }`}
                    aria-current={isActive('/') ? 'page' : undefined}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/create" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-lg transition-all duration-200 px-4 py-3 rounded-xl flex items-center gap-2 ${
                      isActive('/create') 
                        ? 'text-[#FF4500] font-medium bg-[#FF4500]/5' 
                        : 'text-[#2D3047] hover:text-[#FF4500] active:bg-[#2D3047]/5'
                    }`}
                    aria-current={isActive('/create') ? 'page' : undefined}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create</span>
                    <span className="emoji-text">✨</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/gallery" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-lg transition-all duration-200 px-4 py-3 rounded-xl flex items-center gap-2 ${
                      isActive('/gallery') 
                        ? 'text-[#FF4500] font-medium bg-[#FF4500]/5' 
                        : 'text-[#2D3047] hover:text-[#FF4500] active:bg-[#2D3047]/5'
                    }`}
                    aria-current={isActive('/gallery') ? 'page' : undefined}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Gallery</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Auth Section */}
            <div className="border-t border-[#2D3047]/10 p-4 bg-gray-50">
              <div className="flex flex-col gap-4">
                {isSignedIn ? (
                  <>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-lg text-[#2D3047] hover:text-[#FF4500] transition-all duration-200 px-4 py-3 rounded-xl hover:bg-[#2D3047]/5 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                    <div className="px-4">
                      <UserButton 
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10 rounded-lg overflow-hidden"
                          }
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <SignInButton mode="modal">
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-lg text-[#2D3047] hover:text-[#FF4500] transition-all duration-200 px-4 py-3 rounded-xl hover:bg-[#2D3047]/5 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
} 