import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }

  const supabase = await createServerClient({ supabaseKey: serviceRoleKey });

  const [
    activeFirmsQuery,
    activePackagesQuery,
    pendingSubmissionsQuery,
    expiringSoonQuery,
    pendingListQuery,
  ] = await Promise.all([
    supabase
      .from('id_firm')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('is_complete', true),
    supabase
      .from('package')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('status', 'active'),
    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase
      .from('package')
      .select('*', { count: 'exact', head: true })
      .lte('verification_expiry_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from('submissions')
      .select('id, whatsapp, hdb_licence, created_at, firm_name')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  const stats = [
    { label: 'Active firms', value: activeFirmsQuery.count ?? 0 },
    { label: 'Active packages', value: activePackagesQuery.count ?? 0 },
    { label: 'Pending submissions', value: pendingSubmissionsQuery.count ?? 0 },
    { label: 'Expiring soon', value: expiringSoonQuery.count ?? 0 },
  ];

  return (
    <>
      <head>
        <meta name="robots" content="noindex" />
      </head>

      <div className="space-y-8">
        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Quick Links</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-blue-700">
            <li>
              <Link href="/admin/firms" className="hover:underline">
                /admin/firms — Manage firms
              </Link>
            </li>
            <li>
              <Link href="/admin/packages" className="hover:underline">
                /admin/packages — Manage packages
              </Link>
            </li>
            <li>
              <Link href="/admin/submissions" className="hover:underline">
                /admin/submissions — Review submissions
              </Link>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Pending Submissions</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Firm name</th>
                  <th className="px-4 py-3 font-medium">WhatsApp</th>
                  <th className="px-4 py-3 font-medium">HDB licence</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {(pendingListQuery.data ?? []).map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-4 py-3">{submission.firm_name ?? '-'}</td>
                    <td className="px-4 py-3">{submission.whatsapp ?? '-'}</td>
                    <td className="px-4 py-3">{submission.hdb_licence ?? '-'}</td>
                    <td className="px-4 py-3">
                      {submission.created_at
                        ? new Date(submission.created_at).toLocaleString('en-SG', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded border border-green-300 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="rounded border border-red-300 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingListQuery.data?.length ? null : (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                      No pending submissions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
