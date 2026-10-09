import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import PaymentQRCode from '@/app/dashboard/[id]/payment-qr';

export default async function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.rpc('get_public_invoice', { p_id: id });
  const invoice = data?.[0];

  if (!invoice) {
    notFound();
  }

  const wallet: string = invoice.recipient_wallet;
  const shortWallet = `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-8">
        <p className="text-sm text-slate-500 mb-1">Invoice for</p>
        <h1 className="text-lg font-semibold text-slate-900">
          {invoice.client_name}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {invoice.description || 'No description'}
        </p>

        <p className="text-3xl font-semibold text-slate-900 mb-1">
          ${invoice.amount_usdc} USDC
        </p>
        {invoice.due_date && (
          <p className="text-sm text-slate-500 mb-6">
            Due {new Date(invoice.due_date).toLocaleDateString()}
          </p>
        )}

        {invoice.status === 'paid' ? (
          <div className="text-center py-8">
            <p className="text-emerald-600 font-medium">✓ Paid</p>
            <p className="text-sm text-slate-500 mt-1">
              Thank you, this invoice has been settled.
            </p>
          </div>
        ) : (
          <>
            <PaymentQRCode
              recipientWallet={invoice.recipient_wallet}
              amountUsdc={invoice.amount_usdc}
              referencePubkey={invoice.reference_pubkey}
              clientName={invoice.client_name}
            />
            <p className="text-xs text-slate-400 text-center mt-4">
              Scan with a Solana wallet (Phantom, Solflare) to pay in USDC to{' '}
              {shortWallet}.
            </p>
          </>
        )}
      </div>
    </div>
  );
}