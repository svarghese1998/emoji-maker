'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { useEmoji } from '@/app/context/EmojiContext';

interface Emoji {
  id: string;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
  isLiked: boolean;
}

export function EmojiGallery() {
  const { emojis, toggleLike } = useEmoji();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});

  const handleDownload = async (imageUrl: string, prompt: string, emojiId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [emojiId]: true }));
      
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to download image');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emoji-${prompt.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      setErrorStates(prev => ({ ...prev, [emojiId]: true }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [emojiId]: false }));
    }
  };

  const handleLike = async (id: string, isLiked: boolean) => {
    try {
      setLoadingStates(prev => ({ ...prev, [`like-${id}`]: true }));
      await toggleLike(id, isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      setErrorStates(prev => ({ ...prev, [`like-${id}`]: true }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [`like-${id}`]: false }));
    }
  };

  if (emojis.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Emoji Gallery</h2>
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm max-w-md mx-auto text-center">
          <Sparkles className="w-12 h-12 text-[#FF4500] mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Gallery Awaits!</h3>
          <p className="text-gray-600">
            Generate your first emoji above and it will appear here in your personal gallery.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-8">Emoji Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {emojis.map((emoji: Emoji) => (
          <div
            key={emoji.id}
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="relative aspect-square">
              <Image
                src={emoji.image_url}
                alt={emoji.prompt}
                fill
                className="object-contain rounded-lg"
                onError={() => setErrorStates(prev => ({ ...prev, [emoji.id]: true }))}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                {errorStates[emoji.id] ? (
                  <div className="text-white text-center">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm">Failed to load image</p>
                  </div>
                ) : (
                  <>
                    <button 
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                      onClick={() => handleDownload(emoji.image_url, emoji.prompt, emoji.id)}
                      disabled={loadingStates[emoji.id]}
                      title="Download Emoji"
                    >
                      <Download className={`w-6 h-6 ${loadingStates[emoji.id] ? 'animate-pulse' : ''}`} />
                    </button>
                    <button
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                      onClick={() => handleLike(emoji.id, emoji.isLiked)}
                      disabled={loadingStates[`like-${emoji.id}`]}
                      title={emoji.isLiked ? "Unlike Emoji" : "Like Emoji"}
                    >
                      <Heart 
                        className={`w-6 h-6 transition-transform duration-200 hover:scale-110 ${
                          loadingStates[`like-${emoji.id}`] ? 'animate-pulse' : ''
                        } ${emoji.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-sm truncate">{emoji.prompt}</p>
              <div className="flex items-center gap-1 mt-1">
                <Heart 
                  className={`w-4 h-4 ${
                    emoji.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`} 
                />
                <span className="text-gray-500 text-xs">
                  {emoji.likes_count} {emoji.likes_count === 1 ? 'like' : 'likes'}
                </span>
                {errorStates[`like-${emoji.id}`] && (
                  <span className="text-red-500 text-xs ml-2">Failed to update</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 