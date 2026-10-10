import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

const focus =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F2328]';

const steps = [
  {
    title: 'Create the invoice',
    body: 'Enter the client name, the amount in USDC, and the wallet you want to be paid into.',
  },
  {
    title: 'Share the payment link',
    body: 'Copy the link and send it. Your client opens it without an account and scans the QR code with a Solana wallet like Phantom.',
  },
  {
    title: 'Get confirmed automatically',
    body: 'We watch your wallet on-chain and mark the invoice paid when the transfer lands.',
  },
];

const features = [
  {
    title: 'Automatic payment detection',
    body: 'No refreshing a block explorer. The invoice flips to paid once the transaction confirms.',
  },
  {
    title: 'Every invoice at a glance',
    body: 'See which invoices are pending and which are paid, all from one simple dashboard.',
  },
  {
    title: 'Client links, no sign-up',
    body: 'Your client only needs a Solana wallet. They never create an account.',
  },
  {
    title: 'Money goes straight to you',
    body: 'Payments go from the client wallet to yours. We never hold your funds.',
  },
];

const roadmap = [
  {
    title: 'Escrow',
    body: 'The client pays, funds are held, and they are released when the work is approved. Prototype on devnet first.',
    status: 'In design',
  },
  {
    title: 'Dispute resolution',
    body: 'Both sides upload proof if something goes wrong, so a disagreement can be settled fairly.',
    status: 'Planned',
  },
  {
    title: 'Platform API',
    body: 'Let freelance platforms create invoices and receive a webhook when one is paid.',
    status: 'Planned',
  },
];

const socials = [
  {
    label: 'X',
    href: 'https://x.com/zoelaenskai_',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/zoelaenski',
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  {
    label: 'Telegram',
    href: 'https://t.me/zoelaenskii',
    path: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const amberButton = `inline-block rounded-full bg-[#F2A33A] text-[#1F2328] px-7 py-3.5 text-base font-semibold hover:bg-[#E8962A] transition ${focus}`;

  return (
    <div className="bg-white text-[#1F2328] min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#E6E6E3]">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <span className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
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
          </span>
                   {user ? (
            <Link
              href="/dashboard"
              prefetch={false}
              className={`rounded-full border border-[#E6E6E3] px-4 py-2 text-sm font-medium hover:bg-[#F4F4F2] transition ${focus}`}
            >
              Open dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className={`rounded-full px-4 py-2 text-sm font-medium hover:bg-[#F4F4F2] transition ${focus}`}
              >
                Log in
              </Link>
              <Link
                href="/login?mode=signup"
                className={`rounded-full bg-[#F2A33A] text-[#1F2328] px-4 py-2 text-sm font-semibold hover:bg-[#E8962A] transition ${focus}`}
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-14 md:py-24 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Send an invoice.
            <br />
            Get paid in USDC.
          </h1>
          <p className="mt-6 text-lg text-[#5F6670] max-w-md leading-relaxed">
            Share a payment link with your client. We confirm the payment on
            Solana and mark your invoice paid the moment it lands.
          </p>
          <div className="mt-9">
            {user ? (
              <Link
                href="/dashboard/new"
                prefetch={false}
                className={amberButton}
              >
                Create an invoice
              </Link>
            ) : (
              <>
                <Link href="/login?mode=signup" className={amberButton}>
                  Get started
                </Link>
                <p className="mt-4 text-sm text-[#5F6670]">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className={`font-semibold text-[#1F2328] underline underline-offset-4 hover:text-[#B86E0A] ${focus}`}
                  >
                    Log in
                  </Link>
                </p>
              </>
            )}
          </div>
          <p className="mt-8 text-sm text-[#5F6670]">
            Clients pay from any Solana wallet, such as Phantom or Solflare.
          </p>
        </div>

        <div>
          <div className="rounded-[2rem] bg-[#FDF1DC] p-5 sm:p-8">
            <div className="rounded-3xl bg-white p-6 shadow-[0_18px_40px_-20px_rgba(31,35,40,0.35)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#5F6670]">Invoice for</p>
                  <p className="font-semibold">Acme Studio</p>
                  <p className="text-sm text-[#5F6670]">
                    Website redesign, final milestone
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E7F5EF] text-[#12805C] text-xs font-semibold px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#12805C]" />
                  Paid
                </span>
              </div>
              <p className="mt-6 text-4xl font-extrabold tracking-tight">
                $250.00{' '}
                <span className="text-base font-medium text-[#5F6670]">
                  USDC
                </span>
              </p>
              <ul className="mt-6 space-y-3 border-t border-[#E6E6E3] pt-5 text-sm">
                {[
                  'Payment link sent',
                  'Client paid from their wallet',
                  'Confirmed on Solana',
                  'Invoice marked as paid',
                ].map((item) => (
                  <li key={item} className="flex items-center justify-between">
                    <span className="text-[#5F6670]">{item}</span>
                    <span className="text-[#12805C]">✓</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs text-[#5F6670]">Example invoice</p>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#F4F4F2]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight">
            From invoice to paid in three steps
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={step.title}>
                <span className="h-9 w-9 rounded-full bg-[#F2A33A] text-[#1F2328] font-bold grid place-items-center">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-[#5F6670] leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">What you get</h2>
        <dl className="mt-10 divide-y divide-[#E6E6E3] border-y border-[#E6E6E3]">
          {features.map((f) => (
            <div key={f.title} className="py-6 md:grid md:grid-cols-3 md:gap-8">
              <dt className="font-semibold">{f.title}</dt>
              <dd className="mt-1 md:mt-0 md:col-span-2 text-[#5F6670] leading-relaxed">
                {f.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-[#F4F4F2]">
        <div className="max-w-5xl mx-auto px-6 py-20 md:grid md:grid-cols-3 md:gap-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Built for freelancers paid across borders
          </h2>
          <p className="mt-4 md:mt-0 md:col-span-2 text-[#5F6670] text-lg leading-relaxed">
            USDC is a dollar-pegged stablecoin, so the amount on your invoice is
            the amount you receive. On Solana, transfers typically confirm in
            seconds and cost a fraction of a cent, which makes it practical for
            invoices of any size.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight">
          What is coming next
        </h2>
        <div className="mt-10 divide-y divide-[#E6E6E3] border-y border-[#E6E6E3]">
          {roadmap.map((item) => (
            <div
              key={item.title}
              className="py-6 md:grid md:grid-cols-3 md:gap-8"
            >
              <div className="flex items-center gap-3">
                <p className="font-semibold">{item.title}</p>
                <span className="rounded-full bg-[#FDF1DC] text-xs font-medium text-[#8A5A0B] px-3 py-1">
                  {item.status}
                </span>
              </div>
              <p className="mt-1 md:mt-0 md:col-span-2 text-[#5F6670] leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#E6E6E3]">
        <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <h2 className="text-3xl font-bold tracking-tight max-w-md">
            Send your first invoice in a couple of minutes.
          </h2>
          <Link
            href={user ? '/dashboard/new' : '/login?mode=signup'}
            prefetch={user ? false : undefined}
            className={`${amberButton} self-start`}
          >
            {user ? 'Create an invoice' : 'Get started'}
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E6E6E3]">
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
          <span className="text-sm text-[#5F6670]">ARRIVO</span>
          <div className="flex items-center gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className={`text-[#5F6670] hover:text-[#1F2328] transition ${focus}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}