'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { FlatType } from '@/lib/types';
import { buildWhatsAppHref } from '@/lib/whatsapp';

const FLAT_TYPE_OPTIONS: Array<{ label: string; value: FlatType }> = [
  { label: '3-Room', value: '3-room' },
  { label: '4-Room', value: '4-room' },
  { label: '5-Room', value: '5-room' },
];

export type FirmRow = {
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
  whatsapp_message: string | null;
  project_images: string[] | null;
};

export type PackageRow = {
  id: string;
  slug: string | null;
  flat_type: FlatType;
  price_nett: number | null;
  image_url: string | null;
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

function toCssBackgroundImage(imageUrl: string | null) {
  if (!imageUrl) {
    return 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)';
  }

  const safeUrl = imageUrl.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
  return `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55)), url("${safeUrl}")`;
}

function getWhatsAppHref(firm: FirmRow, pkg: PackageRow): string {
  if (!firm.whatsapp_number || !pkg.price_nett) return '#';
  return buildWhatsAppHref({
    phoneNumber: firm.whatsapp_number,
    firmName: firm.name ?? 'there',
    flatType: pkg.flat_type,
    priceText: formatPrice(pkg.price_nett),
    customMessage: firm.whatsapp_message,
  });
}

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
  const packageHref = pkg.slug ? `/packages/${pkg.flat_type}/${pkg.slug}` : null;

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
        {overflow > 0 && packageHref && (
          <Link
            href={packageHref}
            className="rounded-[4px] border border-[#E5E7EB] bg-[#F3F4F6] px-[10px] py-[4px] text-[13px] text-[#9CA3AF] transition-colors active:border-[#F59E0B] active:bg-[#F59E0B] active:text-[#78350F]"
          >
            +{overflow} more
          </Link>
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
      {metCount}/3 criteria met
    </span>
  );
}

function VerifiedCard({
  pkg,
}: {
  pkg: PackageRow;
}) {
  const firm = getFirm(pkg.id_firm);
  if (!firm || !pkg.slug) return null;

  const allMet = [firm.hdb_license_verified, (firm.google_rating ?? 0) >= 4.5, firm.casetrust_accredited].filter(Boolean).length === 3;
  const heroImage = pkg.image_url ?? firm.project_images?.[0] ?? null;
  const waHref = getWhatsAppHref(firm, pkg);
  const [isViewButtonPressed, setIsViewButtonPressed] = useState(false);

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
      <div
        className="relative flex h-[168px] items-end"
        style={{
          backgroundImage: toCssBackgroundImage(heroImage),
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {!heroImage && (
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
        </div>
      </div>

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
            onMouseDown={() => setIsViewButtonPressed(true)}
            onMouseUp={() => setIsViewButtonPressed(false)}
            onMouseLeave={() => setIsViewButtonPressed(false)}
            onTouchStart={() => setIsViewButtonPressed(true)}
            onTouchEnd={() => setIsViewButtonPressed(false)}
            onTouchCancel={() => setIsViewButtonPressed(false)}
            onBlur={() => setIsViewButtonPressed(false)}
            className="block rounded-[9px] px-[12px] py-[9px] text-center text-[13px] font-semibold transition-colors"
            style={
              isViewButtonPressed
                ? { background: '#F59E0B', color: '#78350F', border: '1.5px solid #F59E0B' }
                : allMet
                  ? { background: '#1B4332', color: '#fff' }
                  : { background: '#fff', border: '1.5px solid #1B4332', color: '#1B4332' }
            }
          >
            View Full Package →
          </Link>
          {waHref !== '#' && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                  window.gtag('event', 'whatsapp_click', {
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

type PackageListingsProps = {
  packages: PackageRow[];
  defaultFlatType: FlatType;
};

export default function PackageListings({ packages, defaultFlatType }: PackageListingsProps) {
  const [selectedFlatType, setSelectedFlatType] = useState<FlatType>(defaultFlatType);

  const cardsForFlatType = useMemo(() => {
    const seenFirmIds = new Set<string>();
    return packages
      .filter((pkg) => pkg.flat_type === selectedFlatType)
      .filter((pkg) => {
        const firm = getFirm(pkg.id_firm);
        if (!firm?.id) return false;
        if (seenFirmIds.has(firm.id)) return false;
        seenFirmIds.add(firm.id);
        return true;
      });
  }, [packages, selectedFlatType]);

  const flatLabel = FLAT_TYPE_OPTIONS.find((o) => o.value === selectedFlatType)?.label ?? '';

  return (
    <>
      <div className="mt-6">
        <p
          className="mb-2 text-xs font-semibold uppercase"
          style={{ color: 'rgba(255,255,255,0.80)' }}
        >
          Select your flat type
        </p>
        <div className="flex gap-2">
          {FLAT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedFlatType(opt.value)}
              className="min-h-[40px] flex-1 rounded-full px-3 text-sm font-bold transition-colors"
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
    </>
  );
}

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params: Record<string, unknown>) => void;
  }
}
