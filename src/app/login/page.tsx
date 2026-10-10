'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';

const inputClass =
  'w-full rounded-xl border border-[#D9D9D5] px-4 py-3 text-sm text-[#1F2328] placeholder:text-[#9AA0A6] focus:outline-none focus:ring-2 focus:ring-[#F2A33A] focus:border-[#F2A33A]';

const buttonClass =
  'w-full rounded-full bg-[#F2A33A] text-[#1F2328] py-3 text-sm font-semibold hover:bg-[#E8962A] disabled:opacity-50 transition';

function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#1F2328]"
    >
      <svg viewBox="0 0 1024 1024" className="h-8 w-8" aria-hidden="true">
        <rect width="1024" height="1024" rx="224" fill="#F2A33A" />
        <g
          transform="translate(512 512) scale(1.25) translate(-460 -530)"
          fill="none"
          stroke="#1F2328"
          strokeWidth="80"
          strokeLinecap="round"
        >
          <circle cx="460" cy="560" r="170" />
          <path d="M 630 330 L 630 730" strokeWidth="82" />
        </g>
      </svg>
      Arrivo
    </Link>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F4F2] flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-sm rounded-3xl bg-white border border-[#E6E6E3] p-8 shadow-[0_18px_40px_-24px_rgba(31,35,40,0.35)]">
        {children}
      </div>
      <Link
        href="/"
        className="mt-6 text-sm text-[#5F6670] hover:text-[#1F2328]"
      >
        ← Back to home
      </Link>
    </div>
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'signup') {
      setMode('signup');
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    // When email confirmation is on, sign-up returns no session until
    // the person clicks the link in their inbox.
    if (mode === 'signup' && !result.data.session) {
      setCheckEmail(true);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  if (checkEmail) {
    return (
      <Shell>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2328] mb-2">
            Check your email
          </h1>
          <p className="text-sm text-[#5F6670] leading-relaxed mb-6">
            We sent a confirmation link to{' '}
            <span className="font-semibold text-[#1F2328]">{email}</span>. Open
            it to activate your account, then come back and log in.
          </p>
          <button
            onClick={() => {
              setCheckEmail(false);
              setMode('login');
              setPassword('');
            }}
            className={buttonClass}
          >
            Back to log in
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-2xl font-bold tracking-tight text-[#1F2328] mb-1">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="text-sm text-[#5F6670] mb-6">
        {mode === 'login'
          ? 'Log in to manage your invoices.'
          : 'Start invoicing in USDC in a couple of minutes.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1F2328] mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1F2328] mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <p className="text-sm text-[#B3261E] bg-[#FDECEC] rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={buttonClass}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        className="mt-5 text-sm text-[#5F6670] hover:text-[#1F2328] w-full text-center"
      >
        {mode === 'login'
          ? "Don't have an account? Sign up"
          : 'Already have an account? Log in'}
      </button>
    </Shell>
  );
}