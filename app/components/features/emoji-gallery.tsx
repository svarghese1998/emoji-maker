'use client';

import Image from 'next/image';
import { Download, Heart, Sparkles } from 'lucide-react';
import { useEmoji } from '@/app/context/EmojiContext';

interface EmojiCard {
  id: string;
  image_url: string;
  prompt: string;
  likes_count: number;
  creator_user_id: string;
  created_at: string;
}

export function EmojiGallery() {
  const { emojis, toggleLike } = useEmoji();

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
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
        {emojis.map((emoji) => (
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
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                <button 
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => handleDownload(emoji.image_url, emoji.prompt)}
                  title="Download Emoji"
                >
                  <Download className="w-6 h-6" />
                </button>
                <button
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => toggleLike(emoji.id)}
                  title="Like"
                >
                  <Heart className={`w-6 h-6 ${emoji.likes_count > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-sm truncate">{emoji.prompt}</p>
              <p className="text-gray-500 text-xs mt-1">{emoji.likes_count} likes</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 