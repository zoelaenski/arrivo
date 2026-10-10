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
    body: 'We watch your wallet on-chain, mark the invoice paid when the transfer lands, and email you.',
  },
];

const features = [
  {
    title: 'Automatic payment detection',
    body: 'No refreshing a block explorer. The invoice flips to paid once the transaction confirms.',
  },
  {
    title: 'Email when you get paid',
    body: 'A confirmation lands in your inbox as soon as the payment is matched to your invoice.',
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

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const amberButton = `inline-block rounded-full bg-[#F2A33A] text-[#1F2328] px-7 py-3.5 text-base font-semibold hover:bg-[#E8962A] transition ${focus}`;

  return (
    <div className="bg-white text-[#1F2328] min-h-screen">
      <header className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight">Solana Invoicer</span>
        {user && (
          <Link
            href="/dashboard"
            prefetch={false}
            className={`rounded-full border border-[#E6E6E3] px-4 py-2 text-sm font-medium hover:bg-[#F4F4F2] transition ${focus}`}
          >
            Open dashboard
          </Link>
        )}
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
            Solana and email you the moment it lands.
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
                  'Email sent to you',
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
            <div key={item.title} className="py-6 md:grid md:grid-cols-3 md:gap-8">
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
        <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-[#5F6670]">
          <span>Built by Zoe</span>
          <a
            href="https://github.com/zoelaenski/solana-invoicer"
            className={`hover:text-[#1F2328] ${focus}`}
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}