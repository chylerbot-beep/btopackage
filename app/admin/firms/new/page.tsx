'use client';

import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type FirmFormState = {
  name: string;
  slug: string;
  pricing_model: 'fixed_package' | 'hybrid' | 'custom_only' | 'price_anchor';
  hdb_license_number: string;
  hdb_license_verified: boolean;
  casetrust_accredited: boolean;
  bca_licensed: boolean;
  google_rating: string;
  google_review_count: string;
  years_established: string;
  projects_completed: string;
  owns_factory: boolean;
  in_house_team: boolean;
  whatsapp_number: string;
  website_url: string;
  address: string;
  known_for: string;
  is_complete: boolean;
  completeness_score: string;
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export default function NewFirmPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FirmFormState>({
    name: '',
    slug: '',
    pricing_model: 'fixed_package',
    hdb_license_number: '',
    hdb_license_verified: false,
    casetrust_accredited: false,
    bca_licensed: false,
    google_rating: '',
    google_review_count: '',
    years_established: '',
    projects_completed: '',
    owns_factory: false,
    in_house_team: false,
    whatsapp_number: '',
    website_url: '',
    address: '',
    known_for: '',
    is_complete: false,
    completeness_score: '',
  });

  const generatedSlug = useMemo(() => toSlug(form.name), [form.name]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!(form.slug || generatedSlug).trim()) {
      nextErrors.slug = 'Slug is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const response = await fetch('/api/admin/firms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        slug: form.slug || generatedSlug,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
      fieldErrors?: Record<string, string>;
    };

    if (!response.ok) {
      setErrors(payload.fieldErrors ?? { form: payload.error ?? 'Unable to create firm.' });
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/firms');
    router.refresh();
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Firm</h1>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <Field label="Name" error={errors.name}>
          <input
            required
            value={form.name}
            onChange={(event) => {
              const name = event.target.value;
              setForm((current) => ({ ...current, name, slug: current.slug ? current.slug : toSlug(name) }));
            }}
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
        </Field>

        <Field label="Slug" error={errors.slug}>
          <input
            required
            value={form.slug}
            onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
        </Field>

        <Field label="Pricing model">
          <select
            value={form.pricing_model}
            onChange={(event) =>
              setForm((current) => ({ ...current, pricing_model: event.target.value as FirmFormState['pricing_model'] }))
            }
            className="w-full rounded border border-slate-300 px-3 py-2"
          >
            <option value="fixed_package">fixed_package</option>
            <option value="hybrid">hybrid</option>
            <option value="custom_only">custom_only</option>
            <option value="price_anchor">price_anchor</option>
          </select>
        </Field>

        <TextInput label="HDB license number" value={form.hdb_license_number} onChange={(value) => setForm((current) => ({ ...current, hdb_license_number: value }))} />
        <Checkbox label="HDB license verified" checked={form.hdb_license_verified} onChange={(checked) => setForm((current) => ({ ...current, hdb_license_verified: checked }))} />
        <Checkbox label="CaseTrust accredited" checked={form.casetrust_accredited} onChange={(checked) => setForm((current) => ({ ...current, casetrust_accredited: checked }))} />
        <Checkbox label="BCA licensed" checked={form.bca_licensed} onChange={(checked) => setForm((current) => ({ ...current, bca_licensed: checked }))} />

        <NumberInput label="Google rating" value={form.google_rating} min={0} max={5} step={0.1} onChange={(value) => setForm((current) => ({ ...current, google_rating: value }))} />
        <NumberInput label="Google review count" value={form.google_review_count} onChange={(value) => setForm((current) => ({ ...current, google_review_count: value }))} />
        <NumberInput label="Years established" value={form.years_established} onChange={(value) => setForm((current) => ({ ...current, years_established: value }))} />
        <NumberInput label="Projects completed" value={form.projects_completed} onChange={(value) => setForm((current) => ({ ...current, projects_completed: value }))} />

        <Checkbox label="Owns factory" checked={form.owns_factory} onChange={(checked) => setForm((current) => ({ ...current, owns_factory: checked }))} />
        <Checkbox label="In-house team" checked={form.in_house_team} onChange={(checked) => setForm((current) => ({ ...current, in_house_team: checked }))} />

        <TextInput label="WhatsApp number" value={form.whatsapp_number} onChange={(value) => setForm((current) => ({ ...current, whatsapp_number: value }))} />
        <TextInput label="Website URL" value={form.website_url} onChange={(value) => setForm((current) => ({ ...current, website_url: value }))} />
        <TextInput label="Address" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />

        <Field label="Known for">
          <textarea
            value={form.known_for}
            onChange={(event) => setForm((current) => ({ ...current, known_for: event.target.value }))}
            className="min-h-24 w-full rounded border border-slate-300 px-3 py-2"
          />
        </Field>

        <Checkbox label="Is complete" checked={form.is_complete} onChange={(checked) => setForm((current) => ({ ...current, is_complete: checked }))} />
        <NumberInput label="Completeness score" value={form.completeness_score} min={0} max={100} onChange={(value) => setForm((current) => ({ ...current, completeness_score: value }))} />

        {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Create Firm'}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1 text-sm text-slate-700">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded border border-slate-300 px-3 py-2" />
    </Field>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-slate-300 px-3 py-2"
      />
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
