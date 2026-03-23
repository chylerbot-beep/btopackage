import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminFirmsPage() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }

  const supabase = await createServerClient({ supabaseKey: serviceRoleKey });
  const { data: firms, error } = await supabase
    .from('id_firm')
    .select('id, name, hdb_license_verified, casetrust_accredited, google_rating, is_complete, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Firms</h1>
        <Link
          href="/admin/firms/new"
          className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Add New Firm
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">HDB Verified</th>
              <th className="px-4 py-3 font-medium">CaseTrust</th>
              <th className="px-4 py-3 font-medium">Google Rating</th>
              <th className="px-4 py-3 font-medium">Complete</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {(firms ?? []).map((firm) => (
              <tr key={firm.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{firm.name}</td>
                <td className="px-4 py-3">{firm.hdb_license_verified ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">{firm.casetrust_accredited ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">{typeof firm.google_rating === 'number' ? firm.google_rating.toFixed(1) : '-'}</td>
                <td className="px-4 py-3">{firm.is_complete ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/firms/${firm.id}/edit`}
                    className="rounded border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {firms?.length ? null : (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No firms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
