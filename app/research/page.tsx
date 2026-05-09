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
  introduction: string[];
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
          client.fetch(pageQuery),
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
          <h1 className="mb-8 text-4xl font-bold tracking-tight text-black">
            研究方向｜Research
          </h1>

          {pageData?.introduction?.length ? (
            <div className="space-y-6">
              {pageData.introduction.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-[1.8] text-gray-600 text-justify"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-lg italic text-gray-400">
              Please add a research introduction in Sanity Studio.
            </p>
          )}
        </div>

        {/* Research Areas */}
        {researchAreas.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-100 py-20 text-center">
            <p className="italic text-gray-400">
              No research areas listed yet. Add them in Sanity Studio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {researchAreas.map((area, index) => (
              <motion.div
                key={area._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="clean-card group h-full p-12"
              >
                <div className="flex items-start gap-10 h-full">

                  {/* Left Icon */}
                  <div className="relative h-32 w-32 flex-shrink-0">
                    {area.icon ? (
                      <Image
                        src={urlForImage(area.icon).url()}
                        alt={area.titleZh}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-full w-full rounded-2xl bg-gray-100" />
                    )}
                  </div>

                  {/* Right Content */}
                  <div className="flex flex-1 flex-col pt-1">

                    {/* Chinese Title */}
                    <h3 className="text-xl font-bold leading-tight text-black">
                      {area.titleZh}
                    </h3>

                    {/* English Title */}
                    <span className="mt-1.5 mb-4 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
                      {area.titleEn}
                    </span>

                    {/* Description */}
                    <p className="text-[13px] leading-[1.85] text-gray-600">
                      {area.description}
                    </p>

                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}