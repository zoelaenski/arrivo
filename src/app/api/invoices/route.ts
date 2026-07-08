import { NextRequest, NextResponse } from 'next/server';
import { Keypair, PublicKey } from '@solana/web3.js';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // 1. Confirm someone is actually logged in before creating anything
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const { clientName, description, amountUsdc, recipientWallet, dueDate } =
    body;

  // 2. Basic validation before touching the database
  if (!clientName || !amountUsdc || !recipientWallet) {
    return NextResponse.json(
      { error: 'Client name, amount, and wallet address are required' },
      { status: 400 }
    );
  }

  try {
    // Solana wallet addresses have a specific valid format —
    // this throws if recipientWallet isn't a real Solana address
    new PublicKey(recipientWallet);
  } catch {
    return NextResponse.json(
      { error: 'That doesn\u2019t look like a valid Solana wallet address' },
      { status: 400 }
    );
  }

  // 3. Generate a fresh, random Solana keypair.
  // We only ever use its PUBLIC key, as a unique "tag" for this invoice's payment.
  const referenceKeypair = Keypair.generate();
  const referencePubkey = referenceKeypair.publicKey.toBase58();

  // 4. Insert the invoice — RLS requires user_id to match the logged-in user
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      client_name: clientName,
      description: description || null,
      amount_usdc: amountUsdc,
      recipient_wallet: recipientWallet,
      reference_pubkey: referencePubkey,
      due_date: dueDate,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ invoice });
}
