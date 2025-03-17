'use client';

import Image from 'next/image';
import { Download, Heart, Sparkles } from 'lucide-react';
import { useEmoji } from '@/app/context/EmojiContext';

interface EmojiCard {
  id: string;
  imageUrl: string;
  prompt: string;
  likes: number;
}

export function EmojiGallery() {
  const { emojis, toggleLike, isLiked } = useEmoji();

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
        {emojis.map((emoji) => {
          const liked = isLiked(emoji.id);
          return (
            <div
              key={emoji.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="relative aspect-square">
                <Image
                  src={emoji.imageUrl}
                  alt={emoji.prompt}
                  fill
                  className="object-contain rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                  <button 
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => handleDownload(emoji.imageUrl, emoji.prompt)}
                    title="Download Emoji"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-gray-700 flex-1">{emoji.prompt}</p>
                <button 
                  onClick={() => toggleLike(emoji.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                    liked 
                      ? 'bg-red-50 text-red-500' 
                      : 'hover:bg-gray-100'
                  }`}
                  title={liked ? 'Unlike Emoji' : 'Like Emoji'}
                >
                  <Heart 
                    className={`w-4 h-4 transition-colors ${
                      liked ? 'fill-red-500' : ''
                    }`}
                  />
                  <span className={`text-sm ${
                    liked ? 'text-red-500' : 'text-gray-600'
                  }`}>
                    {emoji.likes}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
} 