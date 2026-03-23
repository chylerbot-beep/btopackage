import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function requireAdmin() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return NextResponse.json({ error: 'Missing JWT_SECRET' }, { status: 500 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(jwtSecret);
    const result = await jwtVerify(token, secret);

    if (result.payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return null;
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET() {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
  }

  const supabase = await createServerClient({ supabaseKey: serviceRoleKey });
  const { data, error } = await supabase
    .from('id_firm')
    .select('id, name')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, firms: data ?? [] });
}

export async function POST(request: Request) {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const incomingSlug = typeof body?.slug === 'string' ? body.slug.trim() : '';
  const slug = incomingSlug || toSlug(name);

  const fieldErrors: Record<string, string> = {};

  if (!name) {
    fieldErrors.name = 'Name is required.';
  }

  if (!slug) {
    fieldErrors.slug = 'Slug is required.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fieldErrors }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
  }

  const supabase = await createServerClient({ supabaseKey: serviceRoleKey });

  const payload = {
    name,
    slug,
    pricing_model: body?.pricing_model || null,
    hdb_license_number: body?.hdb_license_number || null,
    hdb_license_verified: Boolean(body?.hdb_license_verified),
    casetrust_accredited: Boolean(body?.casetrust_accredited),
    bca_licensed: Boolean(body?.bca_licensed),
    google_rating: body?.google_rating === '' || body?.google_rating == null ? null : Number(body.google_rating),
    google_review_count:
      body?.google_review_count === '' || body?.google_review_count == null ? null : Number(body.google_review_count),
    years_established:
      body?.years_established === '' || body?.years_established == null ? null : Number(body.years_established),
    projects_completed:
      body?.projects_completed === '' || body?.projects_completed == null ? null : Number(body.projects_completed),
    owns_factory: Boolean(body?.owns_factory),
    in_house_team: Boolean(body?.in_house_team),
    whatsapp_number: body?.whatsapp_number || null,
    whatsapp_message: body?.whatsapp_message || null,
    website_url: body?.website_url || null,
    address: body?.address || null,
    known_for: body?.known_for || null,
    is_complete: Boolean(body?.is_complete),
    completeness_score:
      body?.completeness_score === '' || body?.completeness_score == null ? null : Number(body.completeness_score),
  };

  const { data, error } = await supabase.from('id_firm').insert(payload).select('id').single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
