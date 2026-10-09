import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import LogoutButton from './logout-button';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Your invoices
            </h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/new" prefetch={false}
              className="bg-slate-900 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-slate-800 transition"
            >
              New invoice
            </Link>
            <LogoutButton />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            Couldn&apos;t load invoices: {error.message}
          </p>
        )}

        {invoices && invoices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">
              No invoices yet. Create your first one to get paid in USDC.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {invoices?.map((invoice) => (
            <Link
              key={invoice.id}
              href={`/dashboard/${invoice.id}`} prefetch={false}
              className="block bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    {invoice.client_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {invoice.description || 'No description'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    ${invoice.amount_usdc} USDC
                  </p>
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    paid: 'bg-emerald-50 text-emerald-700',
    overdue: 'bg-red-50 text-red-700',
  };

  return (
    <span
      className={`inline-block text-xs font-medium rounded-full px-2 py-0.5 ${styles[status] ?? 'bg-slate-100 text-slate-600'}`}
    >
      {status}
    </span>
  );
}
