import Link from 'next/link';
import PackageListings, { type FirmRow, type PackageRow } from '@/components/PackageListings';
import { createClient } from '@/lib/supabase/server';

function getFirm(value: PackageRow['id_firm']): FirmRow | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export default async function Home() {
  const supabase = await createClient({
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
    .eq('is_featured', true)
    .is('deleted_at', null)
    .order('featured_position', { ascending: true, nullsFirst: false });

  const packages = (data ?? []) as PackageRow[];
  const seenFirmIds = new Set<string>();
  const verifiedFirms = packages
    .map((pkg) => getFirm(pkg.id_firm))
    .filter((firm): firm is FirmRow => {
      if (!firm?.id || !firm.hdb_license_verified) return false;
      if (seenFirmIds.has(firm.id)) return false;
      seenFirmIds.add(firm.id);
      return true;
    })
    .slice(0, 10);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Btopackage.sg',
            url: 'https://www.btopackage.sg',
            description:
              'Compare verified BTO renovation packages from HDB-licensed interior design firms in Singapore. See carpentry footage, flooring type, and inclusions before you WhatsApp.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.btopackage.sg/?flatType={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Verified BTO Renovation Firms Singapore',
            itemListElement: verifiedFirms.map((firm, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: firm.name,
              url: firm.slug
                ? `https://www.btopackage.sg/firms/${firm.slug}`
                : 'https://www.btopackage.sg',
            })),
          }),
        }}
      />
      <section className="w-full bg-[#1B4332] px-3 py-9 md:px-4 md:py-12">
        <div className="mx-auto w-full max-w-3xl">
          <h1
            className="text-4xl font-extrabold text-white md:text-5xl"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Verified BTO Renovation Packages in Singapore.
          </h1>

          <p className="mt-3 max-w-[560px] text-base" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Discover hidden gem ID firms. Check what&apos;s included or not in each BTO package
            before you Whatsapp.
          </p>

          <PackageListings packages={packages} defaultFlatType="4-room" />

          <p className="mt-4 text-[12.5px]" style={{ color: 'rgba(255,255,255,0.70)' }}>
            <span className="font-bold text-[#6EE7B7]">✓</span> HDB-verified firms
            {' · '}
            <span className="font-bold text-[#6EE7B7]">✓</span> packages with inclusions listed
            {' · '}
            <span className="font-bold text-[#6EE7B7]">✓</span> estates covered
          </p>

          <div className="mt-5">
            <Link
              href="/price-guide"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2v20M2 12h20" />
              </svg>
              BTO Price Guide - what's a fair price to pay?
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[600px] px-4 py-12">
        <h2
          className="mb-6 text-2xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          How it works
        </h2>

        <div className="space-y-6 rounded-xl border border-[#E5E0D8] p-6">
          {[
            {
              n: '01',
              heading: 'Find packages for your flat type',
              body: 'Select 3-Room, 4-Room or 5-Room. Every package is filtered to match.',
            },
            {
              n: '02',
              heading: 'Compare inclusions — not just price',
              body: "See carpentry footage, flooring type, and what's NOT included, side by side. All firms carry a verified HDB licence number.",
            },
            {
              n: '03',
              heading: 'WhatsApp your shortlisted firm directly',
              body: 'No middlemen, no referral fees. You contact them directly — we never share your details.',
            },
          ].map((step) => (
            <div key={step.n}>
              <p className="text-[11px] font-bold tracking-widest text-[#9CA3AF]">{step.n}</p>
              <h3 className="text-base font-semibold text-[#1A1A1A]">{step.heading}</h3>
              <p className="text-sm text-[#6B7280]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-4 py-10 text-sm text-[#374151] space-y-4">
        <h2 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}>
          What to look for in a BTO renovation package
        </h2>
        <p>
          BTO renovation packages in Singapore vary widely — not just in price, but in what
          is actually included. Two packages priced at $30,000 can differ by entire categories
          of work: one may include carpentry for all three bedrooms while another covers only
          the master bedroom. Flooring scope, countertop material, and whether doors or false
          ceilings are bundled in are all commonly left out of headline prices.
        </p>
        <p>
          Btopackage.sg lists packages from HDB-licensed interior design firms with inclusions
          broken down line by line — carpentry footage in feet, flooring type, countertop
          material, and what is explicitly not covered. Every firm on this platform carries
          a verified HDB licence number, which is a legal requirement for renovation work
          on HDB properties in Singapore.
        </p>
        <p>
          Renovation costs for a 4-room BTO in Singapore currently average $51,000–$61,800
          (MoneySmart 2026). A 3-room BTO averages $36,100–$43,700 and a 5-room averages
          $67,000–$82,400. These figures include carpentry, flooring, tiling, painting,
          and basic electrical — check our{' '}
          <Link href="/price-guide" className="text-[#1B4332] font-semibold underline">
            BTO renovation price guide
          </Link>{' '}
          for line-item rates.
        </p>
      </section>

      <footer className="bg-[#1B4332] px-4 py-8 text-sm text-[rgba(255,255,255,0.7)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <p
            className="font-bold text-white"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            BTOPACKAGE.SG
          </p>
          <nav className="flex flex-wrap gap-3">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/directory">Directory</Link>
          </nav>
          <Link href="/submit">HDB-licensed firm? Submit a free listing →</Link>
        </div>
      </footer>
    </main>
  );
}
