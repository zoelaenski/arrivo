'use client';

import { useState } from 'react';

export default function CopyLinkButton({ invoiceId }: { invoiceId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const link = `${window.location.origin}/pay/${invoiceId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link and send it to your client:', link);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-slate-800 transition mb-6"
    >
      {copied ? 'Link copied ✓' : 'Copy client link'}
    </button>
  );
}