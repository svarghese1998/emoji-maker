'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface EmojiCard {
  id: string;
  imageUrl: string;
  prompt: string;
  likes: number;
}

interface EmojiContextType {
  emojis: EmojiCard[];
  likedEmojis: Set<string>;
  addEmoji: (imageUrl: string, prompt: string) => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
}

const EmojiContext = createContext<EmojiContextType | undefined>(undefined);

export function EmojiProvider({ children }: { children: ReactNode }) {
  const [emojis, setEmojis] = useState<EmojiCard[]>([]);
  const [likedEmojis, setLikedEmojis] = useState<Set<string>>(new Set());

  // Load liked emojis from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedEmojis');
    if (savedLikes) {
      setLikedEmojis(new Set(JSON.parse(savedLikes)));
    }
  }, []);

  const addEmoji = (imageUrl: string, prompt: string) => {
    const newEmoji: EmojiCard = {
      id: Date.now().toString(),
      imageUrl,
      prompt,
      likes: 0,
    };
    setEmojis((prevEmojis) => [newEmoji, ...prevEmojis]);
  };

  const toggleLike = (id: string) => {
    const isCurrentlyLiked = likedEmojis.has(id);
    
    // Update liked emojis set
    const newLikedEmojis = new Set(likedEmojis);
    if (isCurrentlyLiked) {
      newLikedEmojis.delete(id);
    } else {
      newLikedEmojis.add(id);
    }
    
    // Update emojis array
    setEmojis((prevEmojis) =>
      prevEmojis.map((emoji) =>
        emoji.id === id
          ? {
              ...emoji,
              likes: isCurrentlyLiked
                ? Math.max(0, emoji.likes - 1)
                : emoji.likes + 1,
            }
          : emoji
      )
    );

    // Update liked emojis state and localStorage
    setLikedEmojis(newLikedEmojis);
    localStorage.setItem('likedEmojis', JSON.stringify([...newLikedEmojis]));
  };

  const isLiked = (id: string) => likedEmojis.has(id);

  return (
    <EmojiContext.Provider value={{ emojis, likedEmojis, addEmoji, toggleLike, isLiked }}>
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