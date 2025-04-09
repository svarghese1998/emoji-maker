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
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
          <meta name="theme-color" content="#FF4500" />
        </head>
        <body className={`${inter.className} bg-gradient-custom min-h-screen [font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe_UI,Roboto,Inter,sans-serif,'Apple_Color_Emoji','Segoe_UI_Emoji'] touch-pan-y`}>
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
