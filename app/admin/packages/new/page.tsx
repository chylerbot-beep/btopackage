'use client';

import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeAndValidateImageUrl } from '@/lib/image-url';

type FirmOption = { id: string; name: string };

type HeightSelection = 'true' | 'false' | 'null';

type PackageForm = {
  firm_id: string;
  flat_type: '3-room' | '4-room' | '5-room';
  package_type: 'bto' | 'resale' | 'partial';
  slug: string;
  price_nett: string;
  promotion_text: string;
  promotion_expiry: string;
  freebies_1: string;
  freebies_2: string;
  freebies_3: string;
  freebies_4: string;
  freebies_5: string;
  summary: string;
  description_carpentry: string;
  description_finishes: string;
  description_works: string;
  description_service: string;
  kitchen_top_cabinet_ft: string;
  kitchen_bottom_cabinet_ft: string;
  master_wardrobe_ft: string;
  master_wardrobe_type: '' | 'casement' | 'sliding';
  master_wardrobe_full_height: HeightSelection;
  common_wardrobe_room2_ft: string;
  common_wardrobe_room2_type: '' | 'casement' | 'sliding';
  common_wardrobe_room2_full_height: HeightSelection;
  common_wardrobe_room3_ft: string;
  common_wardrobe_room3_type: '' | 'casement' | 'sliding';
  common_wardrobe_room3_full_height: HeightSelection;
  board_grade: '' | 'E0' | 'E1' | 'E2' | 'super_e0' | 'mix';
  flooring_type: '' | 'homogeneous tiles' | 'vinyl LVT' | 'parquet' | 'vinyl';
  flooring_rooms_covered: '' | 'whole house' | '3 bedroom + living room' | 'bedrooms only' | 'living only';
  vinyl_thickness_mm: string;
  screeding_included: boolean;
  countertop_material: '' | 'quartz' | 'sintered' | 'kompacplus';
  countertop_length_ft: string;
  countertop_backsplash: boolean;
  shower_screens_included: boolean;
  shower_screen_count: string;
  electrical_included: boolean;
  plumbing_included: boolean;
  false_ceiling_included: boolean;
  false_ceiling_areas: string;
  doors_included: boolean;
  door_count: string;
  door_type: '' | 'laminated' | 'solid timber';
  paint_brand: string;
  paint_colours: string;
  paint_coverage: '' | 'whole house' | 'bedrooms only';
  cleaning_and_haulage_included: boolean;
  render_3d: boolean;
  render_revisions: string;
  warranty_months: string;
  excl_kitchen_top_cabinet: boolean;
  excl_kitchen_bottom_cabinet: boolean;
  excl_master_wardrobe: boolean;
  excl_common_wardrobe_room2: boolean;
  excl_common_wardrobe_room3: boolean;
  excl_electrical_wiring: boolean;
  excl_plumbing: boolean;
  excl_deep_cleaning: boolean;
  excl_hdb_permit_fee: boolean;
  excl_flooring_bedrooms: boolean;
  not_included_notes: string;
  image_url: string;
  verified_by: 'staff' | 'self-reported';
  status: 'active' | 'greyed_out';
  featured: boolean;
  featured_position: string;
};

