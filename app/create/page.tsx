'use client';

import { Header } from '../components/layout/header';
import { EmojiGenerator } from '../components/features/emoji-generator';
import { EmojiGallery } from '../components/features/emoji-gallery';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function CreatePage() {
  const [page, setPage] = useState(1);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#fff9f0]">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h1 className="heading-primary heading-with-emoji">
            Tips for Great Results <span className="emoji-text">💡</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: '🎨',
                title: 'Be Descriptive',
                text: 'Include colors, expressions, and style details'
              },
              {
                icon: '🔍',
                title: 'Be Specific',
                text: 'The more specific your description, the better the result'
              },
              {
                icon: '🔄',
                title: 'Iterate',
                text: 'Try different descriptions to get the perfect emoji'
              }
            ].map((tip, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="text-3xl mb-2 emoji-text">{tip.icon}</div>
                <h3 className="font-medium mb-1 text-[#2D3047]">{tip.title}</h3>
                <p className="text-sm text-[#2D3047]/70">{tip.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        
        {/* Emoji Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
            <EmojiGenerator />
          </div>
        </motion.div>

        
        {/* Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#FFB5A7] to-[#FF8FA3] bg-clip-text text-transparent">
              Your Emoji Gallery ✨
            </h2>
            <p className="text-lg text-[#2D3047]/70 max-w-2xl mx-auto">
              All your created emojis will appear here
            </p>
          </div>

          {/* Gallery Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8"
          >
            <EmojiGallery filter="latest" page={page} />
          </motion.div>

          {/* Load More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="bg-white/50 hover:bg-white text-[#2D3047] px-8 py-3 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg font-medium"
            >
              Load More
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
} 