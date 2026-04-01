import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Tag, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// 关键：为了支持 GitHub Pages 静态导出，必须添加这个函数
export async function generateStaticParams() {
  const query = `*[_type == "newsItem" && hasDetail == true]{ _id }`;
  const items = await client.fetch(query);
  return items.map((item: any) => ({
    id: item._id,
  }));
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const query = `*[_type == "newsItem" && _id == $id][0]`;
  const item = await client.fetch(query, { id });

  if (!item || !item.hasDetail) {
    notFound();
  }

  const components = {
    types: {
      image: ({ value }: any) => {
        return (
          <div className="my-10 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative aspect-video w-full">
              <Image
                src={urlForImage(value).url()}
                alt={value.caption || 'News image'}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {value.caption && (
              <div className="bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-500 italic">
                {value.caption}
              </div>
            )}
          </div>
        );
      },
    },
    block: {
      h2: ({ children }: any) => <h2 className="mt-12 mb-6 text-2xl font-bold text-black">{children}</h2>,
      h3: ({ children }: any) => <h3 className="mt-8 mb-4 text-xl font-bold text-black">{children}</h3>,
      normal: ({ children }: any) => <p className="mb-6 text-gray-600 leading-relaxed">{children}</p>,
    },
    list: {
      bullet: ({ children }: any) => <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-600">{children}</ul>,
      number: ({ children }: any) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-600">{children}</ol>,
    },
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header Section */}
      <div className="bg-gray-50 py-20 border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-12 group"
          >
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-6 mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-black text-[10px] font-bold text-white uppercase tracking-widest">
              <Tag className="mr-2 h-3 w-3" />
              {item.category}
            </span>
            <span className="inline-flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Calendar className="mr-2 h-3 w-3" />
              {item.date}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight tracking-tight">
            {item.title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-3xl px-6 pt-20">
        <div className="prose prose-slate max-w-none">
          <PortableText value={item.content} components={components} />
        </div>
      </div>
    </main>
  );
}