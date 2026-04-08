'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/price-guide', label: 'Price Guide' },
  { href: '/packages/3-room', label: '3 Room' },
  { href: '/packages/4-room', label: '4 Room' },
  { href: '/packages/5-room', label: '5 Room' },
];

export default function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 h-[54px] border-b border-[#E5E0D8] bg-white">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-[18px] font-extrabold text-[#1B4332]"
          style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}
        >
          BTOPACKAGE.SG
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-semibold text-[#1B4332] transition-colors hover:text-[#2D6A4F]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
