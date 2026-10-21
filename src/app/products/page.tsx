import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/platform-page';
import { CatalogExplorer } from '@/components/catalog-explorer';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { SupportPanel } from '@/components/support-panel';
import { SectionHeading } from '@/components/ui';
import { getAllProducts } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'All products',
  description:
    'Every product in the store. Search by name, filter by platform or plan length, and sort by price.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <>
      <section className="shell page-top">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'All products' }]} />

        <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight text-bone-50">
          All products
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone-300">
          {products.length} products in total. Search by name, filter by platform or plan length, and
          sort by price. Open any product to see all of its plans.
        </p>
      </section>

      <section className="shell pb-16">
        <CatalogExplorer products={products} />
      </section>

      <section className="shell home-block">
        <SectionHeading
          title="Ways to pay"
          description="Copy the details, send the exact amount, then message us with your transaction ID."
        />
        <PaymentCards variant="row" className="mt-6" />
        <PaymentSafetyNote className="mt-4" />
      </section>

      <section className="shell home-block">
        <SectionHeading title="Talk to us" description="Questions about a plan or a price? Ask before you pay." />
        <SupportPanel className="mt-6" />
      </section>
    </>
  );
}
