import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PackageListings, { type PackageRow } from '@/components/PackageListings';
import PriceContextBar from '@/components/PriceContextBar';
import { MARKET_PRICE_INDEX } from '@/lib/priceIndex';
import { createServerClient } from '@/lib/supabase/server';

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

async function fetchPackages(flatType: FlatType) {
  const supabase = await createServerClient();
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
    .eq('flat_type', flatType)
    .eq('status', 'active')
    .eq('package_type', 'bto')
    .is('deleted_at', null)
    .order('is_featured', { ascending: false })
    .order('featured_position', { ascending: true, nullsFirst: false });

  return (data ?? []) as PackageRow[];
}

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

  const displayFlatType = toDisplayFlatType(flatType);
  const packages = await fetchPackages(flatType);

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

        {packages.length > 0 ? (
          <PackageListings packages={packages} selectedFlatType={flatType} />
        ) : (
          <section className="rounded-xl border border-[#E5E0D8] bg-white p-8 text-center">
            <p className="text-base font-semibold text-[#1A1A1A]">
              No packages listed yet for {flatType} BTO.
            </p>
            <p className="mt-2 text-sm text-[#6B7280]">
              We&apos;re adding new firms regularly. Check back soon.
            </p>
          </section>
        )}
      </main>
    </>
  );
}
