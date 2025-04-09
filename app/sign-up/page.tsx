'use client';

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#fff9f0] flex flex-col md:flex-row items-stretch">
      {/* Left side - Welcome message */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-[#FFB5A7] to-[#FF8FA3] text-white p-8 flex flex-col justify-center items-center md:w-1/2 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-10" />

        {/* Content */}
        <div className="max-w-md text-center relative z-10">
          <Link href="/" className="inline-block">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Image 
                src="/ai-moji-logo.svg" 
                alt="AI-moji Logo" 
                width={80} 
                height={80} 
                className="mx-auto mb-6 drop-shadow-lg"
              />
            </motion.div>
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold mb-4 leading-snug tracking-tight"
          >
            Join the Fun! 🎉
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl mb-8 text-white/90"
          >
            Create an account to start generating and sharing your own AI-powered emojis
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4 text-left bg-white/10 rounded-2xl p-6 backdrop-blur-sm"
          >
            {[
              { emoji: '🎨', text: 'Create unlimited custom emojis' },
              { emoji: '💫', text: 'Share with the community' },
              { emoji: '🌟', text: 'Build your emoji collection' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-2xl emoji-text">{item.emoji}</span>
                <span className="text-white/90">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Emojis Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {['✨', '🎨', '🌈', '🎭', '🪄'].map((emoji, index) => (
            <motion.div
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
              className="absolute text-4xl opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Right side - Sign Up form */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF5F0]/50 to-transparent opacity-50" />
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md relative z-10",
              card: "bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border-0",
              headerTitle: "text-[#2D3047] text-2xl",
              headerSubtitle: "text-[#2D3047]/70",
              formButtonPrimary: "bg-gradient-to-r from-[#FFB5A7] to-[#FF8FA3] hover:opacity-90 transition-opacity",
              formFieldInput: "rounded-xl border-[#2D3047]/10",
              footerActionLink: "text-[#FF4500] hover:text-[#FF8FA3]",
              dividerLine: "bg-[#2D3047]/10",
              dividerText: "text-[#2D3047]/50",
              socialButtonsBlockButton: "border-[#2D3047]/10 hover:bg-[#2D3047]/5",
              socialButtonsBlockButtonText: "text-[#2D3047]",
            }
          }}
          signInUrl="/sign-in"
          redirectUrl="/"
        />
      </motion.div>
    </div>
  );
} 