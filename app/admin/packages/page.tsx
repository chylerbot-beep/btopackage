import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type PackageRow = {
  id: string;
  flat_type: string | null;
  price_nett: number | null;
  status: string | null;
  verification_expiry_date: string | null;
  id_firm: { name: string | null } | { name: string | null }[] | null;
};

function getFirmName(firm: PackageRow['id_firm']) {
  if (!firm) {
    return '-';
  }

  if (Array.isArray(firm)) {
    return firm[0]?.name ?? '-';
  }

  return firm.name ?? '-';
}

export default async function AdminPackagesPage() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }

  const supabase = await createServerClient({ supabaseKey: serviceRoleKey });
  const { data: packages, error } = await supabase
    .from('package')
    .select('id, flat_type, price_nett, status, verification_expiry_date, created_at, id_firm(name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Packages</h1>
        <Link
          href="/admin/packages/new"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Add New Package
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Firm</th>
              <th className="px-4 py-3 font-medium">Flat type</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Verified until</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {(packages ?? []).map((pkg) => (
              <tr key={pkg.id}>
                <td className="px-4 py-3">{getFirmName((pkg as PackageRow).id_firm)}</td>
                <td className="px-4 py-3">{pkg.flat_type ?? '-'}</td>
                <td className="px-4 py-3">
                  {typeof pkg.price_nett === 'number' ? `$${pkg.price_nett.toLocaleString('en-SG')}` : '-'}
                </td>
                <td className="px-4 py-3">{pkg.status ?? '-'}</td>
                <td className="px-4 py-3">
                  {pkg.verification_expiry_date
                    ? new Date(pkg.verification_expiry_date).toLocaleDateString('en-SG', { dateStyle: 'medium' })
                    : '-'}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/packages/${pkg.id}/edit`}
                    className="rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {packages?.length ? null : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No packages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
