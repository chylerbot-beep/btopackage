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
            itemListElement: verifiedFirms.reduce<Array<{
              '@type': 'ListItem';
              position: number;
              name: string;
              url: string;
            }>>((items, firm) => {
              const firmSlug = firm.slug?.trim();
              if (!firmSlug) return items;

              items.push({
                '@type': 'ListItem',
                position: items.length + 1,
                name: firm.name,
                url: `https://www.btopackage.sg/packages/4-room/${firmSlug}`,
              });

              return items;
            }, []),
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
            Discover hidden gem ID firms - HDB Licensed, CaseTrust Accredited, Solid Google Ratings. Check what&apos;s included or not in each BTO package
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
            Based on MoneySmart&apos;s
            2026 HDB Renovation Cost Guide, here is what a full BTO renovation typically costs
            excluding furniture and furnishings:
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

        </div>
      </section>

      <section className="bg-white px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="text-xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            How to find your BTO package
          </h2>

          <div className="mt-6 space-y-6 rounded-xl border border-[#E5E0D8] bg-white p-6">
            <div className="flex gap-3">
              <p className="w-6 shrink-0 text-xs font-bold tracking-widest text-[#9CA3AF]">01</p>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Pick your flat type</h3>
                <p className="text-sm text-[#6B7280]">
                  3-room, 4-room, or 5-room? Filter to see packages for your layout.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <p className="w-6 shrink-0 text-xs font-bold tracking-widest text-[#9CA3AF]">02</p>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">
                  Compare what&apos;s included — not just the price
                </h3>
                <p className="text-sm text-[#6B7280]">
                  Don&apos;t just look at the promo price. See exactly what&apos;s included and
                  what&apos;s left out. 
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <p className="w-6 shrink-0 text-xs font-bold tracking-widest text-[#9CA3AF]">03</p>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">WhatsApp the ID directly</h3>
                <p className="text-sm text-[#6B7280]">
                  Found a package that fits your budget? Click to WhatsApp the firm straight. We
                  never collect or share your details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F9F7F4] px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="text-xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Why you need to compare properly
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#374151]">
            <p>
              Two IDs can both quote $30,000 for your BTO, but what you get can be very
              different. A lot of times, very cheap promo prices do not even include flooring or a
              solid countertop. If you are not careful, the hidden costs will pile up fast.
            </p>
            <p>
              Cross-check your quote against our BTO Price Guide to make sure you are paying a
              fair market rate before you sign anything.
            </p>
          </div>
          <Link
            href="/price-guide"
            className="mt-4 inline-block rounded-full border border-[#1B4332] px-5 py-2 text-sm font-medium text-[#1B4332] transition-colors hover:bg-[#1B4332] hover:text-white"
          >
            Check the Price Guide →
          </Link>
        </div>
      </section>

      <section className="bg-white px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="text-xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            How we verify the firms on this platform
          </h2>

          <div className="mt-6">
            {[
              {
                title: 'HDB Renovation Licence verified',
                body: "Every firm holds a valid HDB Renovation Contractor licence. We check their licence number against HDB's records before the listing goes live and we check for any existing penalties from HDB.",
              },
              {
                title: 'In-house team',
                body: 'When work is subcontracted, things get messy if something goes wrong. We prioritise firms that use their own full-time workers instead of subcontracting.',
              },
              {
                title: 'CaseTrust accredited',
                body: 'If the firm goes bankrupt before your reno is done, your deposit is 100% protected and guaranteed. CaseTrust firms are required to hold customer deposits in a protected escrow account. We flag which firms carry this accreditation.',
              },
              {
                title: 'Solid Google rating',
                body: "Singaporeans are not shy about leaving a bad review if the work is bad. We show each firm's Google rating directly on their listing.",
              },
            ].map((item) => (
              <div key={item.title} className="mb-3 rounded-xl border border-[#E5E0D8] bg-white p-5">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#16A34A]">
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none">
                      <path
                        d="M3.8 8.4 6.6 11l5.6-5.5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-[#9CA3AF]">
            Not every firm meets all criteria. Each listing shows exactly which signals are
            verified so you can decide what matters most to you.
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
