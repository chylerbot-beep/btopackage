'use client';

import Link from 'next/link';

export default function Navbar() {
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

        <button
          type="button"
          className="text-[13px] font-semibold bg-[#F9F7F4] border border-[#E5E0D8] rounded-full px-3 py-1 text-[#1B4332]"
        >
          ♡ My List (0)
        </button>
      </nav>
    </header>
  );
}
