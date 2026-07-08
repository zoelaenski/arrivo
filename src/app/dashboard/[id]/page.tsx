import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import PaymentQRCode from './payment-qr';
import PaymentStatusPoller from './payment-status-poller';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (!invoice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-md mx-auto">
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-block"
        >
          ← Back to invoices
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {invoice.client_name}
              </h1>
              <p className="text-sm text-slate-500">
                {invoice.description || 'No description'}
              </p>
            </div>
            <span className="text-2xl font-semibold text-slate-900">
              ${invoice.amount_usdc}
            </span>
          </div>

          {invoice.status === 'paid' ? (
            <div className="text-center py-8">
              <p className="text-emerald-600 font-medium">✓ Paid</p>
              <p className="text-sm text-slate-500 mt-1">
                Received {new Date(invoice.paid_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <>
              <PaymentStatusPoller invoiceId={invoice.id} />
              <PaymentQRCode
                recipientWallet={invoice.recipient_wallet}
                amountUsdc={invoice.amount_usdc}
                referencePubkey={invoice.reference_pubkey}
                clientName={invoice.client_name}
              />
              <p className="text-xs text-slate-400 text-center mt-4">
                Scan with a Solana wallet app (Phantom, Solflare) to pay in
                USDC.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
