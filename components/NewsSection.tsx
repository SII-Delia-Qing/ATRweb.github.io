'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { client } from '@/sanity/lib/client';

interface NewsItem {
  _id: string;
  date: string;
  title: string;
  summary: string;
  category: string;
  hasDetail?: boolean;
}

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const query = `*[_type == "newsItem"] | order(date desc, _createdAt desc){
          _id,
          date,
          title,
          summary,
          category,
          hasDetail
        }`;
        const data = await client.fetch(query);
        setNewsItems(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const maxIndex = Math.max(0, newsItems.length - itemsPerPage);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center border border-dashed border-gray-300 rounded-3xl">
        <p className="text-gray-400 font-medium">No news items found. Add them in Sanity Studio.</p>
      </div>
    );
  }

  return (
    <section className="relative">
      <div className="flex items-center space-x-3 absolute -top-20 right-0">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full border border-gray-300 bg-white transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          disabled={currentIndex === maxIndex}
          className="p-3 rounded-full border border-gray-300 bg-white transition-all hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-hidden py-4">
        <motion.div
          animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex gap-6"
        >
          {newsItems.map((item) => (
            <motion.article
              key={item._id}
              className="clean-card flex-none w-full md:w-[calc(33.333%-1rem)] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {item.category}
                </span>
                <span className="flex items-center text-[10px] font-bold text-gray-400 uppercase">
                  <Calendar className="mr-2 h-3 w-3" /> {item.date}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4 leading-snug">
                {item.title}
              </h3>
              <p className="text-sm font-medium text-gray-500 line-clamp-3 mb-8">
                {item.summary}
              </p>
              <div className="mt-auto flex justify-end">
                {item.hasDetail && (
                  <Link
                    href={`/news/${item._id}`}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white transition-all hover:bg-gray-800 hover:scale-110 active:scale-95"
                    aria-label="Read more"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}