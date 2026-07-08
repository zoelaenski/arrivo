import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { createClient } from '@/lib/supabase-server';
import { sendPaymentNotification } from '@/lib/email';

// How much rounding difference we tolerate when comparing amounts
// (USDC has 6 decimal places, so tiny float rounding can occur)
const AMOUNT_TOLERANCE = 0.000001;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single();

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  if (invoice.status === 'paid') {
    return NextResponse.json({ status: 'paid' });
  }

  const connection = new Connection(process.env.SOLANA_RPC_URL!);
  const usdcMint = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT!);
  const recipientWallet = new PublicKey(invoice.recipient_wallet);

  // Every wallet has one dedicated address just for holding a specific
  // token (like USDC). This derives that address from the wallet + mint.
  const recipientTokenAccount = await getAssociatedTokenAddress(
    usdcMint,
    recipientWallet
  );

  console.log('--- Checking payment (balance-history method) ---');
  console.log('Recipient USDC token account:', recipientTokenAccount.toBase58());

  // Get recent transaction signatures for that token account
  const signatures = await connection.getSignaturesForAddress(
    recipientTokenAccount,
    { limit: 15 }
  );

  const invoiceCreatedAt = new Date(invoice.created_at).getTime() / 1000;

  for (const sigInfo of signatures) {
    // Skip transactions that happened before this invoice even existed
    if (sigInfo.blockTime && sigInfo.blockTime < invoiceCreatedAt) {
      continue;
    }

    // Skip this transaction if it's already been used to pay a DIFFERENT invoice
    const { data: alreadyUsed } = await supabase
      .from('invoices')
      .select('id')
      .eq('paid_tx_signature', sigInfo.signature)
      .maybeSingle();

    if (alreadyUsed) {
      continue;
    }

    const tx = await connection.getParsedTransaction(sigInfo.signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx?.meta) continue;

    // Compare the token balance for our specific account before vs after
    // this transaction — the difference tells us how much USDC arrived.
    const preBalance = tx.meta.preTokenBalances?.find(
      (b) => b.owner === recipientWallet.toBase58() && b.mint === usdcMint.toBase58()
    );
    const postBalance = tx.meta.postTokenBalances?.find(
      (b) => b.owner === recipientWallet.toBase58() && b.mint === usdcMint.toBase58()
    );

    const before = preBalance?.uiTokenAmount.uiAmount ?? 0;
    const after = postBalance?.uiTokenAmount.uiAmount ?? 0;
    const received = after - before;

    console.log(
      `Signature ${sigInfo.signature}: received ${received} USDC (expected ${invoice.amount_usdc})`
    );

    if (Math.abs(received - Number(invoice.amount_usdc)) < AMOUNT_TOLERANCE) {
      // Found a match — mark the invoice paid, recording exactly which
      // transaction we matched so it can never be reused for another invoice
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          paid_tx_signature: sigInfo.signature,
        })
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('✓ Marked invoice as paid');

      // Fire off the notification email — doesn't block or risk the
      // payment confirmation above if it fails
      await sendPaymentNotification({
        toEmail: user.email!,
        clientName: invoice.client_name,
        amountUsdc: invoice.amount_usdc,
      });

      return NextResponse.json({ status: 'paid' });
    }
  }

  console.log('✗ No matching payment found yet');
  return NextResponse.json({ status: 'pending' });
}
