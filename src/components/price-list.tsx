import type { Product } from '@/data/products';
import { durationHours, isLifetime } from '@/lib/format';
import { ArrowIcon, Chip, PricePair } from '@/components/ui';

/**
 * Every plan of one product, with its exact price.
 * Each row jumps to the order form on the same page.
 */
export function PriceList({ product }: { product: Product }) {
  const prices = [...product.prices].sort(
    (a, b) => durationHours(a.duration) - durationHours(b.duration),
  );

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-ink-700 px-5 py-4">
        <h2 className="font-display text-base text-bone-50">Plans and prices</h2>
        <span className="text-xs text-bone-500">
          {prices.length} {prices.length === 1 ? 'plan' : 'plans'}
        </span>
      </div>

      <ul className="divide-y divide-ink-700">
        {prices.map((price) => {
          const hourly = durationHours(price.duration) < 24;
          return (
            <li key={price.duration}>
              <a
                href="#purchase"
                className="group flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-ink-800"
              >
                <span className="flex items-center gap-3">
                  <span className="text-[0.95rem] font-semibold text-bone-50">{price.duration}</span>
                  {isLifetime(price.duration) ? <Chip tone="aura">Lifetime</Chip> : null}
                  {hourly ? <Chip>Hourly</Chip> : null}
                </span>

                <span className="flex items-center gap-4">
                  <PricePair usd={price.usd} bdt={price.bdt} className="text-[1.02rem] font-semibold" />
                  <ArrowIcon className="h-4 w-4 text-bone-500 transition-transform group-hover:translate-x-1 group-hover:text-crimson-300" />
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-ink-700 bg-ink-900 px-5 py-3.5 text-xs leading-relaxed text-bone-400">
        Prices are in USD and BDT. You pay through bKash, Nagad or Binance, and we sort the rest out
        with you.
      </div>
    </div>
  );
}
