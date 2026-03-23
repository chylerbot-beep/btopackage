'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────

type FlatType = '3-room' | '4-room' | '5-room';

const FLAT_TYPE_OPTIONS: Array<{ label: string; value: FlatType }> = [
  { label: '3-Room', value: '3-room' },
  { label: '4-Room', value: '4-room' },
  { label: '5-Room', value: '5-room' },
];

// Source: MoneySmart HDB Renovation Cost Guide 2026
// These are FULL renovation figures (furniture + fittings included).
// Packages on this site cover carpentry and finishes only.
const PRICE_INDEX: Record<FlatType, { min: number; max: number }> = {
  '3-room': { min: 36100, max: 43700 },
  '4-room': { min: 51000, max: 61800 },
  '5-room': { min: 67000, max: 82400 },
};

type FirmRow = {
  id: string;
  name: string | null;
  slug: string | null;
  google_rating: number | null;
  google_review_count: number | null;
  hdb_license_number: string | null;
  hdb_license_verified: boolean | null;
  casetrust_accredited: boolean | null;
  known_for: string | null;
  whatsapp_number: string | null;
  project_images: string[] | null;
};

type PackageRow = {
  id: string;
  slug: string | null;
  flat_type: FlatType;
  price_nett: number | null;
  is_featured: boolean | null;
  featured_position: number | null;
  kitchen_top_cabinet_ft: number | null;
  kitchen_bottom_cabinet_ft: number | null;
  master_wardrobe_ft: number | null;
  common_wardrobe_room2_ft: number | null;
  common_wardrobe_room3_ft: number | null;
  flooring_type: string | null;
  countertop_material: string | null;
  countertop_backsplash: boolean | null;
  shower_screens_included: boolean | null;
  electrical_included: boolean | null;
  plumbing_included: boolean | null;
  false_ceiling_included: boolean | null;
  doors_included: boolean | null;
  paint_brand: string | null;
  cleaning_and_haulage_included: boolean | null;
  render_3d: boolean | null;
  warranty_months: number | null;
  id_firm: FirmRow | FirmRow[] | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getFirm(value: PackageRow['id_firm']): FirmRow | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function formatPrice(n: number) {
  return '$' + n.toLocaleString('en-SG');
}

function getFirmInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function getScopeTags(pkg: PackageRow): { tags: string[]; overflow: number } {
  const all: string[] = [];

  if ((pkg.kitchen_top_cabinet_ft ?? 0) > 0 || (pkg.kitchen_bottom_cabinet_ft ?? 0) > 0)
    all.push('Kitchen carpentry');
  if ((pkg.master_wardrobe_ft ?? 0) > 0) all.push('Master wardrobe');
  if ((pkg.common_wardrobe_room2_ft ?? 0) > 0 || (pkg.common_wardrobe_room3_ft ?? 0) > 0)
    all.push('Common wardrobes');

  const ft = pkg.flooring_type;
  if (ft === 'vinyl LVT') all.push('LVT flooring');
  else if (ft === 'homogeneous tiles') all.push('Homogeneous tiles');
  else if (ft === 'parquet') all.push('Parquet flooring');
  else if (ft === 'vinyl') all.push('Vinyl flooring');

  const ct = pkg.countertop_material;
  if (ct === 'sintered') all.push('Sintered stone countertop');
  else if (ct === 'quartz') all.push('Quartz countertop');
  else if (ct === 'kompacplus') all.push('Kompacplus countertop');

  if (pkg.countertop_backsplash) all.push('Countertop backsplash');
  if (pkg.shower_screens_included) all.push('Shower screens');
  if (pkg.electrical_included) all.push('Electrical');
  if (pkg.plumbing_included) all.push('Plumbing');
  if (pkg.false_ceiling_included) all.push('False ceiling');
  if (pkg.doors_included) all.push('Bedroom & toilet doors');
  if (pkg.paint_brand) all.push('Full painting');
  if (pkg.cleaning_and_haulage_included) all.push('Cleaning & haulage');
  if (pkg.render_3d) all.push('3D render');
  if (pkg.warranty_months) all.push('Warranty');

  const MAX = 5;
  return { tags: all.slice(0, MAX), overflow: Math.max(0, all.length - MAX) };
}

function buildWhatsAppHref(firm: FirmRow, pkg: PackageRow): string {
  if (!firm.whatsapp_number || !pkg.price_nett) return '#';
  const sanitized = firm.whatsapp_number
    .replace(/[^\d]/g, '')
    .replace(/^65/, '');
  const message = encodeURIComponent(
    `Hi ${firm.name ?? 'there'}, I found your ${pkg.flat_type} BTO package at ${formatPrice(pkg.price_nett)} on Btopackage.sg and would like to arrange a preliminary consultation. Could you let me know your availability?`
  );
  return `https://wa.me/65${sanitized}?text=${message}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrustChecklist({ firm }: { firm: FirmRow }) {
  const rows = [
    {
      label: 'HDB Licence',
      value: firm.hdb_license_number ?? null,
      checked: !!firm.hdb_license_verified,
    },
    {
      label: 'Google Rating',
      value:
        firm.google_rating != null
          ? `${firm.google_rating.toFixed(1)}★${firm.google_review_count ? ` (${firm.google_review_count} reviews)` : ''}`
          : null,
      checked: (firm.google_rating ?? 0) >= 4.5,
    },
    {
      label: 'CaseTrust',
      value: firm.casetrust_accredited ? 'Accredited' : 'Not accredited',
      checked: !!firm.casetrust_accredited,
    },
  ];

  return (
    <div className="space-y-[6px]">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-[7px]">
          {row.checked ? (
            <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#16A34A]">
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5L3.2 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <span className="h-4 w-4 flex-shrink-0 rounded-full border border-[#E5E7EB] bg-[#F9FAFB]" />
          )}
          <span className="text-[13px] text-[#374151]">
            <span className="font-medium">{row.label}</span>
            {row.value && <span className="text-[#6B7280]"> · {row.value}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScopeSection({ pkg }: { pkg: PackageRow }) {
  const { tags, overflow } = getScopeTags(pkg);
  if (tags.length === 0) return null;

  return (
    <div>
      <p className="mb-[6px] text-[11px] font-semibold uppercase tracking-[0.07em] text-[#9CA3AF]">
        Package Scope
      </p>
      <div className="flex flex-wrap gap-[6px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-[4px] border border-[#E5E0D8] bg-[#F9F7F4] px-[10px] py-[4px] text-[13px] font-medium text-[#374151]"
          >
            {tag}
          </span>
        ))}
        {overflow > 0 && (
          <span className="rounded-[4px] border border-[#E5E7EB] bg-[#F3F4F6] px-[10px] py-[4px] text-[13px] text-[#9CA3AF]">
            +{overflow} more
          </span>
        )}
      </div>
    </div>
  );
}

function TrustPill({ firm }: { firm: FirmRow }) {
  const metCount = [
    firm.hdb_license_verified,
    (firm.google_rating ?? 0) >= 4.5,
    firm.casetrust_accredited,
  ].filter(Boolean).length;

  if (metCount === 3) {
    return (
      <span
        className="inline-block rounded-[20px] px-[9px] py-[2px] text-[12px] font-semibold"
        style={{ border: '1.5px solid #16A34A', color: '#16A34A', background: 'rgba(22,163,74,0.10)' }}
      >
        All criteria met
      </span>
    );
  }
  return (
    <span
      className="inline-block rounded-[20px] px-[9px] py-[2px] text-[12px] font-medium"
      style={{ border: '1.5px solid #D1D5DB', color: '#9CA3AF' }}
    >
      {metCount} of 3 met
    </span>
  );
}

function VerifiedCard({
  pkg,
  savedSlugs,
  onToggleSave,
}: {
  pkg: PackageRow;
  savedSlugs: Set<string>;
  onToggleSave: (slug: string) => void;
}) {
  const firm = getFirm(pkg.id_firm);
  if (!firm || !pkg.slug) return null;

  const isSaved = savedSlugs.has(pkg.slug);
  const allMet = [firm.hdb_license_verified, (firm.google_rating ?? 0) >= 4.5, firm.casetrust_accredited].filter(Boolean).length === 3;
  const firstImage = firm.project_images?.[0] ?? null;
  const waHref = buildWhatsAppHref(firm, pkg);

  return (
    <div
      className="flex flex-shrink-0 flex-col overflow-hidden rounded-xl bg-white"
      style={{
        minWidth: '78vw',
        maxWidth: '300px',
        border: '1px solid #E5E0D8',
        borderTop: `3px solid ${allMet ? '#F59E0B' : '#E5E7EB'}`,
        scrollSnapAlign: 'start',
      }}
    >
      {/* Photo header */}
      <div
        className="relative flex h-[168px] items-end"
        style={{
          background: firstImage
            ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55)), url(${firstImage}) center/cover no-repeat`
            : 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
        }}
      >
        {!firstImage && (
          <span
            className="absolute inset-0 flex items-center justify-center select-none font-extrabold text-white"
            style={{ fontSize: '44px', opacity: 0.12, fontFamily: 'var(--font-bricolage-grotesque)' }}
            aria-hidden
          >
            {getFirmInitials(firm.name)}
          </span>
        )}
        <div className="relative flex w-full items-end justify-between px-[11px] pb-[9px]">
          <div>
            <p
              className="font-extrabold text-white"
              style={{ fontSize: '17px', fontFamily: 'var(--font-bricolage-grotesque)', textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
            >
              {firm.name ?? 'Firm'}
            </p>
            <TrustPill firm={firm} />
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onToggleSave(pkg.slug!); }}
            className="min-h-[32px] rounded-[20px] px-[9px] py-[3px] text-[12px] font-semibold text-white"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            {isSaved ? '✓ Saved' : '♡ Save'}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-[7px] p-[11px]">
        {pkg.price_nett != null && (
          <p
            className="font-extrabold text-[#1B4332]"
            style={{ fontSize: '24px', fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            {formatPrice(pkg.price_nett)}
          </p>
        )}

        {firm.known_for && (
          <p className="text-[12px] italic leading-[1.45] text-[#6B7280]">{firm.known_for}</p>
        )}

        <ScopeSection pkg={pkg} />

        <hr style={{ borderColor: '#F3EFE9', margin: '2px 0' }} />

        <TrustChecklist firm={firm} />

        <div className="mt-1 flex flex-col gap-[5px]">
          <Link
            href={`/packages/${pkg.flat_type}/${pkg.slug}`}
            className="block rounded-[9px] px-[12px] py-[9px] text-center text-[13px] font-semibold transition-colors"
            style={allMet ? { background: '#1B4332', color: '#fff' } : { background: '#fff', border: '1.5px solid #1B4332', color: '#1B4332' }}
          >
            View Full Package →
          </Link>
          {waHref !== '#' && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
                  (window as any).gtag('event', 'whatsapp_click', {
                    firm_name: firm.name,
                    package_slug: pkg.slug,
                    price: pkg.price_nett,
                    flat_type: pkg.flat_type,
                  });
                }
              }}
              className="flex items-center justify-center gap-2 rounded-[9px] px-[12px] py-[8px] text-[13px] font-semibold"
              style={{ background: '#fff', border: '1.5px solid #25D366', color: '#1A7A3C' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp to Enquire
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Answer Capsule ───────────────────────────────────────────────────────────

function AnswerCapsule({ flatType }: { flatType: FlatType }) {
  const { min, max } = PRICE_INDEX[flatType];
  const label = FLAT_TYPE_OPTIONS.find((o) => o.value === flatType)?.label ?? flatType;
  return (
    <div
      className="mt-4 rounded-[8px] px-[14px] py-[12px]"
      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
    >
      <p
        className="mb-[4px] text-[11px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        Market Context
      </p>
      <p className="text-[14px] leading-snug" style={{ color: 'rgba(255,255,255,0.88)' }}>
        Average {label} BTO renovation:{' '}
        <span className="font-semibold text-white">
          {formatPrice(min)}–{formatPrice(max)}
        </span>{' '}
        (MoneySmart 2026). Packages cover carpentry &amp; finishes — electrical and plumbing are
        quoted separately.
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [selectedFlatType, setSelectedFlatType] = useState<FlatType>('4-room');
  const [featuredPackages, setFeaturedPackages] = useState<PackageRow[]>([]);
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const load = async () => {
      const { data, error } = await supabase
        .from('package')
        .select(`
          id, slug, flat_type, price_nett, is_featured, featured_position,
          kitchen_top_cabinet_ft, kitchen_bottom_cabinet_ft,
          master_wardrobe_ft, common_wardrobe_room2_ft, common_wardrobe_room3_ft,
          flooring_type, countertop_material, countertop_backsplash,
          shower_screens_included, electrical_included, plumbing_included,
          false_ceiling_included, doors_included, paint_brand,
          cleaning_and_haulage_included, render_3d, warranty_months,
          id_firm (
            id, name, slug, google_rating, google_review_count,
            hdb_license_number, hdb_license_verified, casetrust_accredited,
            known_for, whatsapp_number, project_images
          )
        `)
        .eq('status', 'active')
        .eq('package_type', 'bto')
        .eq('is_featured', true)
        .is('deleted_at', null)
        .order('featured_position', { ascending: true, nullsFirst: false });

      if (error) console.error(error);
      if (mounted) setFeaturedPackages((data ?? []) as PackageRow[]);
    };

    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('btopackage_shortlist');
      if (raw) setSavedSlugs(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, []);

  const handleToggleSave = (slug: string) => {
    setSavedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      try { localStorage.setItem('btopackage_shortlist', JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const cardsForFlatType = useMemo(() => {
    const seenFirmIds = new Set<string>();
    return featuredPackages
      .filter((pkg) => pkg.flat_type === selectedFlatType)
      .filter((pkg) => {
        const firm = getFirm(pkg.id_firm);
        if (!firm?.id) return false;
        if (seenFirmIds.has(firm.id)) return false;
        seenFirmIds.add(firm.id);
        return true;
      });
  }, [selectedFlatType, featuredPackages]);

  const flatLabel = FLAT_TYPE_OPTIONS.find((o) => o.value === selectedFlatType)?.label ?? '';

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#1B4332] px-4 py-12">
        <div className="mx-auto w-full max-w-3xl">
          <h1
            className="text-4xl font-extrabold text-white md:text-5xl"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            Verified BTO Renovation Packages in Singapore.
          </h1>

          <p className="mt-3 max-w-[560px] text-base" style={{ color: 'rgba(255,255,255,0.82)' }}>
            Discover hidden gem ID firms you&apos;re missing out on — see exactly what&apos;s
            included and <span className="text-[#FCA5A5]">what&apos;s NOT</span> before you
            WhatsApp any company.
          </p>

          <AnswerCapsule flatType={selectedFlatType} />

          <div className="mt-6">
            <p
              className="mb-2 text-xs font-semibold uppercase"
              style={{ color: 'rgba(255,255,255,0.80)' }}
            >
              Select your flat type
            </p>
            <div className="flex flex-wrap gap-3">
              {FLAT_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedFlatType(opt.value)}
                  className="min-h-[44px] rounded-full px-6 font-bold transition-colors"
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
          </div>

          <p className="mt-4 text-[12.5px]" style={{ color: 'rgba(255,255,255,0.70)' }}>
            <span className="font-bold text-[#6EE7B7]">✓</span> HDB-verified firms
            {' · '}
            <span className="font-bold text-[#6EE7B7]">✓</span> packages with inclusions listed
            {' · '}
            <span className="font-bold text-[#6EE7B7]">✓</span> estates covered
          </p>
        </div>
      </section>

      {/* ── Verified listings ─────────────────────────────────────────────── */}
      {cardsForFlatType.length >= 1 && (
        <section className="bg-white px-4 py-10">
          <div className="mx-auto w-full max-w-3xl">
            <h2
              className="text-2xl font-bold text-[#1A1A1A]"
              style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
            >
              Verified {flatLabel} BTO Packages
            </h2>

            <p className="mt-1 text-[13px]">
              <span className="font-semibold text-[#374151]">Credibility criteria:</span>{' '}
              <span className="text-[#16A34A]">HDB licensed</span>
              {' · '}
              <span className="text-[#16A34A]">Google 4.5★ or above</span>
              {' · '}
              <span className="text-[#16A34A]">CaseTrust accredited</span>
            </p>

            {/* Horizontal scroll — mobile swipe */}
            <div
              className="mt-5 flex gap-3 overflow-x-auto pb-3"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                marginLeft: '-16px',
                marginRight: '-16px',
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
            >
              {cardsForFlatType.map((pkg) => (
                <VerifiedCard
                  key={pkg.id}
                  pkg={pkg}
                  savedSlugs={savedSlugs}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>

            {cardsForFlatType.length >= 2 && (
              <p className="mt-2 text-center text-[12px] text-[#9CA3AF]">
                ← Swipe to see all {cardsForFlatType.length} listings →
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── How it works ──────────────────────────────────────────────────── */}
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
              body: "No middlemen, no referral fees. You contact them directly — we never share your details.",
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

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#1B4332] px-4 py-8 text-sm text-[rgba(255,255,255,0.7)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <p
            className="font-bold text-white"
            style={{ fontFamily: 'var(--font-bricolage-grotesque)' }}
          >
            BTOPACKAGE.SG
          </p>
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
