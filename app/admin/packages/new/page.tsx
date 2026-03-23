'use client';

import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type FirmOption = { id: string; name: string };

type PackageForm = {
  firm_id: string;
  slug: string;
  flat_type: '3-room' | '4-room' | '5-room';
  price_nett: string;
  kitchen_top_cabinet_ft: string;
  kitchen_bottom_cabinet_ft: string;
  countertop_material: string;
  countertop_length_ft: string;
  countertop_backsplash: boolean;
  master_wardrobe_ft: string;
  master_wardrobe_type: string;
  master_wardrobe_full_height: boolean;
  common_wardrobe_room2_ft: string;
  common_wardrobe_room2_type: string;
  common_wardrobe_room2_full_height: boolean;
  common_wardrobe_room3_ft: string;
  common_wardrobe_room3_type: string;
  common_wardrobe_room3_full_height: boolean;
  board_grade: 'E0' | 'E1' | 'E2' | 'super_e0' | 'mix';
  flooring_type: string;
  flooring_rooms_covered: string;
  screeding_included: boolean;
  shower_screens_included: boolean;
  shower_screen_count: string;
  electrical_included: boolean;
  plumbing_included: boolean;
  false_ceiling_included: boolean;
  false_ceiling_areas: string;
  doors_included: boolean;
  door_count: string;
  door_type: string;
  cleaning_and_haulage_included: boolean;
  paint_brand: string;
  paint_colours: string;
  paint_coverage: string;
  render_3d: boolean;
  render_revisions: string;
  warranty_months: string;
  freebies: string;
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
  verified_by: 'staff' | 'self-reported';
  verification_expiry_date: string;
  status: 'active' | 'greyed_out';
};

const defaultForm: PackageForm = {
  firm_id: '',
  slug: '',
  flat_type: '4-room',
  price_nett: '',
  kitchen_top_cabinet_ft: '',
  kitchen_bottom_cabinet_ft: '',
  countertop_material: '',
  countertop_length_ft: '',
  countertop_backsplash: false,
  master_wardrobe_ft: '',
  master_wardrobe_type: '',
  master_wardrobe_full_height: false,
  common_wardrobe_room2_ft: '',
  common_wardrobe_room2_type: '',
  common_wardrobe_room2_full_height: false,
  common_wardrobe_room3_ft: '',
  common_wardrobe_room3_type: '',
  common_wardrobe_room3_full_height: false,
  board_grade: 'E1',
  flooring_type: '',
  flooring_rooms_covered: '',
  screeding_included: false,
  shower_screens_included: false,
  shower_screen_count: '',
  electrical_included: false,
  plumbing_included: false,
  false_ceiling_included: false,
  false_ceiling_areas: '',
  doors_included: false,
  door_count: '',
  door_type: '',
  cleaning_and_haulage_included: false,
  paint_brand: '',
  paint_colours: '',
  paint_coverage: '',
  render_3d: false,
  render_revisions: '',
  warranty_months: '',
  freebies: '',
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
  verified_by: 'staff',
  verification_expiry_date: '',
  status: 'active',
};

