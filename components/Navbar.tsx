'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'motion/react';

const navItems = [
  { name: 'Research', href: '/research' },
  { name: 'Team', href: '/team' },
  { name: 'Publications', href: '/publications' },
  { name: 'Spin-off', href: '/spin-off' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Playground', href: '/playground' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 inset-x-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <div className="relative h-[40px] w-[264px]">
            <Image
              src="/group-logo.png"
              alt="Ani-Thing Robotics Lab"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <div className="hidden md:flex md:items-center md:space-x-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-underline"
                    initial={false}
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
