'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

interface Publication {
  _id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  image: any;
  paperUrl?: string;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const query = `*[_type == "publication"] | order(year desc, _createdAt desc)`;
        const data = await client.fetch(query);
        setPublications(data);
      } catch (error) {
        console.error('Error fetching publications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  // Group publications by year
  const groupedByYear = publications.reduce((acc, pub) => {
    const year = pub.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(pub);
    return acc;
  }, {} as Record<number, Publication[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Removed main title as requested */}

      <div className="space-y-16">
        {sortedYears.map((year) => (
          <section key={year} className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-100 pb-2">{year}</h2>
            <div className="space-y-10">
              {groupedByYear[year].map((pub, index) => (
                <motion.div
                  key={pub._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row items-start group"
                >
                  {/* Left: Image (16:9) */}
                  <div className="relative aspect-[16/9] w-full sm:w-64 flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100">
                    {pub.image ? (
                      <Image
                        src={urlForImage(pub.image).url()}
                        alt={pub.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className="mt-4 sm:mt-0 sm:ml-8 flex-1">
                    {pub.paperUrl ? (
                      <a 
                        href={pub.paperUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">
                          {pub.title}
                        </h3>
                      </a>
                    ) : (
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {pub.title}
                      </h3>
                    )}
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                      {pub.authors}
                    </p>
                    <p className="mt-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {pub.venue}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {publications.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No publications found. Please add them in Sanity Studio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
