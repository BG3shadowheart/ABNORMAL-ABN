import type { Metadata } from 'next';
import Link from 'next/link';

import { OrderSteps } from '@/components/order-steps';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { Breadcrumbs } from '@/components/platform-page';
import { ContactChecklist, SupportPanel } from '@/components/support-panel';
import { ArrowIcon, SectionHeading } from '@/components/ui';

export const metadata: Metadata = {
  title: 'How to pay',
  description:
    'Pay with bKash (Personal) +880 1629-835648, Nagad +880 1629-835648 or Binance account ID 1220374728. Copy the details and follow four simple steps.',
  alternates: { canonical: '/payments' },
};

const FAQ = [
  {
    question: 'How do I pay with bKash or Nagad?',
    answer:
      'Send the exact amount for your plan to the number above. Then send us the transaction ID on Discord, Telegram or WhatsApp so we can match it to your order.',
  },
  {
    question: 'Which currency do I send?',
    answer:
      'Every product shows its price in USD and BDT. bKash and Nagad are BDT transfers and Binance is for USD amounts. If you are not sure about the final amount, ask us before you send.',
  },
  {
    question: 'Where do I get my access?',
    answer:
      'On Discord, Telegram or WhatsApp, wherever you contacted us. We check your payment first and then deliver there, so keep the chat open.',
  },
  {
    question: 'What should I never share?',
    answer:
      'Your PIN, password, OTP or wallet private key. A payment never needs them, so if anyone asks, it is not us.',
  },
];

export default function PaymentsPage() {
  return (
    <>
      <section className="shell page-top">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'How to pay' }]} />

        <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight text-bone-50">
          How to pay
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone-300">
          Pick a product and a plan, send the exact amount, then fill in the order form with your
          transaction ID. After that, send us the order summary and a screenshot of your payment. A
          person on our team checks every payment by hand before delivering.
        </p>
      </section>

      <section className="shell pb-12">
        <PaymentCards />
        <PaymentSafetyNote className="mt-4" />
      </section>

      <section className="shell home-block">
        <SectionHeading title="How an order works" description="Four steps, and you always know what happens next." />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <OrderSteps />
          <ContactChecklist />
        </div>
      </section>

      <section className="shell home-block">
        <SectionHeading title="Common questions" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FAQ.map((item) => (
            <article key={item.question} className="panel-quiet p-5">
              <h3 className="font-display text-base text-bone-50">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-400">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell home-block">
        <SectionHeading
          title="Check with us before you pay"
          description="Send us the product name, the plan and the amount you are about to send. We will tell you if it is right."
          action={
            <Link href="/support" className="btn btn-ghost">
              Support
              <ArrowIcon className="h-4 w-4" />
            </Link>
          }
        />
        <SupportPanel className="mt-6" />
      </section>
    </>
  );
}
