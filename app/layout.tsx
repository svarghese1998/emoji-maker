import React from 'react';
import './globals.css';
import { type Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { EmojiProvider } from './context/EmojiContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Emoji Maker',
  description: 'Create custom emojis using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <EmojiProvider>
            <div className="flex flex-col min-h-screen">
              {children}
            </div>
          </EmojiProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
