'use client';

import Link from 'next/link';
import { useState } from 'react';
import PackageListings, { type PackageRow } from '@/components/PackageListings';
import type { FlatType } from '@/lib/types';

const FLAT_TYPE_OPTIONS: Array<{ label: string; value: FlatType }> = [
  { label: '3-Room', value: '3-room' },
  { label: '4-Room', value: '4-room' },
  { label: '5-Room', value: '5-room' },
];

type HomeClientProps = {
  packages: PackageRow[];
};

export default function HomeClient({ packages }: HomeClientProps) {
  const [selectedFlatType, setSelectedFlatType] = useState<FlatType>('4-room');

  return (
    <>
      <div className="w-full bg-[#1B4332] px-3 pb-9 md:px-4 md:pb-12">
        <div className="mx-auto w-full max-w-3xl">
          <p
            className="mb-2 text-xs font-semibold uppercase"
            style={{ color: 'rgba(255,255,255,0.80)' }}
          >
            Select your flat type
          </p>
          <div className="flex gap-2">
            {FLAT_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedFlatType(opt.value)}
                className="min-h-[40px] flex-1 rounded-full px-3 text-sm font-bold transition-colors"
                style={
                  selectedFlatType === opt.value
                    ? { background: '#F59E0B', color: '#78350f' }
                    : { background: '#fff', color: '#1B4332' }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="mb-3 text-sm text-[rgba(255,255,255,0.6)]">
              Not sure what a fair price looks like?
            </p>
            <Link
              href="/price-guide"
              className="inline-block rounded-full border border-[rgba(255,255,255,0.35)] px-5 py-2 text-sm font-medium text-white transition-colors hover:border-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.07)]"
            >
              BTO Price Guide →
            </Link>
          </div>
        </div>
      </div>

      <PackageListings packages={packages} selectedFlatType={selectedFlatType} />
    </>
  );
}
