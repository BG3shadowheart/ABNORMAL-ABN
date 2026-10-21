import Link from 'next/link';
import type { Platform } from '@/data/products';
import { PLATFORMS } from '@/data/products';
import { getPlatformMeta, getProductsByPlatform, getStartingPrice, hasLifetimeOption } from '@/lib/catalog';
import { formatBdt, formatUsd } from '@/lib/format';
import { CatalogExplorer } from '@/components/catalog-explorer';
import { ArrowIcon } from '@/components/ui';

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-bone-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-bone-100">
                {item.label}
              </Link>
            ) : (
              <span className="text-bone-300">{item.label}</span>
            )}
            {index < items.length - 1 ? <span aria-hidden="true">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PlatformPageView({ platform }: { platform: Platform }) {
  const meta = getPlatformMeta(platform);
  const products = getProductsByPlatform(platform);
  const otherPlatforms = PLATFORMS.filter((item) => item.id !== platform);
  const lifetimeCount = products.filter(hasLifetimeOption).length;

  const cheapest = products
    .map((product) => getStartingPrice(product))
    .filter((value): value is NonNullable<typeof value> => value !== null)
    .sort((a, b) => (a.usd ?? Infinity) - (b.usd ?? Infinity))[0];

  const lowest =
    cheapest?.usd !== undefined
      ? formatUsd(cheapest.usd)
      : cheapest?.bdt !== undefined
        ? formatBdt(cheapest.bdt)
        : null;

  return (
    <>
      <section className="shell page-top">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: meta.label }]} />

        <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight text-bone-50">
          {meta.label} products
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone-300">{meta.intro}</p>
        <p className="mt-4 text-sm text-bone-400">
          {products.length} {products.length === 1 ? 'product' : 'products'}
          {lowest ? ` · from ${lowest}` : ''}
          {lifetimeCount > 0 ? ` · ${lifetimeCount} with a lifetime option` : ''}
        </p>
      </section>

      <section id="catalog" className="shell scroll-mt-24 pb-16">
        <CatalogExplorer products={products} showPlatformFilter={false} />
      </section>

      <section className="shell pb-16">
        <h2 className="font-display text-xl text-bone-50">Looking for something else?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {otherPlatforms.map((item) => (
            <Link key={item.id} href={item.href} className="panel group flex items-center justify-between gap-4 p-5 transition-colors hover:border-crimson-500">
              <span>
                <span className="block font-display text-lg text-bone-50">{item.label}</span>
                <span className="mt-1 block text-sm text-bone-400">{item.blurb}</span>
              </span>
              <ArrowIcon className="h-5 w-5 shrink-0 text-bone-500 transition-transform group-hover:translate-x-1 group-hover:text-crimson-300" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
