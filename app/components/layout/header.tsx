import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 max-w-7xl mx-auto w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/ai-moji-logo.svg" alt="AI-moji Logo" width={40} height={40} className="drop-shadow-sm" />
        <span className="text-2xl font-bold text-[#FF4500]">AI-moji</span>
      </Link>
      <nav className="flex items-center gap-6">
        <ul className="flex gap-6">
          <li><Link href="/" className="text-black hover:text-[#FF4500]">Home</Link></li>
          <li><Link href="/gallery" className="text-black hover:text-[#FF4500]">Gallery</Link></li>
          <li><Link href="/about" className="text-black hover:text-[#FF4500]">About</Link></li>
        </ul>
        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <button className="text-black hover:text-[#FF4500]">Sign In</button>
          </SignInButton>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>
    </header>
  );
} 