'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

export default function HeroCarousel() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 👉 获取图片
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const query = `*[_type == "homeCarousel"][0]{
          slides
        }`;

        const data = await client.fetch(query);
        setSlides(data?.slides || []);
      } catch (error) {
        console.error('Error fetching carousel:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // 👉 自动轮播
  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  if (loading || slides.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-gray-400">
        Please upload carousel images in Sanity Studio.
      </div>
    );
  }

  return (
    <div className="w-full border-b border-gray-300 bg-white">
      <div className="relative w-full overflow-hidden">
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
                src={urlForImage(slides[currentIndex]).url()}
                alt="Hero Image"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* ✅ 保持你原来的固定文案 */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <motion.div
                  key={currentIndex + '-text'}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
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

          {/* 指示器 */}
          <div className="absolute bottom-10 left-0 right-0">
            <div className="mx-auto flex max-w-7xl justify-center px-4">
              <div className="flex space-x-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
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