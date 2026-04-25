'use client';

import { useEffect, useState } from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import NewsSection from '@/components/NewsSection';
import { client } from '@/sanity/lib/client';

interface HomePageData {
  aboutTitle?: string;
  aboutContent?: string[];
}

export default function Home() {
  const [pageData, setPageData] = useState<HomePageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "homePage"][0]{
          aboutTitle,
          aboutContent
        }`;

        const data = await client.fetch(query);
        setPageData(data);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* Slides Section */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      {/* About Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Title */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold tracking-tight text-black">
              {pageData?.aboutTitle || '介绍｜About us'}
            </h2>
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-6 text-base leading-[1.8] text-gray-600 text-justify">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : pageData?.aboutContent?.length ? (
              pageData.aboutContent.map((para, index) => (
                <p key={index}>{para}</p>
              ))
            ) : (
              <p className="text-gray-400 italic">
                Please add About content in Sanity Studio.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* News Section */}
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-gray-300">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            新闻｜News
          </h2>
        </div>
        <NewsSection />
      </div>
    </div>
  );
}