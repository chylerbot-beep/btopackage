import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import EditPackageForm, { FirmOption, HeightSelection, PackageForm } from './EditPackageForm';

type EditPackagePageProps = {
  params: Promise<{ id: string }>;
};

type PackageRow = Record<string, unknown>;

function toStringValue(value: unknown) {
  if (value == null) return '';
  return String(value);
}

function toHeightSelection(value: unknown): HeightSelection {
  if (value == null) return 'null';
  return Boolean(value) ? 'true' : 'false';
}

function mapPackageToForm(pkg: PackageRow): PackageForm {
  return {
    firm_id: toStringValue(pkg.firm_id),
    flat_type: (pkg.flat_type as PackageForm['flat_type']) ?? '4-room',
    package_type: (pkg.package_type as PackageForm['package_type']) ?? 'bto',
    slug: toStringValue(pkg.slug),
    price_nett: toStringValue(pkg.price_nett),
    promotion_text: toStringValue(pkg.promotion_text),
    promotion_expiry: typeof pkg.promotion_expiry === 'string' ? pkg.promotion_expiry.split('T')[0] : '',
    freebies: toStringValue(pkg.freebies),
    package_details: toStringValue(pkg.package_details),
    kitchen_top_cabinet_ft: toStringValue(pkg.kitchen_top_cabinet_ft),
    kitchen_bottom_cabinet_ft: toStringValue(pkg.kitchen_bottom_cabinet_ft),
    master_wardrobe_ft: toStringValue(pkg.master_wardrobe_ft),
    master_wardrobe_type: (pkg.master_wardrobe_type as PackageForm['master_wardrobe_type']) ?? '',
    master_wardrobe_full_height: toHeightSelection(pkg.master_wardrobe_full_height),
    common_wardrobe_room2_ft: toStringValue(pkg.common_wardrobe_room2_ft),
    common_wardrobe_room2_type: (pkg.common_wardrobe_room2_type as PackageForm['common_wardrobe_room2_type']) ?? '',
    common_wardrobe_room2_full_height: toHeightSelection(pkg.common_wardrobe_room2_full_height),
    common_wardrobe_room3_ft: toStringValue(pkg.common_wardrobe_room3_ft),
    common_wardrobe_room3_type: (pkg.common_wardrobe_room3_type as PackageForm['common_wardrobe_room3_type']) ?? '',
    common_wardrobe_room3_full_height: toHeightSelection(pkg.common_wardrobe_room3_full_height),
    board_grade: (pkg.board_grade as PackageForm['board_grade']) ?? '',
    flooring_type: (pkg.flooring_type as PackageForm['flooring_type']) ?? '',
    flooring_rooms_covered: (pkg.flooring_rooms_covered as PackageForm['flooring_rooms_covered']) ?? '',
    vinyl_thickness_mm: toStringValue(pkg.vinyl_thickness_mm),
    screeding_included: Boolean(pkg.screeding_included),
    countertop_material: (pkg.countertop_material as PackageForm['countertop_material']) ?? '',
    countertop_length_ft: toStringValue(pkg.countertop_length_ft),
    countertop_backsplash: Boolean(pkg.countertop_backsplash),
    shower_screens_included: Boolean(pkg.shower_screens_included),
    shower_screen_count: toStringValue(pkg.shower_screen_count),
    electrical_included: Boolean(pkg.electrical_included),
    plumbing_included: Boolean(pkg.plumbing_included),
    false_ceiling_included: Boolean(pkg.false_ceiling_included),
    false_ceiling_areas: toStringValue(pkg.false_ceiling_areas),
    doors_included: Boolean(pkg.doors_included),
    door_count: toStringValue(pkg.door_count),
    door_type: (pkg.door_type as PackageForm['door_type']) ?? '',
    paint_brand: toStringValue(pkg.paint_brand),
    paint_colours: toStringValue(pkg.paint_colours),
    paint_coverage: (pkg.paint_coverage as PackageForm['paint_coverage']) ?? '',
    cleaning_and_haulage_included: Boolean(pkg.cleaning_and_haulage_included),
    render_3d: Boolean(pkg.render_3d),
    render_revisions: toStringValue(pkg.render_revisions),
    warranty_months: toStringValue(pkg.warranty_months),
    excl_kitchen_top_cabinet: Boolean(pkg.excl_kitchen_top_cabinet),
    excl_kitchen_bottom_cabinet: Boolean(pkg.excl_kitchen_bottom_cabinet),
    excl_master_wardrobe: Boolean(pkg.excl_master_wardrobe),
    excl_common_wardrobe_room2: Boolean(pkg.excl_common_wardrobe_room2),
    excl_common_wardrobe_room3: Boolean(pkg.excl_common_wardrobe_room3),
    excl_electrical_wiring: Boolean(pkg.excl_electrical_wiring),
    excl_plumbing: Boolean(pkg.excl_plumbing),
    excl_deep_cleaning: Boolean(pkg.excl_deep_cleaning),
    excl_hdb_permit_fee: Boolean(pkg.excl_hdb_permit_fee),
    excl_flooring_bedrooms: Boolean(pkg.excl_flooring_bedrooms),
    not_included_notes: toStringValue(pkg.not_included_notes),
    image_url: toStringValue(pkg.image_url),
    verified_by: (pkg.verified_by as PackageForm['verified_by']) ?? 'staff',
    status: (pkg.status as PackageForm['status']) ?? 'active',
    featured: Boolean(pkg.is_featured),
    featured_position: toStringValue(pkg.featured_position),
  };
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { id } = await params;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  const supabase = await createServerClient({ supabaseKey: serviceRoleKey });

  const [{ data: pkg, error: packageError }, { data: firms, error: firmsError }] = await Promise.all([
    supabase.from('package').select('*').eq('id', id).is('deleted_at', null).maybeSingle(),
    supabase.from('id_firm').select('id, name').is('deleted_at', null).order('name', { ascending: true }),
  ]);

  if (packageError) {
    throw new Error(packageError.message);
  }

  if (firmsError) {
    throw new Error(firmsError.message);
  }

  if (!pkg) {
    notFound();
  }

  return <EditPackageForm packageId={id} firms={(firms ?? []) as FirmOption[]} initialForm={mapPackageToForm(pkg as PackageRow)} />;
}
