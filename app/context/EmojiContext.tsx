'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface EmojiCard {
  id: string;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
}

interface EmojiContextType {
  emojis: EmojiCard[];
  addEmoji: (imageUrl: string, prompt: string) => void;
  toggleLike: (id: string) => void;
}

const EmojiContext = createContext<EmojiContextType | undefined>(undefined);

export function EmojiProvider({ children }: { children: ReactNode }) {
  const [emojis, setEmojis] = useState<EmojiCard[]>([]);

  // Load emojis from API on mount
  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await fetch('/api/emoji');
        if (!response.ok) {
          throw new Error('Failed to fetch emojis');
        }
        const data = await response.json();
        setEmojis(data.emojis || []);
      } catch (error) {
        console.error('Error fetching emojis:', error);
      }
    };

    fetchEmojis();
  }, []);

  const addEmoji = (imageUrl: string, prompt: string) => {
    const newEmoji: EmojiCard = {
      id: Date.now().toString(),
      image_url: imageUrl,
      prompt,
      likes_count: 0,
      creator_user_id: 'temp-id', // This will be set correctly on the server
      created_at: new Date().toISOString()
    };
    setEmojis((prevEmojis) => [newEmoji, ...prevEmojis]);
  };

  const toggleLike = async (id: string) => {
    try {
      const response = await fetch(`/api/emoji/${id}/like`, {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to toggle like');
      
      const data = await response.json();
      
      // Update emojis array with new likes count
      setEmojis((prevEmojis) =>
        prevEmojis.map((emoji) =>
          emoji.id === id
            ? { ...emoji, likes_count: data.likes_count }
            : emoji
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <EmojiContext.Provider value={{ emojis, addEmoji, toggleLike }}>
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