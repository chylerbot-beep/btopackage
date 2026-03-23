'use client';

import Link from 'next/link';
import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type FirmFormState = {
  name: string;
  slug: string;
  hdb_license_number: string;
  hdb_license_verified: boolean;
  casetrust_accredited: boolean;
  google_rating: string;
  google_review_count: string;
  years_established: string;
  projects_completed: string;
  owns_factory: boolean;
  in_house_team: boolean;
  whatsapp_number: string;
  whatsapp_message: string;
  website_url: string;
  known_for: string;
  published: boolean;
  featured: boolean;
  featured_position: string;
  featured_until: string;
};

const defaultForm: FirmFormState = {
  name: '',
  slug: '',
  hdb_license_number: '',
  hdb_license_verified: false,
  casetrust_accredited: false,
  google_rating: '',
  google_review_count: '',
  years_established: '',
  projects_completed: '',
  owns_factory: false,
  in_house_team: false,
  whatsapp_number: '',
  whatsapp_message: '',
  website_url: '',
  known_for: '',
  published: false,
  featured: false,
  featured_position: '',
  featured_until: '',
};

const generateSlug = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function EditFirmPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEditedSlug, setHasEditedSlug] = useState(false);
  const [form, setForm] = useState<FirmFormState>(defaultForm);

  const generatedSlug = useMemo(() => generateSlug(form.name), [form.name]);

  useEffect(() => {
    let mounted = true;

    const loadFirm = async () => {
      const response = await fetch(`/api/admin/firms/${params.id}`);
      const payload = (await response.json().catch(() => ({}))) as { error?: string; firm?: Record<string, unknown> };

      if (!response.ok) {
        if (mounted) {
          setErrors({ form: payload.error ?? 'Unable to load firm.' });
          setIsLoading(false);
        }
        return;
      }

      const firm = payload.firm ?? {};

      if (mounted) {
        setForm({
          name: String(firm.name ?? ''),
          slug: String(firm.slug ?? ''),
          hdb_license_number: String(firm.hdb_license_number ?? ''),
          hdb_license_verified: Boolean(firm.hdb_license_verified),
          casetrust_accredited: Boolean(firm.casetrust_accredited),
          google_rating: firm.google_rating == null ? '' : String(firm.google_rating),
          google_review_count: firm.google_review_count == null ? '' : String(firm.google_review_count),
          years_established: firm.years_established == null ? '' : String(firm.years_established),
          projects_completed: firm.projects_completed == null ? '' : String(firm.projects_completed),
          owns_factory: Boolean(firm.owns_factory),
          in_house_team: Boolean(firm.in_house_team),
          whatsapp_number: String(firm.whatsapp_number ?? ''),
          whatsapp_message: String(firm.whatsapp_message ?? ''),
          website_url: String(firm.website_url ?? ''),
          known_for: String(firm.known_for ?? ''),
          published: Boolean(firm.is_complete),
          featured: Boolean(firm.is_featured),
          featured_position: firm.featured_position == null ? '' : String(firm.featured_position),
          featured_until: typeof firm.featured_until === 'string' ? firm.featured_until.split('T')[0] : '',
        });
        setIsLoading(false);
      }
    };

    loadFirm();

    return () => {
      mounted = false;
    };
  }, [params.id]);

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

    const response = await fetch(`/api/admin/firms/${params.id}`, {
      method: 'PATCH',
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
      setErrors(payload.fieldErrors ?? { form: payload.error ?? 'Unable to update firm.' });
      setIsSubmitting(false);
      return;
    }

    router.push('/admin/firms');
    router.refresh();
  };

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/admin/firms" className="text-sm text-[#6B7280]">
          ← Back to Firms
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">Edit Firm</h1>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading firm details...</p>
      ) : (
        <form onSubmit={onSubmit}>
          <SectionCard title="SECTION A — FIRM IDENTITY">
            <Field label="Name" error={errors.name}>
              <input
                required
                value={form.name}
                onChange={(event) => {
                  const name = event.target.value;
                  setForm((current) => ({
                    ...current,
                    name,
                    slug: hasEditedSlug ? current.slug : generateSlug(name),
                  }));
                }}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </Field>

            <Field label="Slug" error={errors.slug}>
              <input
                required
                value={form.slug}
                onChange={(event) => {
                  setHasEditedSlug(true);
                  setForm((current) => ({ ...current, slug: event.target.value }));
                }}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </Field>

            <Field
              label="Known for"
              helper="One line shown on every package card. Write it yourself — don't copy from the firm."
            >
              <textarea
                value={form.known_for}
                rows={2}
                placeholder="Own carpentry factory · 5.0★ Google · HDB licensed since 2018"
                onChange={(event) => setForm((current) => ({ ...current, known_for: event.target.value }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </Field>
          </SectionCard>

          <SectionCard title="SECTION B — CREDENTIALS">
            <TextInput
              label="HDB licence number"
              value={form.hdb_license_number}
              onChange={(value) => setForm((current) => ({ ...current, hdb_license_number: value }))}
            />
            <Checkbox
              label="HDB licence verified"
              checked={form.hdb_license_verified}
              onChange={(checked) => setForm((current) => ({ ...current, hdb_license_verified: checked }))}
            />
            <Checkbox
              label="CaseTrust accredited"
              checked={form.casetrust_accredited}
              onChange={(checked) => setForm((current) => ({ ...current, casetrust_accredited: checked }))}
            />
            <NumberInput
              label="Google rating"
              value={form.google_rating}
              min={0}
              max={5}
              step={0.1}
              onChange={(value) => setForm((current) => ({ ...current, google_rating: value }))}
            />
            <NumberInput
              label="Google review count"
              value={form.google_review_count}
              onChange={(value) => setForm((current) => ({ ...current, google_review_count: value }))}
            />
          </SectionCard>

          <SectionCard title="SECTION C — FIRM DETAILS">
            <NumberInput
              label="Years established"
              value={form.years_established}
              placeholder="e.g. 2018"
              onChange={(value) => setForm((current) => ({ ...current, years_established: value }))}
            />
            <NumberInput
              label="Projects completed"
              value={form.projects_completed}
              onChange={(value) => setForm((current) => ({ ...current, projects_completed: value }))}
            />
            <Checkbox
              label="Owns carpentry factory"
              checked={form.owns_factory}
              onChange={(checked) => setForm((current) => ({ ...current, owns_factory: checked }))}
            />
            <Checkbox
              label="Fully in-house team (no subcontractors)?"
              checked={form.in_house_team}
              onChange={(checked) => setForm((current) => ({ ...current, in_house_team: checked }))}
            />
          </SectionCard>

          <SectionCard title="SECTION D — CONTACT">
            <TextInput
              label="WhatsApp number"
              value={form.whatsapp_number}
              placeholder="e.g. 91234567"
              onChange={(value) => setForm((current) => ({ ...current, whatsapp_number: value }))}
            />

            <Field
              label="Custom WhatsApp message"
              helper="Leave blank to use the default message."
            >
              <textarea
                value={form.whatsapp_message}
                rows={3}
                placeholder="Hi [firm name], I found your BTO package on Btopackage.sg, can i know more?"
                onChange={(event) => setForm((current) => ({ ...current, whatsapp_message: event.target.value }))}
                className="w-full rounded border border-slate-300 px-3 py-2"
              />
            </Field>

            <TextInput
              label="Website URL"
              value={form.website_url}
              onChange={(value) => setForm((current) => ({ ...current, website_url: value }))}
            />
          </SectionCard>

          <SectionCard title="SECTION E — PUBLISH">
            <Checkbox
              label="Published"
              helperText="Only published firms appear on the site."
              checked={form.published}
              onChange={(checked) => setForm((current) => ({ ...current, published: checked }))}
            />

            {errors.form ? <p className="text-sm text-red-600">{errors.form}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 min-h-[44px] w-full rounded-xl bg-[#1B4332] px-4 text-base font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Firm'}
            </button>
          </SectionCard>

          <SectionCard title="SECTION — HOMEPAGE PLACEMENT">
            <Checkbox
              label="Show on homepage"
              helperText="Firm will appear in the homepage featured section regardless of trust criteria."
              checked={form.featured}
              onChange={(checked) => setForm((current) => ({ ...current, featured: checked }))}
            />
            <NumberInput
              label="Position (1–5)"
              value={form.featured_position}
              min={1}
              max={5}
              helper="Controls the order shown on homepage. 1 = first card."
              onChange={(value) => setForm((current) => ({ ...current, featured_position: value }))}
            />
            <DateInput
              label="Show until"
              value={form.featured_until}
              helper="Leave blank to show indefinitely."
              onChange={(value) => setForm((current) => ({ ...current, featured_until: value }))}
            />
          </SectionCard>
        </form>
      )}
    </section>
  );
}

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-[#E5E0D8] bg-white p-6">
      <h2 className="mb-4 text-sm font-semibold tracking-wide text-slate-800">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  helper,
  children,
}: {
  label: string;
  error?: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1 text-sm text-slate-700">
      <span>{label}</span>
      {children}
      {helper ? <span className="text-xs text-slate-500">{helper}</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-slate-300 px-3 py-2"
      />
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
  placeholder,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <Field label={label} helper={helper}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-slate-300 px-3 py-2"
      />
    </Field>
  );
}

function DateInput({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
}) {
  return (
    <Field label={label} helper={helper}>
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border border-slate-300 px-3 py-2"
      />
    </Field>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  helperText,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helperText?: string;
}) {
  return (
    <label className="block space-y-1 text-sm text-slate-700">
      <span className="flex items-center gap-2">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span>{label}</span>
      </span>
      {helperText ? <span className="text-xs text-slate-500">{helperText}</span> : null}
    </label>
  );
}
