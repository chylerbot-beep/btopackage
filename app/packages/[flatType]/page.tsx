import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PriceContextBar from '@/components/PriceContextBar';
import PackageListings, { type PackageRow } from '@/components/PackageListings';
import { MARKET_PRICE_INDEX } from '@/lib/priceIndex';
import { createServerClient } from '@/lib/supabase/server';
import type { FlatType } from '@/lib/types';

const VALID_FLAT_TYPES = ['3-room', '4-room', '5-room'] as const;

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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { flatType } = params;

  if (!isValidFlatType(flatType) || !MARKET_PRICE_INDEX.flatTypes[flatType]?.bto) {
    notFound();
  }

  // Fetch packages for this flat type
  const supabase = await createServerClient({
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  const { data } = await supabase
    .from('package')
    .select(`
      id, slug, flat_type, price_nett, image_url, is_featured, featured_position,
      kitchen_top_cabinet_ft, kitchen_bottom_cabinet_ft,
      master_wardrobe_ft, common_wardrobe_room2_ft, common_wardrobe_room3_ft,
      flooring_type, countertop_material, countertop_backsplash,
      shower_screens_included, electrical_included, plumbing_included,
      false_ceiling_included, doors_included, paint_brand,
      cleaning_and_haulage_included, render_3d, warranty_months,
      id_firm (
        id, name, slug, google_rating, google_review_count,
        hdb_license_number, hdb_license_verified, casetrust_accredited,
        known_for, whatsapp_number, whatsapp_message, project_images
      )
    `)
    .eq('status', 'active')
    .eq('package_type', 'bto')
    .eq('flat_type', flatType)
    .is('deleted_at', null)
    .order('price_nett', { ascending: true }); // Or featured_position if preferred

  const packages = (data ?? []) as PackageRow[];
  const displayFlatType = toDisplayFlatType(flatType);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.btopackage.sg',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: displayFlatType,
        item: `https://www.btopackage.sg/packages/${flatType}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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

        {packages.length === 0 ? (
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
        ) : (
          <div className="-mx-4 md:mx-0">
            <PackageListings packages={packages} selectedFlatType={flatType} />
          </div>
        )}
      </main>

      <footer className="bg-[#1B4332] px-4 py-10 text-sm">
        <div className="mx-auto w-full max-w-3xl">
          <p
            className="mb-5 text-base font-bold text-white"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            BTOPACKAGE.SG
          </p>
          <nav className="mb-5 flex flex-wrap gap-x-6 gap-y-3">
            <Link href="/about" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              About
            </Link>
            <Link href="/price-guide" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              Price Guide
            </Link>
            <Link href="/directory" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              Directory
            </Link>
            <Link href="/privacy" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              Terms
            </Link>
          </nav>
          <div className="flex flex-col gap-3 border-t border-[rgba(255,255,255,0.15)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[rgba(255,255,255,0.5)]">
              © 2026 Btopackage.sg · Independent directory · No referral fees
            </p>
            <Link href="/submit" className="text-xs font-medium text-[rgba(255,255,255,0.85)] hover:text-white">
              HDB-licensed firm? Submit a free listing →
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