const defaultForm: PackageForm = {
  firm_id: '',
  flat_type: '4-room',
  package_type: 'bto',
  slug: '',
  price_nett: '',
  promotion_text: '',
  promotion_expiry: '',
  freebies_1: '',
  freebies_2: '',
  freebies_3: '',
  freebies_4: '',
  freebies_5: '',
  summary: '',
  description_carpentry: '',
  description_finishes: '',
  description_works: '',
  description_service: '',
  kitchen_top_cabinet_ft: '',
  kitchen_bottom_cabinet_ft: '',
  master_wardrobe_ft: '',
  master_wardrobe_type: '',
  master_wardrobe_full_height: 'null',
  common_wardrobe_room2_ft: '',
  common_wardrobe_room2_type: '',
  common_wardrobe_room2_full_height: 'null',
  common_wardrobe_room3_ft: '',
  common_wardrobe_room3_type: '',
  common_wardrobe_room3_full_height: 'null',
  board_grade: '',
  flooring_type: '',
  flooring_rooms_covered: '',
  vinyl_thickness_mm: '',
  screeding_included: false,
  countertop_material: '',
  countertop_length_ft: '',
  countertop_backsplash: false,
  shower_screens_included: false,
  shower_screen_count: '',
  electrical_included: false,
  plumbing_included: false,
  false_ceiling_included: false,
  false_ceiling_areas: '',
  doors_included: false,
  door_count: '',
  door_type: '',
  paint_brand: '',
  paint_colours: '',
  paint_coverage: '',
  cleaning_and_haulage_included: false,
  render_3d: false,
  render_revisions: '',
  warranty_months: '',
  excl_kitchen_top_cabinet: false,
  excl_kitchen_bottom_cabinet: false,
  excl_master_wardrobe: false,
  excl_common_wardrobe_room2: false,
  excl_common_wardrobe_room3: false,
  excl_electrical_wiring: false,
  excl_plumbing: false,
  excl_deep_cleaning: false,
  excl_hdb_permit_fee: false,
  excl_flooring_bedrooms: false,
  not_included_notes: '',
  image_url: '',
  verified_by: 'staff',
  status: 'active',
  featured: false,
  featured_position: '',
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toHeightValue(value: HeightSelection): boolean | null {
  if (value === 'null') return null;
  return value === 'true';
}

export default function NewPackagePage() {
  const router = useRouter();
  const [firms, setFirms] = useState<FirmOption[]>([]);
  const [form, setForm] = useState<PackageForm>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  const selectedFirmName = useMemo(() => firms.find((firm) => firm.id === form.firm_id)?.name ?? '', [firms, form.firm_id]);

  useEffect(() => {
    let mounted = true;

    const loadFirms = async () => {
      const response = await fetch('/api/admin/firms');
      const payload = (await response.json().catch(() => ({}))) as { firms?: FirmOption[]; error?: string };

      if (!response.ok) {
        if (mounted) {
          setErrors({ form: payload.error ?? 'Unable to load firms.' });
        }
        return;
      }

      if (mounted) {
        setFirms(payload.firms ?? []);
        setForm((current) => ({ ...current, firm_id: current.firm_id || payload.firms?.[0]?.id || '' }));
      }
    };

    loadFirms();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (slugTouched) return;
    const autoSlug = createSlug([selectedFirmName, form.flat_type].filter(Boolean).join(' '));
    setForm((current) => ({ ...current, slug: autoSlug }));
  }, [selectedFirmName, form.flat_type, slugTouched]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!form.firm_id) nextErrors.firm_id = 'Firm is required.';
    if (!form.slug.trim()) nextErrors.slug = 'Slug is required.';
    if (!form.flat_type) nextErrors.flat_type = 'Flat type is required.';
    if (!form.price_nett.trim()) nextErrors.price_nett = 'Price is required.';

    const imageValidation = normalizeAndValidateImageUrl(form.image_url);
    if (imageValidation.error) nextErrors.image_url = imageValidation.error;

    const hasExclusion =
      form.excl_kitchen_top_cabinet ||
      form.excl_kitchen_bottom_cabinet ||
      form.excl_master_wardrobe ||
      form.excl_common_wardrobe_room2 ||
      form.excl_common_wardrobe_room3 ||
      form.excl_electrical_wiring ||
      form.excl_plumbing ||
      form.excl_deep_cleaning ||
      form.excl_hdb_permit_fee ||
      form.excl_flooring_bedrooms;

    if (!hasExclusion) {
      nextErrors.not_included_notes = 'Tick at least one exclusion.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const payload = {
      ...form,
      freebies: [form.freebies_1, form.freebies_2, form.freebies_3, form.freebies_4, form.freebies_5]
        .map((item) => item.trim())
        .filter(Boolean)
        .join(' · '),
      image_url: imageValidation.normalizedUrl ?? '',
      master_wardrobe_full_height: toHeightValue(form.master_wardrobe_full_height),
      common_wardrobe_room2_full_height: toHeightValue(form.common_wardrobe_room2_full_height),
      common_wardrobe_room3_full_height: toHeightValue(form.common_wardrobe_room3_full_height),
    };

    const response = await fetch('/api/admin/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responsePayload = (await response.json().catch(() => ({}))) as {
      error?: string;
      fieldErrors?: Record<string, string>;
    };

    if (!response.ok) {
      setErrors(responsePayload.fieldErrors ?? { form: responsePayload.error ?? 'Unable to create package.' });
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/packages');
    router.refresh();
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Package</h1>

      <form onSubmit={onSubmit} className="space-y-1">
        <Section title="SECTION A — BASICS">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Firm" error={errors.firm_id} required>
              <select
                value={form.firm_id}
                onChange={(event) => setForm((current) => ({ ...current, firm_id: event.target.value }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
              >
                <option value="">Select firm</option>
                {firms.map((firm) => (
                  <option key={firm.id} value={firm.id}>
                    {firm.name}
                  </option>
                ))}
              </select>
            </Field>

            <SelectInput
              label="Flat type"
              value={form.flat_type}
              required
              onChange={(value) => setForm((current) => ({ ...current, flat_type: value as PackageForm['flat_type'] }))}
              options={['3-room', '4-room', '5-room']}
            />
            <SelectInput
              label="Package type"
              value={form.package_type}
              onChange={(value) => setForm((current) => ({ ...current, package_type: value as PackageForm['package_type'] }))}
              options={['bto', 'resale', 'partial']}
            />
            <TextInput
              label="Slug"
              value={form.slug}
              required
              error={errors.slug}
              onChange={(value) => {
                setSlugTouched(true);
                setForm((current) => ({ ...current, slug: value }));
              }}
            />
            <NumberInput
              label="Price (SGD)"
              value={form.price_nett}
              required
              error={errors.price_nett}
              onChange={(value) => setForm((current) => ({ ...current, price_nett: value }))}
            />
            <TextInput label="Promotion text" value={form.promotion_text} onChange={(value) => setForm((current) => ({ ...current, promotion_text: value }))} />
            <DateInput label="Promotion expiry" value={form.promotion_expiry} onChange={(value) => setForm((current) => ({ ...current, promotion_expiry: value }))} />
            <div className="space-y-2 md:col-span-2">
              <p className="text-sm text-slate-700">Freebies</p>
              <div className="grid gap-3 md:grid-cols-2">
                <input value={form.freebies_1} onChange={(event) => setForm((current) => ({ ...current, freebies_1: event.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Freebie 1" />
                <input value={form.freebies_2} onChange={(event) => setForm((current) => ({ ...current, freebies_2: event.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Freebie 2" />
                <input value={form.freebies_3} onChange={(event) => setForm((current) => ({ ...current, freebies_3: event.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Freebie 3" />
                <input value={form.freebies_4} onChange={(event) => setForm((current) => ({ ...current, freebies_4: event.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Freebie 4" />
                <input value={form.freebies_5} onChange={(event) => setForm((current) => ({ ...current, freebies_5: event.target.value }))} className="w-full rounded border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Freebie 5" />
              </div>
            </div>
          </div>
        </Section>

        <Section title="SECTION A2 — DESCRIPTIONS (SEO)">
          <div className="grid gap-4">
            <Field label="Package summary" className="md:col-span-2">
              <textarea
                value={form.summary}
                onChange={(e) => setForm((c) => ({ ...c, summary: e.target.value }))}
                className="min-h-[80px] w-full rounded border border-slate-300 px-3 py-2"
                placeholder="2–3 sentence overview. This is the primary text shown to search engines and AI."
              />
            </Field>
            <Field label="Carpentry description" className="md:col-span-2">
              <textarea
                value={form.description_carpentry}
                onChange={(e) => setForm((c) => ({ ...c, description_carpentry: e.target.value }))}
                className="min-h-[80px] w-full rounded border border-slate-300 px-3 py-2"
                placeholder="Describe the carpentry scope — footage, materials, highlights."
              />
            </Field>
            <Field label="Finishes description" className="md:col-span-2">
              <textarea
                value={form.description_finishes}
                onChange={(e) => setForm((c) => ({ ...c, description_finishes: e.target.value }))}
                className="min-h-[80px] w-full rounded border border-slate-300 px-3 py-2"
                placeholder="Describe flooring, countertop, backsplash, shower screens."
              />
            </Field>
            <Field label="Works description" className="md:col-span-2">
              <textarea
                value={form.description_works}
                onChange={(e) => setForm((c) => ({ ...c, description_works: e.target.value }))}
                className="min-h-[80px] w-full rounded border border-slate-300 px-3 py-2"
                placeholder="Describe electrical, plumbing, false ceiling, doors, paint, cleaning."
              />
            </Field>
            <Field label="Service & support description" className="md:col-span-2">
              <textarea
                value={form.description_service}
                onChange={(e) => setForm((c) => ({ ...c, description_service: e.target.value }))}
                className="min-h-[80px] w-full rounded border border-slate-300 px-3 py-2"
                placeholder="Describe 3D render, warranty, after-sales support."
              />
            </Field>
          </div>
        </Section>

        <Section title="SECTION B — CARPENTRY">
          <div className="grid gap-4 md:grid-cols-2">
            <NumberInput label="Kitchen top cabinets (ft)" value={form.kitchen_top_cabinet_ft} onChange={(value) => setForm((current) => ({ ...current, kitchen_top_cabinet_ft: value }))} />
            <NumberInput label="Kitchen bottom cabinets (ft)" value={form.kitchen_bottom_cabinet_ft} onChange={(value) => setForm((current) => ({ ...current, kitchen_bottom_cabinet_ft: value }))} />
            <NumberInput label="Master wardrobe footage (ft)" value={form.master_wardrobe_ft} onChange={(value) => setForm((current) => ({ ...current, master_wardrobe_ft: value }))} />
            <SelectInput label="Master wardrobe type" value={form.master_wardrobe_type} onChange={(value) => setForm((current) => ({ ...current, master_wardrobe_type: value as PackageForm['master_wardrobe_type'] }))} options={['', 'casement', 'sliding']} placeholder="Select type" />
            <SelectInput
              label="Master wardrobe height"
              value={form.master_wardrobe_full_height}
              onChange={(value) => setForm((current) => ({ ...current, master_wardrobe_full_height: value as HeightSelection }))}
              options={['null', 'true', 'false']}
              optionLabels={{ null: 'Not specified', true: 'Full height', false: 'Partial height' }}
            />
            <NumberInput label="Common bedroom 2 wardrobe (ft)" value={form.common_wardrobe_room2_ft} onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room2_ft: value }))} />
            <SelectInput label="Common bedroom 2 wardrobe type" value={form.common_wardrobe_room2_type} onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room2_type: value as PackageForm['common_wardrobe_room2_type'] }))} options={['', 'casement', 'sliding']} placeholder="Select type" />
            <SelectInput
              label="Common bedroom 2 wardrobe height"
              value={form.common_wardrobe_room2_full_height}
              onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room2_full_height: value as HeightSelection }))}
              options={['null', 'true', 'false']}
              optionLabels={{ null: 'Not specified', true: 'Full height', false: 'Partial height' }}
            />
            <NumberInput label="Common bedroom 3 wardrobe (ft)" value={form.common_wardrobe_room3_ft} onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room3_ft: value }))} />
            <SelectInput label="Common bedroom 3 wardrobe type" value={form.common_wardrobe_room3_type} onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room3_type: value as PackageForm['common_wardrobe_room3_type'] }))} options={['', 'casement', 'sliding']} placeholder="Select type" />
            <SelectInput
              label="Common bedroom 3 wardrobe height"
              value={form.common_wardrobe_room3_full_height}
              onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room3_full_height: value as HeightSelection }))}
              options={['null', 'true', 'false']}
              optionLabels={{ null: 'Not specified', true: 'Full height', false: 'Partial height' }}
            />
            <SelectInput label="Board grade" value={form.board_grade} onChange={(value) => setForm((current) => ({ ...current, board_grade: value as PackageForm['board_grade'] }))} options={['', 'E0', 'E1', 'E2', 'super_e0', 'mix']} placeholder="Select board grade" />
          </div>
        </Section>

        <Section title="SECTION C — FINISHES">
          <div className="grid gap-4 md:grid-cols-2">
            <SelectInput label="Flooring type" value={form.flooring_type} onChange={(value) => setForm((current) => ({ ...current, flooring_type: value as PackageForm['flooring_type'] }))} options={['', 'homogeneous tiles', 'vinyl LVT', 'parquet', 'vinyl']} placeholder="Select flooring type" />
            <SelectInput label="Flooring rooms covered" value={form.flooring_rooms_covered} onChange={(value) => setForm((current) => ({ ...current, flooring_rooms_covered: value as PackageForm['flooring_rooms_covered'] }))} options={['', 'whole house', '3 bedroom + living room', 'bedrooms only', 'living only']} placeholder="Select coverage" />
            <NumberInput label="Vinyl thickness (mm)" value={form.vinyl_thickness_mm} step="0.1" onChange={(value) => setForm((current) => ({ ...current, vinyl_thickness_mm: value }))} />
            <Checkbox label="Cement screeding included?" checked={form.screeding_included} onChange={(checked) => setForm((current) => ({ ...current, screeding_included: checked }))} />
            <SelectInput label="Countertop material" value={form.countertop_material} onChange={(value) => setForm((current) => ({ ...current, countertop_material: value as PackageForm['countertop_material'] }))} options={['', 'quartz', 'sintered', 'kompacplus']} placeholder="Select material" />
            <NumberInput label="Countertop length (ft)" value={form.countertop_length_ft} onChange={(value) => setForm((current) => ({ ...current, countertop_length_ft: value }))} />
            <Checkbox label="Countertop backsplash included?" checked={form.countertop_backsplash} onChange={(checked) => setForm((current) => ({ ...current, countertop_backsplash: checked }))} />
            <Checkbox label="Shower screens included" checked={form.shower_screens_included} onChange={(checked) => setForm((current) => ({ ...current, shower_screens_included: checked }))} />
            <NumberInput label="Shower screen count" value={form.shower_screen_count} onChange={(value) => setForm((current) => ({ ...current, shower_screen_count: value }))} />
          </div>
        </Section>

        <Section title="SECTION D — WORKS">
          <div className="grid gap-4 md:grid-cols-2">
            <Checkbox label="Electrical work included?" checked={form.electrical_included} onChange={(checked) => setForm((current) => ({ ...current, electrical_included: checked }))} />
            <Checkbox label="Plumbing works included?" checked={form.plumbing_included} onChange={(checked) => setForm((current) => ({ ...current, plumbing_included: checked }))} />
            <Checkbox label="False ceiling included" checked={form.false_ceiling_included} onChange={(checked) => setForm((current) => ({ ...current, false_ceiling_included: checked }))} />
            <TextInput label="False ceiling areas e.g. Living & dining" value={form.false_ceiling_areas} onChange={(value) => setForm((current) => ({ ...current, false_ceiling_areas: value }))} />
            <Checkbox label="Bedroom & toilet doors included?" checked={form.doors_included} onChange={(checked) => setForm((current) => ({ ...current, doors_included: checked }))} />
            <NumberInput label="Number of doors" value={form.door_count} onChange={(value) => setForm((current) => ({ ...current, door_count: value }))} />
            <SelectInput label="Door type" value={form.door_type} onChange={(value) => setForm((current) => ({ ...current, door_type: value as PackageForm['door_type'] }))} options={['', 'laminated', 'solid timber']} placeholder="Select door type" />
            <TextInput label="Paint brand" value={form.paint_brand} onChange={(value) => setForm((current) => ({ ...current, paint_brand: value }))} />
            <NumberInput label="Number of colours" value={form.paint_colours} onChange={(value) => setForm((current) => ({ ...current, paint_colours: value }))} />
            <SelectInput label="Paint coverage" value={form.paint_coverage} onChange={(value) => setForm((current) => ({ ...current, paint_coverage: value as PackageForm['paint_coverage'] }))} options={['', 'whole house', 'bedrooms only']} placeholder="Select coverage" />
            <Checkbox label="General cleaning & haulage included?" checked={form.cleaning_and_haulage_included} onChange={(checked) => setForm((current) => ({ ...current, cleaning_and_haulage_included: checked }))} />
          </div>
        </Section>

        <Section title="SECTION E — SERVICE & SUPPORT">
          <div className="grid gap-4 md:grid-cols-2">
            <Checkbox label="3D render included?" checked={form.render_3d} onChange={(checked) => setForm((current) => ({ ...current, render_3d: checked }))} />
            <NumberInput label="Number of render revisions" value={form.render_revisions} onChange={(value) => setForm((current) => ({ ...current, render_revisions: value }))} />
            <NumberInput label="Warranty period (months)" value={form.warranty_months} onChange={(value) => setForm((current) => ({ ...current, warranty_months: value }))} />
          </div>
        </Section>

        <Section title="SECTION F — NOT INCLUDED">
          <p className="mb-4 text-sm text-slate-600">Tick everything that is NOT included in this package. At least one is required.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Checkbox label="Kitchen top cabinets" checked={form.excl_kitchen_top_cabinet} onChange={(checked) => setForm((current) => ({ ...current, excl_kitchen_top_cabinet: checked }))} />
            <Checkbox label="Kitchen bottom cabinets" checked={form.excl_kitchen_bottom_cabinet} onChange={(checked) => setForm((current) => ({ ...current, excl_kitchen_bottom_cabinet: checked }))} />
            <Checkbox label="Master bedroom wardrobe" checked={form.excl_master_wardrobe} onChange={(checked) => setForm((current) => ({ ...current, excl_master_wardrobe: checked }))} />
            <Checkbox label="Common room 2 wardrobe" checked={form.excl_common_wardrobe_room2} onChange={(checked) => setForm((current) => ({ ...current, excl_common_wardrobe_room2: checked }))} />
            <Checkbox label="Common room 3 wardrobe" checked={form.excl_common_wardrobe_room3} onChange={(checked) => setForm((current) => ({ ...current, excl_common_wardrobe_room3: checked }))} />
            <Checkbox label="Electrical work" checked={form.excl_electrical_wiring} onChange={(checked) => setForm((current) => ({ ...current, excl_electrical_wiring: checked }))} />
            <Checkbox label="Plumbing works" checked={form.excl_plumbing} onChange={(checked) => setForm((current) => ({ ...current, excl_plumbing: checked }))} />
            <Checkbox label="Deep cleaning" checked={form.excl_deep_cleaning} onChange={(checked) => setForm((current) => ({ ...current, excl_deep_cleaning: checked }))} />
            <Checkbox label="HDB permit fee" checked={form.excl_hdb_permit_fee} onChange={(checked) => setForm((current) => ({ ...current, excl_hdb_permit_fee: checked }))} />
            <Checkbox label="Flooring (bedrooms)" checked={form.excl_flooring_bedrooms} onChange={(checked) => setForm((current) => ({ ...current, excl_flooring_bedrooms: checked }))} />
            <Field label="Additional notes on exclusions" error={errors.not_included_notes} className="md:col-span-2">
              <textarea
                value={form.not_included_notes}
                onChange={(event) => setForm((current) => ({ ...current, not_included_notes: event.target.value }))}
                className="min-h-24 w-full rounded border border-slate-300 px-3 py-2"
              />
            </Field>
          </div>
        </Section>

        <Section title="SECTION G — IMAGES">
          <TextInput
            label="Hero image URL"
            value={form.image_url}
            error={errors.image_url}
            onChange={(value) => setForm((current) => ({ ...current, image_url: value }))}
          />
        </Section>

        <Section title="SECTION H — VERIFICATION">
          <div className="grid gap-4 md:grid-cols-2">
            <SelectInput label="Verified by" value={form.verified_by} onChange={(value) => setForm((current) => ({ ...current, verified_by: value as PackageForm['verified_by'] }))} options={['staff', 'self-reported']} />
            <SelectInput label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value as PackageForm['status'] }))} options={['active', 'greyed_out']} />
          </div>
        </Section>

        <Section title="SECTION — HOMEPAGE PLACEMENT">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="featured" className="md:col-span-2">
              <div className="space-y-2">
                <Checkbox
                  label="Show on homepage"
                  checked={form.featured}
                  onChange={(checked) => setForm((current) => ({ ...current, featured: checked }))}
                />
                <p className="text-xs text-slate-500">Package will appear in the homepage featured section.</p>
              </div>
            </Field>
            <Field label="Position (1–5)">
              <div className="space-y-2">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.featured_position}
                  onChange={(event) => setForm((current) => ({ ...current, featured_position: event.target.value }))}
                  className="w-full rounded border border-slate-300 px-3 py-2"
                />
                <p className="text-xs text-slate-500">Controls order on homepage under its flat type. 1 = first card.</p>
              </div>
            </Field>
          </div>
        </Section>

        {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[44px] w-full rounded-xl bg-[#1B4332] px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Create Package'}
        </button>
      </form>
    </section>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="rounded-xl border border-[#E5E0D8] bg-white p-6">{children}</div>
    </div>
  );
}

function Field({ label, error, required, className, children }: { label: string; error?: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <label className={`block space-y-1 text-sm text-slate-700 ${className ?? ''}`}>
      <span>
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} error={error} required={required}>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2" />
    </Field>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2" />
    </Field>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  error,
  required,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <Field label={label} error={error} required={required}>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-slate-300 px-3 py-2"
      />
    </Field>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  optionLabels,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  optionLabels?: Record<string, string>;
  required?: boolean;
}) {
  return (
    <Field label={label} required={required}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options
          .filter((option) => !(placeholder && option === ''))
          .map((option) => (
            <option key={option || 'empty'} value={option}>
              {optionLabels?.[option] ?? option}
            </option>
          ))}
      </select>
    </Field>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-[42px] items-center gap-2 rounded border border-slate-200 px-3 text-sm text-slate-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
