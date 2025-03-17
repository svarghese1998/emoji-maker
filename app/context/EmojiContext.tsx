'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface EmojiCard {
  id: string;
  imageUrl: string;
  prompt: string;
  likes: number;
}

interface EmojiContextType {
  emojis: EmojiCard[];
  addEmoji: (imageUrl: string, prompt: string) => void;
}

const EmojiContext = createContext<EmojiContextType | undefined>(undefined);

export function EmojiProvider({ children }: { children: ReactNode }) {
  const [emojis, setEmojis] = useState<EmojiCard[]>([
    {
      id: '1',
      imageUrl: '/placeholder.png',
      prompt: 'Happy cat with sunglasses',
      likes: 24,
    },
    {
      id: '2',
      imageUrl: '/placeholder.png',
      prompt: 'Excited dog with party hat',
      likes: 18,
    },
    {
      id: '3',
      imageUrl: '/placeholder.png',
      prompt: 'Sleepy panda with coffee',
      likes: 32,
    },
  ]);

  const addEmoji = (imageUrl: string, prompt: string) => {
    const newEmoji: EmojiCard = {
      id: Date.now().toString(),
      imageUrl,
      prompt,
      likes: 0,
    };
    setEmojis((prevEmojis) => [newEmoji, ...prevEmojis]);
  };

  return (
    <EmojiContext.Provider value={{ emojis, addEmoji }}>
      {children}
    </EmojiContext.Provider>
  );
}

export function useEmoji() {
  const context = useContext(EmojiContext);
  if (context === undefined) {
    throw new Error('useEmoji must be used within an EmojiProvider');
  }
  return context;
} 