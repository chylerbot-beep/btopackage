import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

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

function toNullableNumber(value: unknown) {
  if (value === '' || value == null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function POST(request: Request) {
  const authError = await requireAdmin();

  if (authError) {
    return authError;
  }

  const body = await request.json().catch(() => null);

  const fieldErrors: Record<string, string> = {};

  if (!body?.firm_id) {
    fieldErrors.firm_id = 'Firm is required.';
  }

  if (!body?.slug || typeof body.slug !== 'string' || !body.slug.trim()) {
    fieldErrors.slug = 'Slug is required.';
  }

  if (!body?.flat_type) {
    fieldErrors.flat_type = 'Flat type is required.';
  }

  if (body?.price_nett === '' || body?.price_nett == null) {
    fieldErrors.price_nett = 'Price is required.';
  }

  const hasExclusion =
    Boolean(body?.excl_kitchen_top_cabinet) ||
    Boolean(body?.excl_kitchen_bottom_cabinet) ||
    Boolean(body?.excl_master_wardrobe) ||
    Boolean(body?.excl_common_wardrobe_room2) ||
    Boolean(body?.excl_common_wardrobe_room3) ||
    Boolean(body?.excl_electrical_wiring) ||
    Boolean(body?.excl_plumbing) ||
    Boolean(body?.excl_deep_cleaning) ||
    Boolean(body?.excl_hdb_permit_fee) ||
    Boolean(body?.excl_flooring_bedrooms);

  if (!hasExclusion && (!body?.not_included_notes || !String(body.not_included_notes).trim())) {
    fieldErrors.not_included_notes = 'Select at least one exclusion or provide not included notes.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ error: 'Validation failed', fieldErrors }, { status: 400 });
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
  }

  const supabase = await createServerClient({ supabaseKey: serviceRoleKey });

  // Run in Supabase SQL Editor:
  // ALTER TABLE package ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
  // ALTER TABLE package ADD COLUMN IF NOT EXISTS featured_position integer DEFAULT null;
  const payload = {
    firm_id: body.firm_id,
    slug: String(body.slug).trim(),
    flat_type: body.flat_type,
    package_type: body.package_type || null,
    price_nett: Number(body.price_nett),
    kitchen_top_cabinet_ft: toNullableNumber(body.kitchen_top_cabinet_ft),
    kitchen_bottom_cabinet_ft: toNullableNumber(body.kitchen_bottom_cabinet_ft),
    countertop_material: body.countertop_material || null,
    countertop_length_ft: toNullableNumber(body.countertop_length_ft),
    countertop_backsplash: Boolean(body.countertop_backsplash),
    master_wardrobe_ft: toNullableNumber(body.master_wardrobe_ft),
    master_wardrobe_type: body.master_wardrobe_type || null,
    master_wardrobe_full_height: body.master_wardrobe_full_height == null ? null : Boolean(body.master_wardrobe_full_height),
    common_wardrobe_room2_ft: toNullableNumber(body.common_wardrobe_room2_ft),
    common_wardrobe_room2_type: body.common_wardrobe_room2_type || null,
    common_wardrobe_room2_full_height: body.common_wardrobe_room2_full_height == null ? null : Boolean(body.common_wardrobe_room2_full_height),
    common_wardrobe_room3_ft: toNullableNumber(body.common_wardrobe_room3_ft),
    common_wardrobe_room3_type: body.common_wardrobe_room3_type || null,
    common_wardrobe_room3_full_height: body.common_wardrobe_room3_full_height == null ? null : Boolean(body.common_wardrobe_room3_full_height),
    board_grade: body.board_grade || null,
    flooring_type: body.flooring_type || null,
    flooring_rooms_covered: body.flooring_rooms_covered || null,
    vinyl_thickness_mm: toNullableNumber(body.vinyl_thickness_mm),
    screeding_included: Boolean(body.screeding_included),
    shower_screens_included: Boolean(body.shower_screens_included),
    shower_screen_count: toNullableNumber(body.shower_screen_count),
    electrical_included: Boolean(body.electrical_included),
    plumbing_included: Boolean(body.plumbing_included),
    false_ceiling_included: Boolean(body.false_ceiling_included),
    false_ceiling_areas: body.false_ceiling_areas || null,
    doors_included: Boolean(body.doors_included),
    door_count: toNullableNumber(body.door_count),
    door_type: body.door_type || null,
    cleaning_and_haulage_included: Boolean(body.cleaning_and_haulage_included),
    paint_brand: body.paint_brand || null,
    paint_colours: toNullableNumber(body.paint_colours),
    paint_coverage: body.paint_coverage || null,
    render_3d: Boolean(body.render_3d),
    render_revisions: toNullableNumber(body.render_revisions),
    warranty_months: toNullableNumber(body.warranty_months),
    promotion_text: body.promotion_text || null,
    promotion_expiry: body.promotion_expiry || null,
    freebies: body.freebies || null,
    excl_kitchen_top_cabinet: Boolean(body.excl_kitchen_top_cabinet),
    excl_kitchen_bottom_cabinet: Boolean(body.excl_kitchen_bottom_cabinet),
    excl_master_wardrobe: Boolean(body.excl_master_wardrobe),
    excl_common_wardrobe_room2: Boolean(body.excl_common_wardrobe_room2),
    excl_common_wardrobe_room3: Boolean(body.excl_common_wardrobe_room3),
    excl_electrical_wiring: Boolean(body.excl_electrical_wiring),
    excl_plumbing: Boolean(body.excl_plumbing),
    excl_deep_cleaning: Boolean(body.excl_deep_cleaning),
    excl_hdb_permit_fee: Boolean(body.excl_hdb_permit_fee),
    excl_flooring_bedrooms: Boolean(body.excl_flooring_bedrooms),
    not_included_notes: body.not_included_notes || null,
    image_url: body.image_url || null,
    verified_by: body.verified_by || null,
    status: body.status || null,
    is_featured: Boolean(body.featured),
    featured_position: toNullableNumber(body.featured_position),
  };

  const { data, error } = await supabase.from('package').insert(payload).select('id').single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
