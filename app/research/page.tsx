'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

interface ResearchArea {
  _id: string;
  titleZh: string;
  titleEn: string;
  icon: any;
  description: string;
}

interface ResearchPageData {
  introduction: string;
}

export default function ResearchPage() {
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [pageData, setPageData] = useState<ResearchPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const areasQuery = `*[_type == "researchArea"] | order(order asc, _createdAt desc){
          _id,
          titleZh,
          titleEn,
          icon,
          description
        }`;
        const pageQuery = `*[_type == "researchPage"][0]{
          introduction
        }`;

        const [areas, page] = await Promise.all([
          client.fetch(areasQuery),
          client.fetch(pageQuery)
        ]);

        setResearchAreas(areas);
        setPageData(page);
      } catch (error) {
        console.error('Error fetching research data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24 pt-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Introduction Section */}
        <div className="mb-20">
          <h1 className="text-4xl font-bold tracking-tight text-black mb-8">
            研究方向｜Research
          </h1>
          {pageData?.introduction ? (
            <p className="text-base text-gray-600 leading-[1.8] text-justify">
              {pageData.introduction}
            </p>
          ) : (
            <p className="text-lg text-gray-400 italic">
              Please add a research introduction in Sanity Studio.
            </p>
          )}
        </div>

        {/* Research Areas Grid */}
        {researchAreas.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 italic">No research areas listed yet. Add them in Sanity Studio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchAreas.map((area, index) => (
              <motion.div
                key={area._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="clean-card p-10 flex flex-col h-full"
              >
                {/* Header: Icon + Titles */}
                <div className="flex items-center gap-6 mb-8">
                  {/* Icon (1:1 ratio) */}
                  <div className="relative h-16 w-16 flex-shrink-0 flex items-center justify-center">
                    {area.icon ? (
                      <Image
                        src={urlForImage(area.icon).url()}
                        alt={area.titleZh}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="bg-gray-100 w-full h-full rounded-xl" />
                    )}
                  </div>

                  {/* Titles (Left Aligned) */}
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-black leading-tight">
                      {area.titleZh}
                    </h3>
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wide mt-1">
                      {area.titleEn}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}