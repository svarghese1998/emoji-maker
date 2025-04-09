'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const MotionDiv = motion.div;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-radial from-[#FFF5F0] via-[#FCD5CE] to-[#FFB5A7] opacity-40" />
      <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" />
      
      {/* Floating Emojis Background */}
      <div className="absolute inset-0 overflow-hidden">
        {['✨', '🎨', '🌈', '🎭', '🪄'].map((emoji, index) => (
          <MotionDiv
            key={index}
            initial={{ y: 0 }}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            {emoji}
          </MotionDiv>
        ))}
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="heading-gradient-dark heading-with-emoji"
          >
            Create Magical Emojis with AI <span className="emoji-text">✨</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-[#2D3047]/70 leading-relaxed mb-12"
          >
            Transform your ideas into delightful emojis using state-of-the-art AI that understands your vision
          </motion.p>


          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/create" className="inline-block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-gradient-to-r from-[#FFB5A7] to-[#FF8FA3] text-white text-lg px-8 py-6 rounded-xl shadow-lg inline-flex items-center gap-2 font-medium"
              >
                <span>✨</span>
                Let's Create!
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 