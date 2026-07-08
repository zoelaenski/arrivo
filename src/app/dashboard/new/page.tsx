'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewInvoicePage() {
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName,
        description,
        amountUsdc: amount,
        recipientWallet: wallet,
        dueDate: dueDate || null,
      }),
    });

    const body = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(body.error ?? 'Something went wrong');
      return;
    }

    router.push(`/dashboard/${body.invoice.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-md mx-auto bg-white rounded-xl border border-slate-200 p-8">
        <h1 className="text-xl font-semibold text-slate-900 mb-6">
          New invoice
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Client name">
            <input
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="input"
              placeholder="Acme Corp"
            />
          </Field>

          <Field label="Description (optional)">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              placeholder="Website redesign — final milestone"
            />
          </Field>

          <Field label="Amount (USDC)">
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder="250.00"
            />
          </Field>

          <Field label="Your Solana wallet address">
            <input
              required
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="input font-mono text-sm"
              placeholder="Where the USDC should be sent"
            />
          </Field>

          <Field label="Due date (optional)">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
            />
          </Field>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition"
          >
            {loading ? 'Creating…' : 'Create invoice'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
