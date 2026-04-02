'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        <Link
          href="/price-guide"
          className="text-[13px] font-semibold text-[#1B4332] hover:text-[#2D6A4F] transition-colors"
        >
          Price Guide
        </Link>
      </nav>
    </header>
  );
}
