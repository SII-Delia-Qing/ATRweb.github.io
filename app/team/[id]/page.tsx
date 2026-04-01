import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Mail, ChevronLeft, Globe } from 'lucide-react';
import Link from 'next/link';

// 关键：为了支持 GitHub Pages 静态导出，必须添加这个函数
export async function generateStaticParams() {
  const query = `*[_type == "teamMember" && (hasDetailPage == true || defined(websiteUrl))]{ _id }`;
  const members = await client.fetch(query);
  return members.map((member: any) => ({
    id: member._id,
  }));
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const query = `*[_type == "teamMember" && _id == $id][0]`;
  const member = await client.fetch(query, { id });

  if (!member || (!member.hasDetailPage && !member.websiteUrl)) {
    notFound();
  }

  const components = {
    types: {
      image: ({ value }: any) => {
        return (
          <div className="my-10 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <div className="relative aspect-video w-full">
              <Image
                src={urlForImage(value).url()}
                alt={value.caption || 'Member content image'}
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
      h2: ({ children }: any) => <h2 className="mt-12 mb-6 text-2xl font-bold text-gray-900 border-b pb-2">{children}</h2>,
      h3: ({ children }: any) => <h3 className="mt-8 mb-4 text-xl font-bold text-gray-900">{children}</h3>,
      normal: ({ children }: any) => <p className="mb-6 text-gray-600 leading-relaxed">{children}</p>,
    },
    list: {
      bullet: ({ children }: any) => <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-600">{children}</ul>,
      number: ({ children }: any) => <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-600">{children}</ol>,
    },
  };

  const categoryMap: Record<string, string> = {
    pi: '课题组PI',
    phd: '博士研究生',
    master: '硕士研究生',
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header Section */}
      <div className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6">
          <Link 
            href="/team" 
            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-purple-600 transition-colors mb-12 group"
          >
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Team
          </Link>
          
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            {/* Profile Photo */}
            <div className="relative aspect-square w-64 flex-shrink-0 overflow-hidden bg-white">
              {member.image ? (
                <Image
                  src={urlForImage(member.image).url()}
                  alt={member.nameZh}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left pt-4">
              <h1 className="text-4xl font-bold text-black mb-6">
                {member.nameZh} <span className="mx-2">|</span> {member.nameEn}
              </h1>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  {member.affiliation && (
                    <p className="text-lg text-gray-900 font-semibold">
                      {member.affiliation}
                    </p>
                  )}
                  {member.category && (
                    <p className="text-gray-600 font-medium">
                      {categoryMap[member.category] || member.category}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                  {member.email && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Mail className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">{member.email}</span>
                    </div>
                  )}
                  {member.websiteUrl && (
                    <a 
                      href={member.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-600 hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-medium">Personal Website</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-3xl px-6 pt-20">
        {member.content ? (
          <div className="prose prose-slate max-w-none">
            <PortableText value={member.content} components={components} />
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 italic">No additional content provided.</p>
          </div>
        )}
      </div>
    </main>
  );
}