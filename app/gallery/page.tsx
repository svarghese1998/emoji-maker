'use client';

import { Header } from '../components/layout/header';
import { EmojiGallery } from '../components/features/emoji-gallery';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

type FilterType = 'All' | 'Latest' | 'Popular' | 'Featured';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [page, setPage] = useState(1);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    setPage(1); // Reset page when filter changes
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#fff9f0]">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="heading-gradient heading-with-emoji">
            Emoji Gallery <span className="emoji-text">✨</span>
          </h1>
          <p className="text-lg text-[#2D3047]/70 max-w-2xl mx-auto mb-8">
            Explore our collection of AI-generated emojis created by our community
          </p>
          
          {/* Create CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-gradient-to-r from-[#FFB5A7] to-[#FF8FA3] text-white px-6 py-3 rounded-xl shadow-md inline-flex items-center gap-2 font-medium"
              >
                <span>✨</span>
                Create Your Own
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Filter/Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-4 justify-center"
        >
          {(['All', 'Latest', 'Popular', 'Featured'] as FilterType[]).map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === activeFilter
                  ? 'bg-[#2D3047] text-white'
                  : 'bg-white/50 text-[#2D3047] hover:bg-white hover:shadow-md'
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8"
        >
          <EmojiGallery filter={activeFilter.toLowerCase()} page={page} />
        </motion.div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
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
      </main>
    </div>
  );
} 