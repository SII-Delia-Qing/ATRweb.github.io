'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

interface Member {
  _id: string;
  nameZh: string;
  nameEn: string;
  category: string;
  image: any;
  email?: string;
  researchInterests?: string;
  affiliation?: string;
  bio?: string;
  websiteUrl?: string;
  hasDetailPage?: boolean;
}

function MemberGrid({
  title,
  members,
  columns = 1,
}: {
  title: string;
  members: Member[];
  columns?: number;
}) {
  if (members.length === 0) return null;

  return (
    <section className="space-y-12">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex-1 h-px bg-gray-100"></div>
      </div>

      <div
        className={`grid gap-10 ${
          columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {members.map((member, index) => {
          const MemberContent = (
            <div
              className={`flex ${
                columns === 2
                  ? 'flex-row items-start gap-4'
                  : 'flex-col sm:flex-row gap-10'
              }`}
            >
              {/* 图片 */}
              <div
                className={`relative overflow-hidden bg-gray-50 flex-shrink-0 ${
                  columns === 2
                    ? 'w-45 h-45'
                    : 'aspect-square w-full sm:w-48'
                }`}
              >
                {member.image ? (
                  <Image
                    src={urlForImage(member.image).url()}
                    alt={`${member.nameZh} | ${member.nameEn}`}
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

              {/* 信息 */}
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-gray-900">
                    {member.nameZh} | {member.nameEn}
                  </h3>

                  {member.affiliation && (
                    <p className="text-sm text-gray-700">
                      {member.affiliation}
                    </p>
                  )}

                  {member.email && (
                    <p className="text-xs text-gray-400">
                      {member.email}
                    </p>
                  )}

                  {/* bio（所有人显示 + 限制两行） */}
                  {member.bio && (
                    <div className="pt-2">
                      <p className="text-sm text-gray-500 italic leading-relaxed line-clamp-2">
                        &quot;{member.bio}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

          const linkUrl =
            member.websiteUrl ||
            (member.hasDetailPage ? `/team/${member._id}` : null);

          const isExternal = !!member.websiteUrl;

          return (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: (index % 3) * 0.1,
              }}
              className="w-full"
            >
              {linkUrl ? (
                <Link
                  href={linkUrl}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="block"
                >
                  {MemberContent}
                </Link>
              ) : (
                <div>{MemberContent}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const query = `*[_type == "teamMember"] | order(order asc, _createdAt desc){
          _id,
          nameZh,
          nameEn,
          category,
          image,
          email,
          affiliation,
          bio,
          websiteUrl,
          hasDetailPage
        }`;
        const data = await client.fetch(query);
        setMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  const pi = members.filter((m) => m.category === 'pi');
  const phdStudents = members.filter((m) => m.category === 'phd');
  const masterStudents = members.filter((m) => m.category === 'master');
  const visitingStudents = members.filter(
    (m) => m.category === 'visiting_student'
  );
  const postdocs = members.filter((m) => m.category === 'postdoc');
  const alumni = members.filter((m) => m.category === 'alumni');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
      <h1 className="sr-only">Our Team</h1>

      {/* PI */}
      <MemberGrid title="课题组导师" members={pi} columns={1} />

      {/* 双列 */}
      <MemberGrid title="博士研究生" members={phdStudents} columns={2} />
      <MemberGrid title="硕士研究生" members={masterStudents} columns={2} />
      <MemberGrid title="访问学生" members={visitingStudents} columns={2} />
      <MemberGrid title="博士后" members={postdocs} columns={2} />
      <MemberGrid title="毕业生" members={alumni} columns={2} />

      {members.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">
            No team members found. Please add them in Sanity Studio.
          </p>
        </div>
      )}
    </div>
  );
}