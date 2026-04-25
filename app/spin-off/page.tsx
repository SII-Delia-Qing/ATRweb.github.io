'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { ExternalLink } from 'lucide-react';

interface SpinOff {
  _id: string;
  name: string;
  logo: any;
  description: string;
  websiteUrl?: string;
}

export default function SpinOffPage() {
  const [companies, setCompanies] = useState<SpinOff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const query = `*[_type == "spinOff"] | order(order asc, _createdAt desc){
          _id,
          name,
          logo,
          description,
          websiteUrl
        }`;
        const data = await client.fetch(query);
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching spin-offs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
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
        {companies.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 italic">No spin-off companies listed yet. Add them in Sanity Studio.</p>
          </div>
        ) : (
          <div className="space-y-32">
            {companies.map((company, index) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col md:flex-row gap-16 items-center"
              >
                {/* Logo Container */}
                <div className="w-full md:w-1/4 flex justify-center">
                  <div className="relative aspect-square w-full max-w-[240px] flex items-center justify-center group">
                    {company.logo ? (
                      <Image
                        src={urlForImage(company.logo).url()}
                        alt={company.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="text-gray-300 font-bold text-xl">{company.name}</div>
                    )}
                  </div>
                </div>

                {/* Info Container */}
                <div className="w-full md:w-3/4 space-y-4">
                  <h2 className="text-2xl font-bold text-black">{company.name}</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {company.description}
                  </p>
                  {company.websiteUrl && (
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-black font-bold uppercase tracking-widest text-xs hover:text-purple-600 transition-colors group"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}