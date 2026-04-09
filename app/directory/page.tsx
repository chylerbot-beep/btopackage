import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'HDB-Licensed Interior Design Firms Singapore | Btopackage.sg Directory',
  description:
    'Browse all HDB-licensed interior design firms listed on Btopackage.sg. Filter by CaseTrust accreditation, Google rating, and flat type. No referral fees.',
  alternates: {
    canonical: 'https://www.btopackage.sg/directory',
  },
};

type FirmRow = {
  id: string;
  name: string;
  slug: string;
  google_rating: number | null;
  google_review_count: number | null;
  hdb_license_number: string | null;
  hdb_license_verified: boolean | null;
  casetrust_accredited: boolean | null;
  known_for: string | null;
};

export default async function DirectoryPage() {
  const supabase = await createClient({
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  const { data } = await supabase
    .from('id_firm')
    .select(
      'id, name, slug, google_rating, google_review_count, hdb_license_number, hdb_license_verified, casetrust_accredited, known_for',
    )
    .is('deleted_at', null)
    .eq('is_complete', true)
    .order('name', { ascending: true });

  const firms = (data ?? []) as FirmRow[];

  const directorySchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HDB-Licensed Interior Design Firms Singapore',
    description:
      'Directory of verified HDB-licensed interior design firms on Btopackage.sg',
    url: 'https://www.btopackage.sg/directory',
    numberOfItems: firms.length,
    itemListElement: firms.map((firm, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: firm.name,
      url: `https://www.btopackage.sg/packages/4-room/${firm.slug}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorySchema) }}
      />

      {/* Hero */}
      <section className="w-full bg-[#1B4332] px-4 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <h1
            className="text-3xl font-extrabold text-white"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Firm Directory
          </h1>
          <p className="mt-3 text-base" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {firms.length} HDB-licensed interior design firms. All listings are independently
            verified — no referral fees, no hidden commissions.
          </p>
        </div>
      </section>

      {/* Firm list */}
      <section className="mx-auto w-full max-w-3xl px-4 py-10">
        {firms.length === 0 ? (
          <p className="text-[#6B7280]">No firms listed yet. Check back soon.</p>
        ) : (
          <ul className="space-y-3">
            {firms.map((firm) => (
              <li key={firm.id}>
                <Link
                  href={`/packages/4-room/${firm.slug}`}
                  className="flex items-start justify-between gap-4 rounded-xl border border-[#E5E0D8] bg-white p-5 transition-shadow hover:shadow-md"
                >
                  <div className="min-w-0">
                    <p
                      className="font-semibold text-[#1A1A1A]"
                      style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
                    >
                      {firm.name}
                    </p>

                    {firm.known_for && (
                      <p className="mt-1 truncate text-sm text-[#6B7280]">{firm.known_for}</p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2">
                      {firm.hdb_license_verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2 py-0.5 text-xs font-medium text-[#16A34A]">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            className="h-3 w-3"
                            fill="none"
                          >
                            <path
                              d="M3.8 8.4 6.6 11l5.6-5.5"
                              stroke="#16A34A"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          HDB Licensed
                        </span>
                      )}
                      {firm.casetrust_accredited && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FFFBEB] px-2 py-0.5 text-xs font-medium text-[#D97706]">
                          CaseTrust
                        </span>
                      )}
                      {firm.google_rating != null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F9F7F4] px-2 py-0.5 text-xs text-[#6B7280]">
                          ★ {firm.google_rating.toFixed(1)}
                          {firm.google_review_count != null &&
                            ` (${firm.google_review_count})`}
                        </span>
                      )}
                    </div>
                  </div>

                  <svg
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-[#9CA3AF]"
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M6 3l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#1B4332] px-4 py-10 text-center text-white">
        <div className="mx-auto w-full max-w-3xl">
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Are you an HDB-licensed firm?
          </h2>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Submit a free listing and reach homeowners who are actively comparing renovation
            packages.
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-[#1B4332]"
          >
            Submit your firm →
          </Link>
        </div>
      </section>

      {/* Footer */}
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
