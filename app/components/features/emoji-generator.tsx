'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useEmoji } from '@/app/context/EmojiContext';
import { AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function EmojiGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedEmoji, setGeneratedEmoji] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<{ type: string; message: string } | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const { addEmoji } = useEmoji();

  const triggerConfetti = () => {
    // Fire multiple confetti bursts
    const count = 3;
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.5,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['#FFB5A7', '#FF8FA3', '#FF6571', '#FFC7B8', '#FFD6CC']
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(200 * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const isValidImageUrl = (url: string | null): url is string => {
    return typeof url === 'string' && url.trim() !== '' && url.startsWith('http');
  };

  // Add polling effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 30;

    const checkPrediction = async () => {
      if (!predictionId) return;

      try {
        const response = await fetch(`/api/emoji/status/${predictionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check prediction status');
        }

        if (data.status === 'succeeded' && data.image_url) {
          setGeneratedEmoji(data.image_url);
          addEmoji(data.image_url, prompt);
          triggerConfetti();
          setPredictionId(null);
          setIsGenerating(false);
        } else if (data.status === 'failed') {
          throw new Error('Image generation failed');
        } else if (attempts < maxAttempts) {
          attempts++;
          // Exponential backoff with max of 4 seconds
          const delay = Math.min(1000 * Math.pow(1.5, attempts), 4000);
          timeoutId = setTimeout(checkPrediction, delay);
        } else {
          throw new Error('Image generation timed out');
        }
      } catch (error) {
        console.error('Error checking prediction:', error);
        setError({ type: 'general', message: 'Failed to generate emoji. Please try again.' });
        setPredictionId(null);
        setIsGenerating(false);
      }
    };

    if (predictionId) {
      checkPrediction();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [predictionId, prompt, addEmoji]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);
    setGeneratedEmoji('');
    setPredictionId(null);

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
      
      if (data.error === 'nsfw') {
        setError({
          type: 'nsfw',
          message: 'We cannot generate this emoji as the prompt may contain inappropriate content. Please try a different, family-friendly prompt.'
        });
        return;
      }

      if (data.status === 'pending' && data.predictionId) {
        setPredictionId(data.predictionId);
      } else if (isValidImageUrl(data.image_url)) {
        console.log('Valid URL detected, setting generated emoji');
        setGeneratedEmoji(data.image_url);
        addEmoji(data.image_url, prompt);
        triggerConfetti();
        setIsGenerating(false);
      } else {
        console.log('Invalid URL received:', data.image_url);
        throw new Error('Invalid or empty image URL received');
      }
    } catch (error) {
      console.error('Error generating emoji:', error);
      setError({ type: 'general', message: 'Failed to generate emoji. Please try again.' });
      setGeneratedEmoji('');
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!isValidImageUrl(generatedEmoji)) return;
    setIsSaving(true);
    try {
      // TODO: Implement save functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
    } catch (error) {
      console.error('Error saving emoji:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!isValidImageUrl(generatedEmoji)) return;
    
    try {
      const response = await fetch(generatedEmoji);
      if (!response.ok) throw new Error('Failed to download image');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-moji-${prompt.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
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
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Input Section */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-base sm:text-lg font-medium text-[#2D3047] mb-2">
              Describe your emoji
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A happy sun wearing sunglasses"
              className="w-full h-24 sm:h-32 p-3 border border-[#2D3047]/10 rounded-xl focus:ring-2 focus:ring-[#FF4500]/20 focus:border-[#FF4500] transition-all resize-none touch-manipulation"
              aria-label="Emoji description"
              aria-describedby="prompt-description"
            />
            <p id="prompt-description" className="mt-2 text-sm text-[#2D3047]/70">
              Be creative! Describe any emoji you can imagine.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all touch-manipulation
              ${isGenerating || !prompt.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FFB5A7] to-[#FF8FA3] hover:opacity-90 active:scale-[0.98]'
              }
            `}
            aria-busy={isGenerating}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : 'Generate Emoji'}
          </button>
        </div>

        {/* Preview Section */}
        <div className="aspect-square w-full bg-[#FFF5F0] rounded-xl overflow-hidden relative">
          {renderEmojiContent()}
        </div>
      </div>

      {/* Download Button */}
      {isValidImageUrl(generatedEmoji) && (
        <div className="mt-6">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto min-w-[200px] mx-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-medium bg-gradient-to-r from-[#FFB5A7] to-[#FF8FA3] hover:opacity-90 transition-all touch-manipulation active:scale-[0.98]"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download Emoji
          </button>
        </div>
      )}
    </div>
  );
} 