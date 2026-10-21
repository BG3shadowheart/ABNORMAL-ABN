import { PLATFORMS } from '@/data/products';
import { CATALOG_HREF, FEATURED_LIMIT, ORDER_STEPS, STORE_DESCRIPTION, STORE_NAME } from '@/data/store';
import {
  getCatalogStats,
  getFeaturedProducts,
  getPlatformCounts,
  getProductsByPlatform,
} from '@/lib/catalog';
import { formatBdt, formatUsd } from '@/lib/format';
import { HScroll } from '@/components/hscroll';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { ProductCard } from '@/components/product-card';
import { SupportPanel } from '@/components/support-panel';
import { ArrowIcon, LinkButton, SectionHeading } from '@/components/ui';

export function Home() {
  const stats = getCatalogStats();
  const counts = getPlatformCounts();
  const featured = getFeaturedProducts(FEATURED_LIMIT);

  return (
    <>
      {/* ------------------------------------------------------------ */}
      {/* Top of the page                                               */}
      {/* ------------------------------------------------------------ */}
      <section className="shell home-hero">
        <div className="max-w-xl">
          <h1 className="font-display text-[clamp(2.2rem,5.6vw,3.6rem)] font-semibold leading-[1.08] text-bone-50">
            Products for PC, Android and iOS
          </h1>
          <p className="mt-5 text-base leading-relaxed text-bone-300 sm:text-lg">
            {STORE_DESCRIPTION}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href={CATALOG_HREF} className="!px-6 !py-3.5">
              See all products
              <ArrowIcon className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/payments" variant="ghost" className="!px-6 !py-3.5">
              How to pay
            </LinkButton>
          </div>

          <p className="mt-6 text-sm text-bone-400">
            {stats.products} products
            {stats.lowestUsd !== null ? (
              <>
                {' · '}prices from {formatUsd(stats.lowestUsd)}
                {stats.lowestBdt !== null ? ` / ${formatBdt(stats.lowestBdt)}` : ''}
              </>
            ) : null}
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Rows of products — scroll sideways                            */}
      {/* ------------------------------------------------------------ */}
      <HScroll
        title="Featured"
        description="A few good places to start."
        href={CATALOG_HREF}
        hrefLabel={`All ${stats.products} products`}
      >
        {featured.map((product, index) => (
          <div key={product.slug} className="hscroll__item">
            <ProductCard product={product} priority={index < 3} />
          </div>
        ))}
      </HScroll>

      {PLATFORMS.map((platform) => (
        <HScroll
          key={platform.id}
          title={platform.label}
          description={platform.blurb}
          href={platform.href}
          hrefLabel={`See all ${counts[platform.id]}`}
        >
          {getProductsByPlatform(platform.id).map((product) => (
            <div key={product.slug} className="hscroll__item">
              <ProductCard product={product} />
            </div>
          ))}
        </HScroll>
      ))}

      {/* ------------------------------------------------------------ */}
      {/* How ordering works                                            */}
      {/* ------------------------------------------------------------ */}
      <section className="shell home-block">
        <SectionHeading
          title="How ordering works"
          description={`Four steps. No account, and ${STORE_NAME} never asks for your PIN or password.`}
        />
        <ol className="row-scroll row-scroll--4 mt-6">
          {ORDER_STEPS.map((step, index) => (
            <li key={step.title} className="panel-quiet p-5">
              <span className="step-number">{index + 1}</span>
              <h3 className="mt-3 font-display text-base text-bone-50">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-400">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Payments + support                                            */}
      {/* ------------------------------------------------------------ */}
      <section className="shell home-block">
        <SectionHeading
          title="Ways to pay"
          description="Copy the details, send the exact amount, then message us with your transaction ID."
        />
        <PaymentCards variant="row" className="mt-6" />
        <PaymentSafetyNote className="mt-4" />
      </section>

      <section className="shell home-block">
        <SectionHeading
          title="Talk to us"
          description="Not sure which plan to pick, or want to check a price first? Just ask."
        />
        <SupportPanel className="mt-6" />
      </section>
    </>
  );
}
