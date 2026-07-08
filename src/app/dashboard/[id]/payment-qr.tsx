'use client';

import { QRCodeSVG } from 'qrcode.react';
import { encodeURL } from '@solana/pay';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

export default function PaymentQRCode({
  recipientWallet,
  amountUsdc,
  referencePubkey,
  clientName,
}: {
  recipientWallet: string;
  amountUsdc: number;
  referencePubkey: string;
  clientName: string;
}) {
  // USDC's official token address (differs between devnet and mainnet —
  // see note below on which network we're building against).
  const USDC_MINT = new PublicKey(
    process.env.NEXT_PUBLIC_USDC_MINT!
  );

  // Build a Solana Pay URL — this is the standard format that Phantom,
  // Solflare, and other Solana wallets know how to read directly.
  const url = encodeURL({
    recipient: new PublicKey(recipientWallet),
    amount: new BigNumber(amountUsdc),
    splToken: USDC_MINT, // <-- without this, wallets would request SOL instead
    reference: new PublicKey(referencePubkey),
    label: 'Invoice payment',
    message: `Payment from ${clientName}`,
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <QRCodeSVG value={url.toString()} size={220} />
      </div>
      <a
        href={url.toString()}
        className="text-sm text-slate-500 hover:text-slate-700 underline break-all text-center max-w-xs"
      >
        Open in wallet app
      </a>
    </div>
  );
}
