'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type FlatType = '3-room' | '4-room' | '5-room';

const flatTypeOptions: Array<{ label: string; value: FlatType }> = [
  { label: '3-Room', value: '3-room' },
  { label: '4-Room', value: '4-room' },
  { label: '5-Room', value: '5-room' },
];

type FirmRow = {
  id: string;
  name: string | null;
  slug: string | null;
  google_rating: number | null;
};

type PackageRow = {
  id: string;
  slug: string | null;
  flat_type: FlatType;
  price_nett: number | null;
  is_featured: boolean | null;
  featured_position: number | null;
  id_firm: FirmRow | FirmRow[] | null;
};

function getFirm(value: PackageRow['id_firm']) {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default function Home() {
  const router = useRouter();
  const [selectedFlatType, setSelectedFlatType] = useState<FlatType>('4-room');
  const [verifiedPackages, setVerifiedPackages] = useState<PackageRow[]>([]);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const loadVerifiedPackages = async () => {
      const { data } = await supabase
        .from('id_package')
        .select('id, slug, flat_type, price_nett, is_featured, featured_position, id_firm(id, name, slug, google_rating)')
        .eq('status', 'active')
        .eq('package_type', 'bto')
        .order('featured_position', { ascending: true, nullsFirst: false })
        .order('google_rating', { ascending: false, foreignTable: 'id_firm' });

      if (mounted) {
        setVerifiedPackages((data ?? []) as PackageRow[]);
      }
    };

    loadVerifiedPackages();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredFirmsForFlatType = useMemo(() => {
    const seenFirmIds = new Set<string>();

    return verifiedPackages
      .filter((pkg) => pkg.flat_type === selectedFlatType)
      .filter((pkg) => {
        const firm = getFirm(pkg.id_firm);
        if (!firm?.id) return false;
        if (seenFirmIds.has(firm.id)) return false;
        seenFirmIds.add(firm.id);
        return true;
      });
  }, [selectedFlatType, verifiedPackages]);

  const handleFlatTypeSelect = (flatType: FlatType) => {
    setSelectedFlatType(flatType);
    router.push(`/packages/${flatType}`);
  };

  return (
    <main>
      <section className="w-full bg-[#1B4332] px-4 py-12">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-extrabold text-white md:text-5xl">
            Verified BTO Renovation Packages in Singapore.
          </h1>

          <p className="mt-3 max-w-[560px] text-base text-[rgba(255,255,255,0.82)]">
            Discover hidden gem ID firms you&apos;re missing out on — see exactly
            what&apos;s included and <span className="text-[#FCA5A5]">what&apos;s NOT</span>{' '}
            before you WhatsApp any company.
          </p>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase text-[rgba(255,255,255,0.80)]">
              Select your flat type
            </p>
            <div className="flex flex-wrap gap-3">
              {flatTypeOptions.map((flatTypeOption) => {
                const isActive = selectedFlatType === flatTypeOption.value;

                return (
                  <button
                    key={flatTypeOption.value}
                    type="button"
                    onClick={() => handleFlatTypeSelect(flatTypeOption.value)}
                    className={`min-h-[44px] rounded-full px-6 font-bold transition-colors ${
                      isActive
                        ? 'bg-[#F59E0B] text-[#78350f]'
                        : 'bg-white text-[#1B4332] hover:bg-[#f0fdf4]'
                    }`}
                  >
                    {flatTypeOption.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-[12.5px] text-[rgba(255,255,255,0.70)]">
            <span className="font-bold text-[#6EE7B7]">✓</span> HDB-verified firms
            {' · '}
            <span className="font-bold text-[#6EE7B7]">✓</span> packages with
            inclusions listed {' · '}
            <span className="font-bold text-[#6EE7B7]">✓</span> estates covered
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[600px] bg-white px-4 py-12">
        {featuredFirmsForFlatType.length > 0 ? (
          <section className="mb-10">
            <h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold text-[#1A1A1A]">
              Verified {flatTypeOptions.find((option) => option.value === selectedFlatType)?.label} BTO Packages
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Showing all active BTO packages for this flat type.
            </p>

            <div className="mt-4 space-y-3">
              {featuredFirmsForFlatType.map((pkg) => {
                const firm = getFirm(pkg.id_firm);
                if (!firm) return null;

                return (
                  <Link
                    key={pkg.id}
                    href={`/packages/${selectedFlatType}/${pkg.slug}`}
                    className="block rounded-xl border border-[#E5E0D8] bg-white p-4 hover:bg-[#F8FAFC]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#1A1A1A]">{firm.name ?? 'Firm'}</p>
                        <p className="text-xs text-[#6B7280]">
                          {typeof firm.google_rating === 'number' ? `${firm.google_rating.toFixed(1)}★ Google` : 'Rating unavailable'}
                        </p>
                      </div>
                      {pkg.price_nett ? (
                        <p className="text-sm font-semibold text-[#1B4332]">
                          ${pkg.price_nett.toLocaleString('en-SG')}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <h2 className="mb-6 font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-bold text-[#1A1A1A]">
          How it works
        </h2>

        <div className="space-y-6 rounded-xl border border-[#E5E0D8] p-6">
          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#9CA3AF]">01</p>
            <h3 className="text-base font-semibold text-[#1A1A1A]">
              Find packages for your flat type
            </h3>
            <p className="text-sm text-[#6B7280]">
              Select 3-Room, 4-Room or 5-Room. Every package is filtered to
              match.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#9CA3AF]">02</p>
            <h3 className="text-base font-semibold text-[#1A1A1A]">
              Compare inclusions — not just price
            </h3>
            <p className="text-sm text-[#6B7280]">
              See carpentry footage, flooring type, and what&apos;s NOT included,
              side by side. All firms carry a verified HDB licence number.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#9CA3AF]">03</p>
            <h3 className="text-base font-semibold text-[#1A1A1A]">
              WhatsApp your shortlisted firm directly
            </h3>
            <p className="text-sm text-[#6B7280]">
              No middlemen, no referral fees. You contact them directly — we
              never share your details.
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-[#1B4332] px-4 py-8 text-sm text-[rgba(255,255,255,0.7)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <p className="font-bold text-white">BTOPACKAGE.SG</p>
          <nav className="flex flex-wrap gap-3">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/guides">Guides</a>
            <a href="/estates">Estates</a>
            <a href="/directory">Directory</a>
          </nav>
          <a href="/submit">HDB-licensed firm? Submit a free listing →</a>
        </div>
      </footer>
    </main>
  );
}