export default function NewPackagePage() {
  const router = useRouter();
  const [firms, setFirms] = useState<FirmOption[]>([]);
  const [form, setForm] = useState<PackageForm>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!form.firm_id) nextErrors.firm_id = 'Firm is required.';
    if (!form.slug.trim()) nextErrors.slug = 'Slug is required.';
    if (!form.flat_type) nextErrors.flat_type = 'Flat type is required.';
    if (!form.price_nett.trim()) nextErrors.price_nett = 'Price is required.';

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

    if (!hasExclusion && !form.not_included_notes.trim()) {
      nextErrors.not_included_notes = 'Select at least one exclusion or provide notes.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const response = await fetch('/api/admin/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      fieldErrors?: Record<string, string>;
    };

    if (!response.ok) {
      setErrors(payload.fieldErrors ?? { form: payload.error ?? 'Unable to create package.' });
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/packages');
    router.refresh();
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Package</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <Field label="Firm" error={errors.firm_id}>
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

        <TextInput label="Slug" value={form.slug} error={errors.slug} onChange={(value) => setForm((current) => ({ ...current, slug: value }))} />
        <SelectInput label="Flat type" value={form.flat_type} onChange={(value) => setForm((current) => ({ ...current, flat_type: value as PackageForm['flat_type'] }))} options={['3-room', '4-room', '5-room']} />
        <NumberInput label="Price nett" value={form.price_nett} error={errors.price_nett} onChange={(value) => setForm((current) => ({ ...current, price_nett: value }))} />

        <NumberInput label="Kitchen top cabinet (ft)" value={form.kitchen_top_cabinet_ft} onChange={(value) => setForm((current) => ({ ...current, kitchen_top_cabinet_ft: value }))} />
        <NumberInput label="Kitchen bottom cabinet (ft)" value={form.kitchen_bottom_cabinet_ft} onChange={(value) => setForm((current) => ({ ...current, kitchen_bottom_cabinet_ft: value }))} />
        <TextInput label="Countertop material" value={form.countertop_material} onChange={(value) => setForm((current) => ({ ...current, countertop_material: value }))} />
        <NumberInput label="Countertop length (ft)" value={form.countertop_length_ft} onChange={(value) => setForm((current) => ({ ...current, countertop_length_ft: value }))} />
        <Checkbox label="Countertop backsplash" checked={form.countertop_backsplash} onChange={(checked) => setForm((current) => ({ ...current, countertop_backsplash: checked }))} />

        <NumberInput label="Master wardrobe (ft)" value={form.master_wardrobe_ft} onChange={(value) => setForm((current) => ({ ...current, master_wardrobe_ft: value }))} />
        <TextInput label="Master wardrobe type" value={form.master_wardrobe_type} onChange={(value) => setForm((current) => ({ ...current, master_wardrobe_type: value }))} />
        <Checkbox label="Master wardrobe full height" checked={form.master_wardrobe_full_height} onChange={(checked) => setForm((current) => ({ ...current, master_wardrobe_full_height: checked }))} />

        <NumberInput label="Common wardrobe room2 (ft)" value={form.common_wardrobe_room2_ft} onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room2_ft: value }))} />
        <TextInput label="Common wardrobe room2 type" value={form.common_wardrobe_room2_type} onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room2_type: value }))} />
        <Checkbox label="Common wardrobe room2 full height" checked={form.common_wardrobe_room2_full_height} onChange={(checked) => setForm((current) => ({ ...current, common_wardrobe_room2_full_height: checked }))} />

        <NumberInput label="Common wardrobe room3 (ft)" value={form.common_wardrobe_room3_ft} onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room3_ft: value }))} />
        <TextInput label="Common wardrobe room3 type" value={form.common_wardrobe_room3_type} onChange={(value) => setForm((current) => ({ ...current, common_wardrobe_room3_type: value }))} />
        <Checkbox label="Common wardrobe room3 full height" checked={form.common_wardrobe_room3_full_height} onChange={(checked) => setForm((current) => ({ ...current, common_wardrobe_room3_full_height: checked }))} />

        <SelectInput label="Board grade" value={form.board_grade} onChange={(value) => setForm((current) => ({ ...current, board_grade: value as PackageForm['board_grade'] }))} options={['E0', 'E1', 'E2', 'super_e0', 'mix']} />
        <TextInput label="Flooring type" value={form.flooring_type} onChange={(value) => setForm((current) => ({ ...current, flooring_type: value }))} />
        <TextInput label="Flooring rooms covered" value={form.flooring_rooms_covered} onChange={(value) => setForm((current) => ({ ...current, flooring_rooms_covered: value }))} />
        <Checkbox label="Screeding included" checked={form.screeding_included} onChange={(checked) => setForm((current) => ({ ...current, screeding_included: checked }))} />

        <Checkbox label="Shower screens included" checked={form.shower_screens_included} onChange={(checked) => setForm((current) => ({ ...current, shower_screens_included: checked }))} />
        <NumberInput label="Shower screen count" value={form.shower_screen_count} onChange={(value) => setForm((current) => ({ ...current, shower_screen_count: value }))} />
        <Checkbox label="Electrical included" checked={form.electrical_included} onChange={(checked) => setForm((current) => ({ ...current, electrical_included: checked }))} />
        <Checkbox label="Plumbing included" checked={form.plumbing_included} onChange={(checked) => setForm((current) => ({ ...current, plumbing_included: checked }))} />
        <Checkbox label="False ceiling included" checked={form.false_ceiling_included} onChange={(checked) => setForm((current) => ({ ...current, false_ceiling_included: checked }))} />
        <TextInput label="False ceiling areas" value={form.false_ceiling_areas} onChange={(value) => setForm((current) => ({ ...current, false_ceiling_areas: value }))} />

        <Checkbox label="Doors included" checked={form.doors_included} onChange={(checked) => setForm((current) => ({ ...current, doors_included: checked }))} />
        <NumberInput label="Door count" value={form.door_count} onChange={(value) => setForm((current) => ({ ...current, door_count: value }))} />
        <TextInput label="Door type" value={form.door_type} onChange={(value) => setForm((current) => ({ ...current, door_type: value }))} />
        <Checkbox label="Cleaning and haulage included" checked={form.cleaning_and_haulage_included} onChange={(checked) => setForm((current) => ({ ...current, cleaning_and_haulage_included: checked }))} />

        <TextInput label="Paint brand" value={form.paint_brand} onChange={(value) => setForm((current) => ({ ...current, paint_brand: value }))} />
        <NumberInput label="Paint colours" value={form.paint_colours} onChange={(value) => setForm((current) => ({ ...current, paint_colours: value }))} />
        <TextInput label="Paint coverage" value={form.paint_coverage} onChange={(value) => setForm((current) => ({ ...current, paint_coverage: value }))} />
        <Checkbox label="3D render" checked={form.render_3d} onChange={(checked) => setForm((current) => ({ ...current, render_3d: checked }))} />
        <NumberInput label="Render revisions" value={form.render_revisions} onChange={(value) => setForm((current) => ({ ...current, render_revisions: value }))} />
        <NumberInput label="Warranty months" value={form.warranty_months} onChange={(value) => setForm((current) => ({ ...current, warranty_months: value }))} />

        <Field label="Freebies">
          <textarea
            value={form.freebies}
            onChange={(event) => setForm((current) => ({ ...current, freebies: event.target.value }))}
            className="min-h-24 w-full rounded border border-slate-300 px-3 py-2"
          />
        </Field>

        <h2 className="pt-2 text-lg font-medium">Not included</h2>
        <Checkbox label="Exclude kitchen top cabinet" checked={form.excl_kitchen_top_cabinet} onChange={(checked) => setForm((current) => ({ ...current, excl_kitchen_top_cabinet: checked }))} />
        <Checkbox label="Exclude kitchen bottom cabinet" checked={form.excl_kitchen_bottom_cabinet} onChange={(checked) => setForm((current) => ({ ...current, excl_kitchen_bottom_cabinet: checked }))} />
        <Checkbox label="Exclude master wardrobe" checked={form.excl_master_wardrobe} onChange={(checked) => setForm((current) => ({ ...current, excl_master_wardrobe: checked }))} />
        <Checkbox label="Exclude common wardrobe room2" checked={form.excl_common_wardrobe_room2} onChange={(checked) => setForm((current) => ({ ...current, excl_common_wardrobe_room2: checked }))} />
        <Checkbox label="Exclude common wardrobe room3" checked={form.excl_common_wardrobe_room3} onChange={(checked) => setForm((current) => ({ ...current, excl_common_wardrobe_room3: checked }))} />
        <Checkbox label="Exclude electrical wiring" checked={form.excl_electrical_wiring} onChange={(checked) => setForm((current) => ({ ...current, excl_electrical_wiring: checked }))} />
        <Checkbox label="Exclude plumbing" checked={form.excl_plumbing} onChange={(checked) => setForm((current) => ({ ...current, excl_plumbing: checked }))} />
        <Checkbox label="Exclude deep cleaning" checked={form.excl_deep_cleaning} onChange={(checked) => setForm((current) => ({ ...current, excl_deep_cleaning: checked }))} />
        <Checkbox label="Exclude HDB permit fee" checked={form.excl_hdb_permit_fee} onChange={(checked) => setForm((current) => ({ ...current, excl_hdb_permit_fee: checked }))} />
        <Checkbox label="Exclude flooring bedrooms" checked={form.excl_flooring_bedrooms} onChange={(checked) => setForm((current) => ({ ...current, excl_flooring_bedrooms: checked }))} />

        <Field label="Not included notes" error={errors.not_included_notes}>
          <textarea
            value={form.not_included_notes}
            onChange={(event) => setForm((current) => ({ ...current, not_included_notes: event.target.value }))}
            className="min-h-24 w-full rounded border border-slate-300 px-3 py-2"
          />
        </Field>

        <SelectInput label="Verified by" value={form.verified_by} onChange={(value) => setForm((current) => ({ ...current, verified_by: value as PackageForm['verified_by'] }))} options={['staff', 'self-reported']} />
        <Field label="Verification expiry date">
          <input
            type="date"
            value={form.verification_expiry_date}
            onChange={(event) => setForm((current) => ({ ...current, verification_expiry_date: event.target.value }))}
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
        </Field>
        <SelectInput label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value as PackageForm['status'] }))} options={['active', 'greyed_out']} />

        {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Create Package'}
        </button>
      </form>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1 text-sm text-slate-700">
      <span>{label}</span>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2" />
    </Field>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <Field label={label} error={error}>
      <input
        type="number"
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
