import Link from 'next/link';
import type { Product } from '@/data/products';
import { PLATFORM_LABEL } from '@/data/products';
import { getStartingPrice, hasLifetimeOption } from '@/lib/catalog';
import { ProductVisual } from '@/components/product-visual';
import { PricePair } from '@/components/ui';

/**
 * One product. The whole card is a single link, so there is one clear thing to
 * tap. Price and plan length are the two facts a buyer looks for first.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const starting = getStartingPrice(product);
  const lifetime = hasLifetimeOption(product);
  const plans = product.prices.length;

  return (
    <article className="product-card group">
      <div className="art-frame aspect-16/10 w-full">
        <ProductVisual product={product} priority={priority} context="card" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-bone-400">
          {PLATFORM_LABEL[product.platform]}
          {lifetime ? ' · Lifetime available' : ''}
        </p>

        <h3 className="mt-1 font-display text-base leading-snug text-bone-50">
          <Link href={`/products/${product.slug}`} className="product-card__link">
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-bone-400">{product.summary}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <div className="text-xs text-bone-500">
              {starting ? `From, ${starting.duration}` : 'Price'}
            </div>
            <div className="mt-0.5 text-[1.05rem] font-semibold">
              {starting ? (
                <PricePair usd={starting.usd} bdt={starting.bdt} />
              ) : (
                <span className="text-bone-400">Ask support</span>
              )}
            </div>
          </div>
          <span className="text-xs text-bone-500">
            {plans} {plans === 1 ? 'plan' : 'plans'}
          </span>
        </div>
      </div>
    </article>
  );
}
