import Link from 'next/link';
import HomeClient from '@/components/HomeClient';
import { type FirmRow, type PackageRow } from '@/components/PackageListings';
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
              url: 'https://www.btopackage.sg',
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': 'https://www.btopackage.sg/#org',
            name: 'Btopackage.sg',
            url: 'https://www.btopackage.sg',
            description:
              'Independent directory of verified BTO renovation packages from HDB-licensed interior design firms in Singapore.',
            areaServed: 'SG',
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
        </div>
      </section>

      <HomeClient packages={packages} />

      <section className="bg-white px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            How much does a BTO renovation cost in Singapore (2026)?
          </h2>
          <p className="mt-4 text-sm text-[#374151]">
            Before you compare packages, it helps to know the market range. Based on MoneySmart&apos;s
            2026 HDB Renovation Cost Guide, here is what a full BTO renovation typically costs —
            including furniture and fittings:
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] py-3 text-sm">
              <span className="font-semibold text-[#1A1A1A]">3-Room BTO</span>
              <span className="font-semibold text-[#1A1A1A]">$36,100 – $43,700</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E5E0D8] py-3 text-sm">
              <span className="font-semibold text-[#1A1A1A]">4-Room BTO</span>
              <span className="font-semibold text-[#1A1A1A]">$51,000 – $61,800</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E5E0D8] py-3 text-sm">
              <span className="font-semibold text-[#1A1A1A]">5-Room BTO</span>
              <span className="font-semibold text-[#1A1A1A]">$67,000 – $82,400</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-[#9CA3AF]">
            Packages on this platform cover carpentry and finishes only — not the full renovation.
            Use the{' '}
            <Link href="/price-guide" className="underline">
              Price Guide
            </Link>{' '}
            to check individual item rates.
          </p>
        </div>
      </section>

      <section className="bg-[#F9F7F4] px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Why comparing BTO packages is harder than it looks
          </h2>
          <div className="mt-4 space-y-4 text-sm text-[#374151]">
            <p>
              Two packages priced at $30,000 are rarely apple to apple. One might include
              full-height carpentry for all three bedrooms. Another covers only the master bedroom.
              The price looks the same until you start asking questions — and by then you may
              already have signed.
            </p>
            <p>
              Variation Orders (VOs) are how the gap gets charged back to you later. Anything not
              explicitly covered in the original package becomes a VO — and VOs are almost always
              more expensive than if it had been included upfront.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="mb-6 text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            How Btopackage.sg helps you compare
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

          <p className="mt-4 text-sm text-[#6B7280]">
            Every firm on this platform has a verified HDB licence number. Inclusions and
            exclusions are listed line by line — so there are no surprises.
          </p>
        </div>
      </section>

      <section className="bg-[#F9F7F4] px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="text-2xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            How we verify the firms on this platform
          </h2>

          <div className="mt-6">
            <div className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-5 text-[#374151]">
              <h3 className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
                <span className="text-[#16A34A]">✓</span>
                HDB Renovation Licence — verified
              </h3>
              <p className="mt-2">
                Every firm on this platform holds a valid HDB Renovation Contractor licence. We
                check the licence number against HDB&apos;s records before a listing goes live.
                Unlicensed contractors cannot legally carry out renovation works in HDB flats —
                this is the baseline we hold every firm to.
              </p>
            </div>

            <div className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-5 text-[#374151]">
              <h3 className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
                <span className="text-[#16A34A]">✓</span>
                In-house team, not outsourced
              </h3>
              <p className="mt-2">
                We prioritise firms that use their own full-time workers rather than subcontracting
                the job out. When work is subcontracted, accountability gets murky — if something
                goes wrong, it is harder to know who to call. An in-house team means the firm is
                directly responsible for the quality of every job.
              </p>
            </div>

            <div className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-5 text-[#374151]">
              <h3 className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
                <span className="text-[#16A34A]">✓</span>
                CaseTrust accredited — your deposit is protected
              </h3>
              <p className="mt-2">
                CaseTrust-accredited firms are required to place customer deposits in a protected
                escrow account. If anything goes wrong before the renovation is complete, your
                deposit is not lost. We flag which firms carry this accreditation so you can factor
                it into your decision.
              </p>
            </div>

            <div className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-5 text-[#374151]">
              <h3 className="flex items-center gap-2 font-semibold text-[#1A1A1A]">
                <span className="text-[#16A34A]">✓</span>
                Google rating — real feedback from real homeowners
              </h3>
              <p className="mt-2">
                Singaporeans are not shy about leaving a bad review. A firm with consistently high
                Google ratings across many reviews is a reliable signal that homeowners were
                satisfied with the outcome. We show each firm&apos;s Google rating and review count
                directly on their listing.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#9CA3AF]">
            Not every firm meets all three criteria. Each listing clearly shows which signals are
            verified — so you can decide what matters most to you.
          </p>
        </div>
      </section>

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
            <Link href="/guides" className="text-[rgba(255,255,255,0.7)] hover:text-white">
              Guides
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
            <Link
              href="/submit"
              className="text-xs font-medium text-[rgba(255,255,255,0.85)] hover:text-white"
            >
              HDB-licensed firm? Submit a free listing →
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
