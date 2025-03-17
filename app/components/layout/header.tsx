import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="flex justify-between items-center p-4 max-w-7xl mx-auto w-full">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/palette.png" alt="EmojiCraft Logo" width={32} height={32} />
        <span className="text-2xl font-bold text-[#FF4500]">EmojiCraft</span>
      </Link>
      <nav>
        <ul className="flex gap-6">
          <li><Link href="/" className="text-black hover:text-[#FF4500]">Home</Link></li>
          <li><Link href="/gallery" className="text-black hover:text-[#FF4500]">Gallery</Link></li>
          <li><Link href="/about" className="text-black hover:text-[#FF4500]">About</Link></li>
        </ul>
      </nav>
    </header>
  );
} 