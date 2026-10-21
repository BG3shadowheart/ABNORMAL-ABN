import type { Metadata } from 'next';
import Link from 'next/link';

import { OrderSteps } from '@/components/order-steps';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { Breadcrumbs } from '@/components/platform-page';
import { ContactChecklist, SupportPanel } from '@/components/support-panel';
import { ArrowIcon, LinkButton, SectionHeading } from '@/components/ui';
import { PLATFORMS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Message us on Discord, Telegram or WhatsApp to check a product, a plan, a price or a payment.',
  alternates: { canonical: '/support' },
};

const BEFORE_YOU_ASK = [
  'Which product and plan you are looking at (the product page link helps).',
  'Whether you are on PC, Android or iOS.',
  'How you plan to pay.',
  'Your transaction ID, if you have already paid.',
];

const NEVER_SHARE = [
  'Your bKash or Nagad PIN or password',
  'One-time passwords (OTP)',
  'Wallet private keys or seed phrases',
  'Remote-access codes you did not ask for',
];

export default function SupportPage() {
  return (
    <>
      <section className="shell page-top">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Support' }]} />

        <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight text-bone-50">
          Talk to us before you pay
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone-300">
          We check the product, the plan, the exact price and the payment with you first. Use
          whichever app you like, all three reach the same team.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <LinkButton href="#how-to-order" variant="ghost" className="!py-2.5">
            How ordering works
            <ArrowIcon className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="/products" variant="ghost" className="!py-2.5">
            Browse products
          </LinkButton>
        </div>
      </section>

      <section className="shell pb-12">
        <SupportPanel />
      </section>

      <section id="how-to-order" className="shell home-block scroll-mt-24">
        <SectionHeading title="How ordering works" description="Four steps, from picking a plan to getting your access." />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <OrderSteps />
          <ContactChecklist />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="panel p-5">
            <h3 className="font-display text-lg text-bone-50">It helps if you tell us</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-bone-300">
              {BEFORE_YOU_ASK.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel p-5">
            <h3 className="font-display text-lg text-bone-50">We will never ask for</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-bone-300">
              {NEVER_SHARE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-ink-700 pt-4 text-xs leading-relaxed text-bone-500">
              If someone asks for any of these, it is not us. Stop talking to them and tell us on
              Discord, Telegram or WhatsApp.
            </p>
          </article>
        </div>
      </section>

      <section className="shell home-block">
        <SectionHeading
          title="Where to send your payment"
          description="The same details as on the payment page."
          action={
            <Link href="/payments" className="btn btn-ghost">
              How to pay
              <ArrowIcon className="h-4 w-4" />
            </Link>
          }
        />
        <PaymentCards variant="row" className="mt-6" />
        <PaymentSafetyNote className="mt-4" />
      </section>

      <section className="shell home-block">
        <SectionHeading title="Back to browsing" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PLATFORMS.map((platform) => (
            <Link
              key={platform.id}
              href={platform.href}
              className="panel group flex items-center justify-between gap-4 p-5 transition-colors hover:border-crimson-500"
            >
              <span>
                <span className="block font-display text-lg text-bone-50">{platform.label}</span>
                <span className="mt-1 block text-sm text-bone-400">{platform.blurb}</span>
              </span>
              <ArrowIcon className="h-5 w-5 shrink-0 text-bone-500 transition-transform group-hover:translate-x-1 group-hover:text-crimson-300" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
