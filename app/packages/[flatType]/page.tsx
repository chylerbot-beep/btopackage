import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PriceContextBar from '@/components/PriceContextBar';
import { MARKET_PRICE_INDEX } from '@/lib/priceIndex';

const VALID_FLAT_TYPES = ['3-room', '4-room', '5-room'] as const;
type FlatType = (typeof VALID_FLAT_TYPES)[number];

type CategoryPageProps = {
  params: {
    flatType: string;
  };
};

export const revalidate = 3600;

const toDisplayFlatType = (flatType: FlatType) => {
  const [count, room] = flatType.split('-');
  return `${count}-${room.charAt(0).toUpperCase()}${room.slice(1)}`;
};

const isValidFlatType = (flatType: string): flatType is FlatType => {
  return VALID_FLAT_TYPES.includes(flatType as FlatType);
};

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const { flatType } = params;

  if (!isValidFlatType(flatType)) {
    return {};
  }

  const displayFlatType = toDisplayFlatType(flatType);

  return {
    title: `${displayFlatType} BTO Renovation Packages Singapore | Btopackage.sg`,
    description: `Compare verified ${flatType} BTO renovation packages. Full inclusions, carpentry footage per item, and what's NOT included. HDB licence numbers checked.`,
    alternates: { canonical: `https://www.btopackage.sg/packages/${flatType}` },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { flatType } = params;

  if (!isValidFlatType(flatType) || !MARKET_PRICE_INDEX.flatTypes[flatType]?.bto) {
    notFound();
  }

  const displayFlatType = toDisplayFlatType(flatType);

  return (
    <>
      <div className="px-4 py-3 text-sm text-[#6B7280]">
        <div className="mx-auto w-full max-w-4xl">
          <Link href="/" className="hover:text-[#1A1A1A]">
            Home
          </Link>{' '}
          › {displayFlatType} Packages
        </div>
      </div>

      <PriceContextBar flatType={flatType} />

      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <h1 className="mb-2 font-[family-name:var(--font-bricolage-grotesque)] text-3xl font-bold text-[#1A1A1A]">
          {displayFlatType} BTO Renovation Packages in Singapore
        </h1>

        <p className="mb-8 text-sm text-[#6B7280]">
          Verified packages · Inclusions listed · HDB licence numbers checked
        </p>

        <section className="rounded-xl border border-[#E5E0D8] bg-white p-8 text-center">
          <p className="text-base font-semibold text-[#1A1A1A]">
            No packages listed yet for {flatType} BTO.
          </p>
          <p className="mt-2 text-sm text-[#6B7280]">
            We&apos;re adding new firms regularly. Check back soon — or{' '}
            <Link href="/directory" className="text-[#1B4332] hover:underline">
              browse all firms in the directory →
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
