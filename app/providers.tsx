'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { EmojiProvider } from './context/EmojiContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <EmojiProvider>
        {children}
      </EmojiProvider>
    </ClerkProvider>
  );
} 