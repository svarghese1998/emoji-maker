'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useEmoji } from '@/app/context/EmojiContext';
import { AlertTriangle } from 'lucide-react';

export function EmojiGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmoji, setGeneratedEmoji] = useState<string | null>(null);
  const [error, setError] = useState<{ message: string; type?: 'nsfw' | 'general' } | null>(null);
  const { addEmoji } = useEmoji();

  const isValidImageUrl = (url: string | null): url is string => {
    return typeof url === 'string' && url.trim() !== '' && url.startsWith('http');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);
    setGeneratedEmoji(null);

    try {
      console.log('Sending prompt:', prompt);
      
      const response = await fetch('/api/emoji/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate emoji');
      }

      console.log('API Response:', data);
      
      if (isValidImageUrl(data.image_url)) {
        console.log('Valid URL detected, setting generated emoji');
        setGeneratedEmoji(data.image_url);
        addEmoji(data.image_url, prompt);
      } else {
        console.log('Invalid URL received:', data.image_url);
        throw new Error('Invalid or empty image URL received');
      }
    } catch (err: unknown) {
      console.error('Detailed error:', err);
      if (err instanceof Error && err.message === 'NSFW_CONTENT') {
        setError({
          type: 'nsfw',
          message: 'We cannot generate this emoji as the prompt may contain inappropriate content. Please try a different, family-friendly prompt.'
        });
      } else {
        setError({
          type: 'general',
          message: 'Failed to generate emoji. Please try again.'
        });
      }
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderEmojiContent = () => {
    if (isGenerating) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="animate-pulse text-gray-400 text-center">
            <div className="w-8 h-8 border-4 border-t-[#FF4500] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            Generating your emoji...
          </div>
        </div>
      );
    }

    if (error?.type === 'nsfw') {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center px-4">
          <div className="bg-yellow-50 rounded-lg p-6 max-w-md">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Content Warning</h3>
            <p className="text-yellow-700">{error.message}</p>
          </div>
        </div>
      );
    }

    if (!isValidImageUrl(generatedEmoji)) {
      return (
        <div className="text-gray-400 text-center px-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p>Your emoji will appear here</p>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        <Image 
          src={generatedEmoji}
          alt="Generated emoji" 
          fill
          style={{ objectFit: 'contain' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="p-4"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#1a1a2e]">Create Your Custom Emoji</h1>
        <p className="text-gray-600">Enter a prompt and let our AI generate a unique emoji just for you!</p>
      </div>

      <form onSubmit={handleGenerate} className="w-full">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your emoji (e.g., 'happy cat with sunglasses')"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="px-6 py-2 bg-[#FF4500] text-white rounded-lg hover:bg-[#FF5722] transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {error && error.type !== 'nsfw' && (
          <p className="mt-2 text-red-500 text-sm">{error.message}</p>
        )}
      </form>

      <div className="w-[512px] h-[512px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
        {renderEmojiContent()}
      </div>
    </div>
  );
} 