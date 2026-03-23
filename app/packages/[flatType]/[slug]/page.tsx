import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PackageHeroImage from '@/components/PackageHeroImage';
import PriceContextBar from '@/components/PriceContextBar';
import TrustChecklist from '@/components/TrustChecklist';
import WhatsAppButton from '@/components/WhatsAppButton';
import { createServerClient } from '@/lib/supabase/server';

const VALID_FLAT_TYPES = ['3-room', '4-room', '5-room'] as const;
type FlatType = (typeof VALID_FLAT_TYPES)[number];

type PackagePageProps = {
  params: {
    flatType: string;
    slug: string;
  };
};

export const revalidate = 3600;

const toDisplayFlatType = (flatType: string) => {
  const [count, room] = flatType.split('-');
  return `${count}-${room.charAt(0).toUpperCase()}${room.slice(1)}`;
};

const isValidFlatType = (flatType: string): flatType is FlatType => {
  return VALID_FLAT_TYPES.includes(flatType as FlatType);
};

const formatIncludedLabel = (included: boolean | null) => (included ? 'Included' : 'Not included');

const joinWithAnd = (items: string[]) => {
  if (items.length <= 1) {
    return items.join('');
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
};

const getHeightLabel = (value: boolean | null) => {
  if (value === true) {
    return '(full height)';
  }

  if (value === false) {
    return '(partial height)';
  }

  return '';
};

const ACCORDION_HEADER_CLASS =
  'flex cursor-pointer items-center justify-between p-4 font-semibold text-[#1A1A1A]';
const ACCORDION_CONTENT_CLASS =
  'max-h-0 overflow-hidden border-t border-[#F3EFE9] px-4 transition-[max-height,padding] duration-300 ease-in-out peer-checked:max-h-[1200px] peer-checked:py-4 peer-checked:pt-0';
const ROW_CLASS = 'flex justify-between gap-4 border-b border-[#F9F7F4] py-2 text-sm';

async function fetchPackage(flatType: string, slug: string) {
  const supabase = await createServerClient();
  const { data: pkg } = await supabase
    .from('package')
    .select(`
      id, slug, flat_type, price_nett,
      kitchen_top_cabinet_ft, kitchen_bottom_cabinet_ft,
      master_wardrobe_ft, master_wardrobe_type, master_wardrobe_full_height,
      common_wardrobe_room2_ft, common_wardrobe_room2_type, common_wardrobe_room2_full_height,
      common_wardrobe_room3_ft, common_wardrobe_room3_type, common_wardrobe_room3_full_height,
      board_grade, flooring_type, flooring_rooms_covered,
      vinyl_thickness_mm, screeding_included,
      countertop_material, countertop_length_ft, countertop_backsplash,
      shower_screens_included, shower_screen_count,
      electrical_included, plumbing_included,
      false_ceiling_included, false_ceiling_areas,
      doors_included, door_count, door_type,
      cleaning_and_haulage_included,
      paint_brand, paint_colours, paint_coverage,
      render_3d, render_revisions, warranty_months,
      freebies, promotion_text, promotion_expiry,
      excl_kitchen_top_cabinet, excl_kitchen_bottom_cabinet,
      excl_master_wardrobe, excl_common_wardrobe_room2, excl_common_wardrobe_room3,
      excl_electrical_wiring, excl_plumbing, excl_deep_cleaning,
      excl_hdb_permit_fee, excl_flooring_bedrooms, not_included_notes,
      image_url, images, verification_expiry_date, status,
      id_firm (
        id, name, slug, known_for, pricing_model,
        hdb_license_number, hdb_license_verified, casetrust_accredited,
        google_rating, google_review_count,
        years_established, projects_completed,
        owns_factory, in_house_team,
        whatsapp_number, whatsapp_message, website_url, logo_url
      )
    `)
    .eq('slug', slug)
    .eq('flat_type', flatType)
    .is('deleted_at', null)
    .single();

  return pkg;
}

function getFirm(pkg: Awaited<ReturnType<typeof fetchPackage>>) {
  if (!pkg?.id_firm) {
    return null;
  }

  return Array.isArray(pkg.id_firm) ? pkg.id_firm[0] : pkg.id_firm;
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { flatType, slug } = params;

  if (!isValidFlatType(flatType)) {
    return {};
  }

  const pkg = await fetchPackage(flatType, slug);

  const firm = getFirm(pkg);

  if (!firm) {
    return {};
  }

  const price = Number(pkg?.price_nett || 0).toLocaleString('en-SG', { maximumFractionDigits: 0 });

  return {
    title: `${firm.name} ${toDisplayFlatType(flatType)} BTO Package $${price} | Btopackage.sg`,
    description: `${firm.name} ${flatType} BTO package at $${price}. HDB licensed · Verified.`,
    alternates: {
      canonical: `https://btopackage.sg/packages/${flatType}/${slug}`,
    },
  };
}

function Accordion({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-4 mb-3 overflow-hidden rounded-xl border border-[#E5E0D8] bg-white">
      <input id={id} type="checkbox" defaultChecked className="peer sr-only" />
      <label htmlFor={id} className={ACCORDION_HEADER_CLASS}>
        {title}
        <span aria-hidden="true" className="text-xl leading-none text-[#6B7280] peer-checked:hidden">
          +
        </span>
        <span
          aria-hidden="true"
          className="hidden text-xl leading-none text-[#6B7280] peer-checked:inline"
        >
          −
        </span>
      </label>
      <div className={ACCORDION_CONTENT_CLASS}>{children}</div>
    </section>
  );
}

function TrustRow({ checked, text }: { checked: boolean; text: string }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      {checked ? (
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#16A34A]">
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
      ) : (
        <span className="h-4 w-4 rounded-full border border-[#E5E7EB] bg-[#F9FAFB]" />
      )}
      <span className={checked ? 'text-xs font-medium text-[#1A1A1A]' : 'text-xs text-[#D1D5DB]'}>{text}</span>
    </div>
  );
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { flatType } = params;

  if (!isValidFlatType(flatType)) {
    notFound();
  }

  const pkg = await fetchPackage(flatType, params.slug);

  const firm = getFirm(pkg);

  if (!pkg || !firm) {
    notFound();
  }
  const displayFlatType = toDisplayFlatType(flatType);
  const priceLabel = Number(pkg.price_nett || 0).toLocaleString('en-SG', { maximumFractionDigits: 0 });
  const totalKitchenCarpentryFt =
    Number(pkg.kitchen_top_cabinet_ft || 0) + Number(pkg.kitchen_bottom_cabinet_ft || 0);
  const includedItems = [
    Number(pkg.kitchen_top_cabinet_ft || 0) > 0 ? `${totalKitchenCarpentryFt}ft kitchen carpentry` : null,
    pkg.countertop_material ? `${pkg.countertop_material} countertop` : null,
    Number(pkg.master_wardrobe_ft || 0) > 0 ? 'master wardrobe' : null,
    Number(pkg.common_wardrobe_room2_ft || 0) > 0 || Number(pkg.common_wardrobe_room3_ft || 0) > 0
      ? 'common bedroom wardrobes'
      : null,
    pkg.flooring_type ? `${pkg.flooring_type} flooring` : null,
    pkg.paint_brand ? `${pkg.paint_brand} paint ${pkg.paint_coverage ?? ''}`.trim() : null,
    pkg.doors_included ? `${pkg.door_count ?? 0} doors` : null,
    Number(pkg.shower_screen_count || 0) > 0 ? `${pkg.shower_screen_count} shower screens` : null,
    pkg.plumbing_included ? 'standard plumbing' : null,
    pkg.electrical_included ? 'electrical' : null,
    pkg.screeding_included ? 'cement screeding' : null,
    pkg.cleaning_and_haulage_included ? 'general cleaning' : null,
  ].filter(Boolean) as string[];
  const geoSentence = `The ${firm.name} ${pkg.flat_type} BTO package is priced at $${Number(
    pkg.price_nett || 0
  ).toLocaleString('en-SG')}, covering ${includedItems.length > 0 ? joinWithAnd(includedItems) : 'the listed scope'}.`;

  const carpentryAndFinishesExclusions = [
    pkg.excl_kitchen_top_cabinet ? 'Kitchen top cabinets' : null,
    pkg.excl_kitchen_bottom_cabinet ? 'Kitchen bottom cabinets' : null,
    pkg.excl_master_wardrobe ? 'Master bedroom wardrobe' : null,
    pkg.excl_common_wardrobe_room2 ? 'Common bedroom 2 wardrobe' : null,
    pkg.excl_common_wardrobe_room3 ? 'Common bedroom 3 wardrobe' : null,
    pkg.excl_flooring_bedrooms ? 'Flooring bedrooms' : null,
    pkg.countertop_backsplash === false ? 'Countertop backsplash' : null,
    pkg.screeding_included === false && pkg.flooring_type?.toLowerCase().includes('vinyl')
      ? 'Cement screeding'
      : null,
  ].filter(Boolean) as string[];

  const worksExclusions = [
    pkg.excl_electrical_wiring ? 'Electrical work' : null,
    pkg.excl_plumbing ? 'Plumbing works' : null,
    pkg.false_ceiling_included === false ? 'False ceiling' : null,
    pkg.doors_included === false ? 'Bedroom & toilet doors' : null,
    pkg.excl_deep_cleaning ? 'Deep cleaning' : null,
    pkg.cleaning_and_haulage_included === false ? 'General cleaning & haulage' : null,
  ].filter(Boolean) as string[];

  const serviceAndSupportExclusions = [
    pkg.warranty_months == null ? 'Warranty not stated' : null,
    pkg.render_3d === false ? '3D render not included' : null,
  ].filter(Boolean) as string[];

  const freebiesItems = (pkg.freebies ?? '')
    .split('·')
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0);

  const carpentryRows = [
    pkg.kitchen_top_cabinet_ft
      ? { label: 'Kitchen top cabinets', value: `${pkg.kitchen_top_cabinet_ft} ft` }
      : null,
    pkg.kitchen_bottom_cabinet_ft
      ? { label: 'Kitchen bottom cabinets', value: `${pkg.kitchen_bottom_cabinet_ft} ft` }
      : null,
    pkg.master_wardrobe_ft
      ? {
          label: `Master wardrobe${pkg.master_wardrobe_type ? ` (${pkg.master_wardrobe_type})` : ''}`,
          value: `${pkg.master_wardrobe_ft} ft ${getHeightLabel(pkg.master_wardrobe_full_height)}`.trim(),
        }
      : null,
    pkg.common_wardrobe_room2_ft
      ? {
          label: `Common bedroom 2 wardrobe${pkg.common_wardrobe_room2_type ? ` (${pkg.common_wardrobe_room2_type})` : ''}`,
          value: `${pkg.common_wardrobe_room2_ft} ft ${getHeightLabel(pkg.common_wardrobe_room2_full_height)}`.trim(),
        }
      : null,
    pkg.common_wardrobe_room3_ft
      ? {
          label: `Common bedroom 3 wardrobe${pkg.common_wardrobe_room3_type ? ` (${pkg.common_wardrobe_room3_type})` : ''}`,
          value: `${pkg.common_wardrobe_room3_ft} ft ${getHeightLabel(pkg.common_wardrobe_room3_full_height)}`.trim(),
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="px-4 pt-4 text-sm text-[#6B7280]">
        <Link href="/" className="hover:text-[#1A1A1A]">
          Home
        </Link>{' '}
        ›{' '}
        <Link href={`/packages/${flatType}`} className="hover:text-[#1A1A1A]">
          {displayFlatType} Packages
        </Link>{' '}
        › {firm.name}
      </div>

      <section className="mx-4 mt-4 overflow-hidden rounded-xl">
        <PackageHeroImage imageUrl={pkg.image_url} firmName={firm.name} />
      </section>

      <section className="mx-4 mt-4 rounded-xl border border-[#E5E0D8] bg-white p-5">
        <p className="font-[family-name:var(--font-bricolage-grotesque)] text-4xl font-bold text-[#1B4332]">
          ${priceLabel}
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
          {displayFlatType} BTO Package
        </p>

        <TrustRow checked={Boolean(firm.hdb_license_verified)} text={`HDB Licence ${firm.hdb_license_number ?? '-'}`} />
        <TrustRow
          checked={typeof firm.google_rating === 'number' && firm.google_rating >= 4.5}
          text={`Google ${typeof firm.google_rating === 'number' ? firm.google_rating.toFixed(1) : '-'}★ · ${typeof firm.google_review_count === 'number' ? firm.google_review_count.toLocaleString() : '-'} reviews`}
        />
        <TrustRow checked={Boolean(firm.casetrust_accredited)} text="CaseTrust Accredited" />
      </section>

      <PriceContextBar flatType={flatType} />

      <section>
        <h2 className="mb-3 mt-8 px-4 text-base font-semibold text-[#1A1A1A]">What&apos;s included in this package</h2>
        <p className="mb-4 px-4 text-sm leading-relaxed text-[#374151]">{geoSentence}</p>
      </section>

      <section>
        <h2 className="mb-3 mt-8 px-4 text-base font-semibold text-[#1A1A1A]">Not covered by this package</h2>
        <div className="mx-4 rounded-r-xl border-l-4 border-[#EF4444] bg-white p-4">
          <div className="space-y-2">
            {carpentryAndFinishesExclusions.length > 0 ? (
              <div>
                <p className="mb-2 mt-3 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                  Carpentry &amp; Finishes
                </p>
                <div className="space-y-2">
                  {carpentryAndFinishesExclusions.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#EF4444]">✕</span>
                      <span className="text-sm text-[#374151]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {worksExclusions.length > 0 ? (
              <div>
                <p className="mb-2 mt-3 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Works</p>
                <div className="space-y-2">
                  {worksExclusions.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#EF4444]">✕</span>
                      <span className="text-sm text-[#374151]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {serviceAndSupportExclusions.length > 0 ? (
              <div>
                <p className="mb-2 mt-3 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                  Service &amp; Support
                </p>
                <div className="space-y-2">
                  {serviceAndSupportExclusions.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#EF4444]">✕</span>
                      <span className="text-sm text-[#374151]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {carpentryAndFinishesExclusions.length === 0 &&
            worksExclusions.length === 0 &&
            serviceAndSupportExclusions.length === 0 ? (
              <p className="text-sm text-[#374151]">No exclusions were explicitly listed.</p>
            ) : null}
            {pkg.not_included_notes ? (
              <p className="pt-1 text-sm italic text-[#9CA3AF]">{pkg.not_included_notes}</p>
            ) : null}
          </div>

          <div className="mt-3 rounded-b-xl bg-[#FFF7F7] p-3">
            <p className="text-xs text-[#6B7280]">
              Always confirm the complete scope and final price in writing with the firm before signing.
            </p>
          </div>
        </div>
      </section>

      <section>
        {freebiesItems.length > 0 ? (
          <section className="mx-4 mb-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
            <p className="text-[12px] font-bold uppercase text-[#B45309]">Freebies</p>
            <div>
              {freebiesItems.map((item: string, index: number) => (
                <p key={`${item}-${index}`} className="py-1 text-sm text-[#1A1A1A]">
                  🎁 {item}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        <Accordion id="accordion-carpentry" title="Carpentry">
          {carpentryRows.map((row) => (
            <div key={row.label} className={ROW_CLASS}>
              <span className="text-[#6B7280]">{row.label}</span>
              <span className="text-right font-medium text-[#1A1A1A]">{row.value}</span>
            </div>
          ))}
          {pkg.board_grade ? (
            <div className={ROW_CLASS}>
              <span className="text-[#6B7280]">Board grade</span>
              <span className="font-medium text-[#1A1A1A]">{pkg.board_grade}</span>
            </div>
          ) : null}
        </Accordion>

        <Accordion id="accordion-finishes" title="Finishes">
          {pkg.flooring_type || pkg.flooring_rooms_covered ? (
            <div className={ROW_CLASS}>
              <span className="text-[#6B7280]">Flooring</span>
              <span className="font-medium text-[#1A1A1A]">
                {[pkg.flooring_type, pkg.flooring_rooms_covered].filter(Boolean).join(' · ') || '-'}
              </span>
            </div>
          ) : null}
          {pkg.flooring_type?.toLowerCase().includes('vinyl') ? (
            <div className={ROW_CLASS}>
              <span className="text-[#6B7280]">Cement screeding</span>
              <span className="font-medium text-[#1A1A1A]">{formatIncludedLabel(pkg.screeding_included)}</span>
            </div>
          ) : null}
          {pkg.countertop_material || pkg.countertop_length_ft ? (
            <div className={ROW_CLASS}>
              <span className="text-[#6B7280]">Kitchen countertop</span>
              <span className="font-medium text-[#1A1A1A]">
                {pkg.countertop_material ?? '-'}
                {pkg.countertop_length_ft ? ` · ${pkg.countertop_length_ft}ft` : ''}
              </span>
            </div>
          ) : null}
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">Countertop backsplash</span>
            <span className="font-medium text-[#1A1A1A]">{formatIncludedLabel(pkg.countertop_backsplash)}</span>
          </div>
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">Shower screens</span>
            <span className="font-medium text-[#1A1A1A]">
              {pkg.shower_screens_included
                ? `${pkg.shower_screen_count ?? 0} included`
                : 'Not included'}
            </span>
          </div>
        </Accordion>

        <Accordion id="accordion-works" title="Works">
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">Electrical work</span>
            <span className="font-medium text-[#1A1A1A]">{formatIncludedLabel(pkg.electrical_included)}</span>
          </div>
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">Plumbing works</span>
            <span className="font-medium text-[#1A1A1A]">{formatIncludedLabel(pkg.plumbing_included)}</span>
          </div>
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">False ceiling</span>
            <span className="font-medium text-[#1A1A1A]">
              {pkg.false_ceiling_included ? pkg.false_ceiling_areas ?? 'Included' : 'Not included'}
            </span>
          </div>
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">Bedroom & toilet doors</span>
            <span className="font-medium text-[#1A1A1A]">
              {pkg.doors_included ? `${pkg.door_count ?? 0} ${pkg.door_type ?? ''} doors`.trim() : 'Not included'}
            </span>
          </div>
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">Paint</span>
            <span className="font-medium text-[#1A1A1A]">
              {pkg.paint_brand
                ? pkg.paint_colours && pkg.paint_colours > 0
                  ? `${pkg.paint_brand} · ${pkg.paint_colours} colours`
                  : pkg.paint_brand
                : 'Not included'}
            </span>
          </div>
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">Cleaning & haulage</span>
            <span className="font-medium text-[#1A1A1A]">
              {formatIncludedLabel(pkg.cleaning_and_haulage_included)}
            </span>
          </div>
        </Accordion>

        <Accordion id="accordion-service" title="Service & Support">
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">3D render</span>
            <span className="font-medium text-[#1A1A1A]">
              {pkg.render_3d ? `Yes (${pkg.render_revisions ?? 0} revisions)` : 'No'}
            </span>
          </div>
          <div className={ROW_CLASS}>
            <span className="text-[#6B7280]">Warranty</span>
            <span className={`font-medium ${pkg.warranty_months ? 'text-[#1A1A1A]' : 'text-[#9CA3AF]'}`}>
              {pkg.warranty_months ? `${pkg.warranty_months} months` : 'Not stated'}
            </span>
          </div>
        </Accordion>
      </section>

      <section className="mx-4 mt-6 rounded-xl border border-[#E5E0D8] bg-white p-5">
        <h3 className="font-[family-name:var(--font-bricolage-grotesque)] text-base font-bold text-[#1A1A1A]">
          {firm.name}
        </h3>
        <p className="text-xs text-[#6B7280]">
          Est. {firm.years_established ?? '-'} · {firm.projects_completed ?? '-'} projects
        </p>
        <p className="mt-1 text-sm italic text-[#6B7280]">{firm.known_for ?? 'Known for custom BTO packages.'}</p>

        <p className="mb-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Credibility</p>
        <TrustChecklist
          hdbLicenceNumber={firm.hdb_license_number}
          googleRating={firm.google_rating}
          googleReviewCount={firm.google_review_count}
          caseTrustAccredited={Boolean(firm.casetrust_accredited)}
        />

        <Link href={`/packages/${flatType}`} className="mt-4 inline-block text-sm font-medium text-[#1B4332]">
          View all packages from {firm.name} →
        </Link>
      </section>

      {firm.whatsapp_number ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 border-t border-gray-200 bg-white p-3 md:hidden">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-400">Enquire about</p>
            <p className="truncate text-base font-bold text-[#1B4332]">
              ${Number(pkg.price_nett || 0).toLocaleString()} · {pkg.flat_type}
            </p>
          </div>
          <WhatsAppButton
            phoneNumber={firm.whatsapp_number}
            packageName={`${displayFlatType} BTO Package`}
            firmName={firm.name}
            price={Number(pkg.price_nett || 0)}
            flatType={pkg.flat_type}
            customMessage={firm.whatsapp_message ?? undefined}
            showDisclaimer={false}
            className="px-3"
          />
        </div>
      ) : null}
    </div>
  );
}
