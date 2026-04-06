'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

const slides = [
  {
    id: 1,
    image: '/hero-1.png',
    alt: 'Robotics Lab Work 1',
  },
  {
    id: 2,
    image: '/hero-2.png',
    alt: 'Robotics Lab Work 2',
  },
  {
    id: 3,
    image: '/hero-3.png',
    alt: 'Robotics Lab Work 3',
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full border-b border-gray-300 bg-white">
      <div className="relative w-full overflow-hidden bg-white border-gray-300">
        {/* 21:9 Aspect Ratio Container for Hero */}
        <div className="relative aspect-[16/9] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <Image
                src={slides[currentIndex].image}
                alt={slides[currentIndex].alt}
                fill
                className="object-cover"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://picsum.photos/seed/${slides[currentIndex].id}/1920/1080?grayscale`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Text Overlay - Left Aligned, constrained to site width */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="space-y-6"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                    Welcome to
                    <br />
                    Ani-Thing Robotics Lab
                  </h1>
                  <div className="pt-4">
                    <Link
                      href="/research"
                      className="inline-flex items-center justify-center rounded-full bg-black border border-white px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black active:scale-95"
                    >
                      Explore Research
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Indicators - Bottom Right, constrained to site width */}
          <div className="absolute bottom-10 left-0 right-0">
            <div className="mx-auto flex max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}