import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductVisual, getProductImages } from '@/components/product-visual';
import { ProductGallery } from '@/components/product-gallery';
import { HScroll } from '@/components/hscroll';
import { OrderSteps } from '@/components/order-steps';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { Breadcrumbs } from '@/components/platform-page';
import { PriceList } from '@/components/price-list';
import { ProductCard } from '@/components/product-card';
import { PurchaseForm } from '@/components/purchase-form';
import { ContactChecklist, SupportPanel } from '@/components/support-panel';
import { ArrowIcon, Chip, PlatformBadge, PricePair, SectionHeading } from '@/components/ui';
import { PLATFORM_LABEL } from '@/data/products';
import {
  getAllSlugs,
  getPlatformMeta,
  getProductBySlug,
  getRelatedProducts,
  getStartingPrice,
} from '@/lib/catalog';
import { formatPriceOption } from '@/lib/format';

/** Only the slugs that exist in the catalog are built — anything else is a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product not found' };
  }

  const priceLine = product.prices
    .map((price) => `${price.duration} ${formatPriceOption(price)}`)
    .join(' · ');

  return {
    title: `${product.name} — ${PLATFORM_LABEL[product.platform]} prices`,
    description: `${product.summary} Full price list: ${priceLine}. Place your order and confirm payment proof through Discord, Telegram or WhatsApp support.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${PLATFORM_LABEL[product.platform]}`,
      description: `${product.summary} ${priceLine}`,
      url: `/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const platform = getPlatformMeta(product.platform);
  const starting = getStartingPrice(product);
  const related = getRelatedProducts(product, 6);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary,
    category: PLATFORM_LABEL[product.platform],
    offers: product.prices.flatMap((price) => {
      const offers: Record<string, string | number>[] = [];
      if (typeof price.usd === 'number') {
        offers.push({
          '@type': 'Offer',
          name: price.duration,
          price: price.usd,
          priceCurrency: 'USD',
        });
      }
      if (typeof price.bdt === 'number') {
        offers.push({
          '@type': 'Offer',
          name: price.duration,
          price: price.bdt,
          priceCurrency: 'BDT',
        });
      }
      return offers;
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Static, owner-controlled data — no user input is interpolated here.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="shell page-top">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: platform.label, href: platform.href },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
          {/* picture + facts */}
          <div className="flex flex-col gap-5">
            <ProductGallery
              images={getProductImages(product)}
              name={product.name}
              badges={
                <>
                  <PlatformBadge platform={product.platform} />
                  {(product.tags ?? []).map((tag) => (
                    <Chip key={tag}>{tag}</Chip>
                  ))}
                </>
              }
              first={<ProductVisual product={product} priority context="detail" />}
            />

            <div className="panel p-5">
              <h2 className="font-display text-base text-bone-50">About this product</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-6 border-b border-ink-700 pb-3">
                  <dt className="text-bone-500">Platform</dt>
                  <dd className="text-right text-bone-100">{PLATFORM_LABEL[product.platform]}</dd>
                </div>
                <div className="flex items-start justify-between gap-6 border-b border-ink-700 pb-3">
                  <dt className="text-bone-500">Works on</dt>
                  <dd className="text-right text-bone-100">
                    {product.compatibility ?? platform.compatibility}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-6 border-b border-ink-700 pb-3">
                  <dt className="text-bone-500">Plans</dt>
                  <dd className="text-right text-bone-100">{product.prices.length}</dd>
                </div>
                <div className="flex items-start justify-between gap-6">
                  <dt className="text-bone-500">How you buy</dt>
                  <dd className="text-right text-bone-100">Through our team, by hand</dd>
                </div>
              </dl>

              {product.details && product.details.length > 0 ? (
                <ul className="mt-5 space-y-2 border-t border-ink-700 pt-4 text-sm text-bone-300">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-400" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {/* name + prices: first on phones so the name is never below the fold */}
          <div className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm text-bone-400">{PLATFORM_LABEL[product.platform]}</p>
            <h1 className="mt-2 font-display text-[clamp(1.8rem,4.2vw,2.7rem)] font-semibold leading-[1.1] text-bone-50">
              {product.name}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-bone-300">{product.summary}</p>
            {product.description ? (
              <p className="mt-3 text-sm leading-relaxed text-bone-400">{product.description}</p>
            ) : null}

            {starting ? (
              <div className="panel mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <div className="text-xs text-bone-500">From, {starting.duration}</div>
                  <div className="mt-1 text-2xl font-semibold">
                    <PricePair usd={starting.usd} bdt={starting.bdt} />
                  </div>
                </div>
                <a href="#purchase" className="btn btn-primary">
                  Order this
                  <ArrowIcon className="h-4 w-4" />
                </a>
              </div>
            ) : null}

            <div className="mt-5">
              <PriceList product={product} />
            </div>
          </div>
        </div>
      </section>

      <section id="purchase" className="shell home-block scroll-mt-24">
        <SectionHeading
          title={`Order ${product.name}`}
          description="Choose a plan, pick how you will pay and enter your transaction details. We check every order by hand."
        />

        <div className="mt-6">
          <PurchaseForm product={product} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <OrderSteps />
          <div className="flex flex-col gap-4">
            <ContactChecklist productName={product.name} />
            <PaymentSafetyNote />
          </div>
        </div>

        <h3 className="mt-10 font-display text-xl text-bone-50">Where to send your payment</h3>
        <PaymentCards variant="row" className="mt-4" />

        <h3 className="mt-10 font-display text-xl text-bone-50">Questions? Message us</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone-400">
          All three reach the same team. Mention <span className="text-bone-200">{product.name}</span>{' '}
          and the plan you want so nothing gets mixed up.
        </p>
        <SupportPanel productName={product.name} className="mt-4" />
      </section>

      {related.length > 0 ? (
        <HScroll
          title={`More ${platform.label} products`}
          href={platform.href}
          hrefLabel={`All ${platform.label} products`}
          className="pb-4"
        >
          {related.map((item) => (
            <div key={item.slug} className="hscroll__item">
              <ProductCard product={item} />
            </div>
          ))}
        </HScroll>
      ) : null}
    </>
  );
}
