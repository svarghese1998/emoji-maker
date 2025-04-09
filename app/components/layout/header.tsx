'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="flex justify-between items-center p-4 max-w-7xl mx-auto w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/ai-moji-logo.svg" alt="AI-moji Logo" width={40} height={40} className="drop-shadow-sm" />
        <span className="text-2xl font-bold text-[#FF4500]">AI-moji</span>
      </Link>
      <nav className="flex items-center gap-6">
        <ul className="flex gap-6">
          <li>
            <Link 
              href="/" 
              className={`transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-[#FF4500] font-medium' 
                  : 'text-[#2D3047] hover:text-[#FF4500]'
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/create" 
              className={`transition-colors duration-200 ${
                isActive('/create') 
                  ? 'text-[#FF4500] font-medium' 
                  : 'text-[#2D3047] hover:text-[#FF4500]'
              }`}
            >
              Create ✨
            </Link>
          </li>
          <li>
            <Link 
              href="/gallery" 
              className={`transition-colors duration-200 ${
                isActive('/gallery') 
                  ? 'text-[#FF4500] font-medium' 
                  : 'text-[#2D3047] hover:text-[#FF4500]'
              }`}
            >
              Gallery
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="text-[#2D3047] hover:text-[#FF4500] transition-colors duration-200">
              Sign In
            </button>
          </SignInButton>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>
    </header>
  );
} 