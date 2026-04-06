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
        </div>
      </section>

      <HomeClient packages={packages} />

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

      <section className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10 text-sm text-[#374151]">
        <h3
          className="text-xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          What to Look For in a BTO Renovation Package (So It&apos;s Apple to Apple)
        </h3>
        <p>
          So before we go into the numbers, let me just briefly explain how BTO renovation
          packages actually work. Actually, the prices in the market can vary widely. Two
          packages priced at $30,000, right? When you compare them, it&apos;s not always apple to
          apple.
        </p>
        <p>
          One package might include the full-height carpentry for all three bedrooms, while
          another one only covers your master bedroom. And things like your flooring scope, your
          sintered stone tabletop, or whether you are doing a full false ceiling versus just an
          L-box—usually, these are left out of the headline price. If you&apos;re not careful, the
          VOs (Variation Orders) will add up very fast later on.
        </p>

        <h4 className="text-lg font-semibold text-[#1A1A1A]">How Btopackage.sg Helps You Compare</h4>
        <p>
          So what Btopackage.sg does is, we list out packages from HDB-licensed interior design
          firms, and we break everything down for you line by line. Inside, you will see exactly
          what you are getting:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <span className="font-semibold">Carpentry:</span> Calculated clearly by per foot run
            (pfr).
          </li>
          <li>
            <span className="font-semibold">Materials:</span> Exact countertop materials (e.g.,
            Quartz vs. Sintered Stone) and flooring types.
          </li>
          <li>
            <span className="font-semibold">Exclusions:</span> What is explicitly put under
            &quot;optional&quot; or not covered.
          </li>
        </ul>
        <p>
          This way, everything is transparent so you won&apos;t get a shock later. Plus, confirm every
          firm on this platform has a verified HDB licence number—which is a strict HDB requirement
          before we can even start any hacking or wet works for your unit.
        </p>

        <h3
          className="text-xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
        >
          How Much Does a BTO Renovation Cost in Singapore (2026)?
        </h3>
        <p>
          If you are planning your budget before your key collection, it helps to know the market
          rate. Of course, it depends on whether you are OCS-in or OCS-out, but based on recent
          data (MoneySmart 2026), here is the rough costing:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <span className="font-semibold">3-Room BTO Renovation Cost:</span> $36,100 – $43,700
          </li>
          <li>
            <span className="font-semibold">4-Room BTO Renovation Cost:</span> $51,000 – $61,800
          </li>
          <li>
            <span className="font-semibold">5-Room BTO Renovation Cost:</span> $67,000 – $82,400
          </li>
        </ul>
        <p>
          These figures cover your main works like built-in carpentry, flooring, tiling, painting,
          and basic electrical. If you want to see how these numbers are calculated, you can just
          check our{' '}
          <Link href="https://www.btopackage.sg/price-guide" className="font-semibold text-[#1B4332] underline">
            BTO renovation price guide
          </Link>
          . We show you the unit rates so you can find a package that actually fits your budget.
          Okay?
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
