import Image from 'next/image';
import { Download, Heart } from 'lucide-react';

interface EmojiCard {
  id: string;
  imageUrl: string;
  prompt: string;
  likes: number;
}

export function EmojiGallery() {
  // This would come from your database in a real app
  const emojis: EmojiCard[] = [
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
  ];

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
                src={emoji.imageUrl}
                alt={emoji.prompt}
                fill
                className="object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                  <Download className="w-6 h-6" />
                </button>
                <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-gray-700">{emoji.prompt}</p>
            <div className="flex items-center gap-1 mt-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">{emoji.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 