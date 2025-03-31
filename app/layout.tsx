import './globals.css';
import { type Metadata } from 'next';
import { ClerkProvider, SignedIn, UserButton } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import { EmojiProvider } from './context/EmojiContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI-moji - Create AI-Generated Emojis',
  description: 'Generate unique and custom emojis using AI. Create, share, and download your personalized emojis.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <EmojiProvider>
            <div className="flex flex-col min-h-screen">
              <div className="flex justify-end items-center p-4 gap-4 h-16 bg-white/80 backdrop-blur-sm border-b">
                <SignedIn>
                  <UserButton 
                    afterSignOutUrl="/sign-in"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </SignedIn>
              </div>
              <main className="flex-1">
                {children}
              </main>
            </div>
          </EmojiProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
