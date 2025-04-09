'use client';

import { motion } from 'framer-motion';

const MotionDiv = motion.div;

const features = [
  {
    icon: '🎨',
    title: 'AI-Powered Creation',
    description: 'Advanced AI that turns your descriptions into expressive emojis'
  },
  {
    icon: '⚡',
    title: 'Instant Generation',
    description: 'Get your custom emojis in seconds, no waiting required'
  },
  {
    icon: '🔄',
    title: 'Unlimited Iterations',
    description: 'Keep refining until your emoji is perfect'
  },
  {
    icon: '📱',
    title: 'Use Anywhere',
    description: 'Export your emojis and use them across all platforms'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function FeaturesSection() {
  return (
    <section className="py-20 relative">
      {/* Section Title */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="heading-gradient heading-with-emoji"
        >
          Magic at Your Fingertips <span className="emoji-text">✨</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-[#2D3047]/70 max-w-2xl mx-auto"
        >
          Create custom emojis that perfectly express your feelings
        </motion.p>
      </div>

      {/* Feature Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            transition={{ type: "spring", stiffness: 200 }}
            className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 hover:bg-white transition-all duration-300"
          >
            <div className="mb-4 text-4xl transform group-hover:scale-110 transition-transform duration-300">
              <div className="text-3xl mb-2 emoji-text">{feature.icon}</div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#2D3047]">
              {feature.title}
            </h3>
            <p className="text-[#2D3047]/70">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF5F0]/50 to-transparent -z-10" />
    </section>
  );
} 