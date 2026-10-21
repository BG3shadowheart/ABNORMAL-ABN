'use client';

import { useMemo, useState } from 'react';
import { PLATFORMS, PLATFORM_LABEL, type Platform, type Product } from '@/data/products';
import {
  DURATION_FILTERS,
  SORT_OPTIONS,
  filterProducts,
  type DurationFilterId,
  type SortId,
} from '@/lib/catalog';
import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { ArrowIcon } from '@/components/ui';

type PlatformOption = Platform | 'all';

export function CatalogExplorer({
  products,
  initialPlatform = 'all',
  showPlatformFilter = true,
  id,
  className = '',
  /**
   * Show at most this many results, with a link to the full catalogue. The
   * home page uses a small number so the search sits above a few sample
   * products instead of a grid that needs its own scrolling.
   */
  limit,
}: {
  products: Product[];
  initialPlatform?: PlatformOption;
  showPlatformFilter?: boolean;
  id?: string;
  className?: string;
  limit?: number;
}) {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<PlatformOption>(initialPlatform);
  const [duration, setDuration] = useState<DurationFilterId>('all');
  const [sort, setSort] = useState<SortId>('featured');

  const results = useMemo(
    () => filterProducts(products, { query, platform, duration, sort }),
    [products, query, platform, duration, sort],
  );

  const platformOptions: { id: PlatformOption; label: string; count: number }[] = [
    { id: 'all', label: 'All platforms', count: products.length },
    ...PLATFORMS.map((item) => ({
      id: item.id as PlatformOption,
      label: item.label,
      count: products.filter((product) => product.platform === item.id).length,
    })),
  ];

  const filtersActive = query.trim() !== '' || platform !== 'all' || duration !== 'all';
  const shown = typeof limit === 'number' ? results.slice(0, limit) : results;
  const hidden = results.length - shown.length;

  const clearFilters = () => {
    setQuery('');
    setPlatform(initialPlatform);
    setDuration('all');
    setSort('featured');
  };

  const activePlatformLabel =
    platform === 'all' ? 'all platforms' : PLATFORM_LABEL[platform as Platform];

  return (
    <div id={id} className={`scroll-mt-24 ${className}`}>
      <div className="panel p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div role="search">
            <label htmlFor="catalog-search" className="field-label">
              Search
            </label>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-bone-500">
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                  <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m13.2 13.2 3.3 3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try DRIP, PATO, proxy or bundle"
                className="field pl-10"
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label htmlFor="catalog-duration" className="field-label">
              Plan length
            </label>
            <select
              id="catalog-duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value as DurationFilterId)}
              className="field mt-2"
            >
              {DURATION_FILTERS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="catalog-sort" className="field-label">
              Sort by
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortId)}
              className="field mt-2"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showPlatformFilter ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-700 pt-4">
            {platformOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPlatform(option.id)}
                aria-pressed={platform === option.id}
                className="filter-pill"
              >
                {option.label}
                <span className="text-xs text-bone-500">{option.count}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-bone-400" aria-live="polite">
          {hidden > 0 ? (
            <>
              Showing {shown.length} of {results.length}
            </>
          ) : (
            <>{results.length}</>
          )}{' '}
          {results.length === 1 ? 'product' : 'products'}
          {platform === 'all' ? '' : ` on ${activePlatformLabel}`}
          {query.trim() ? (
            <>
              {' '}
              for <span className="text-bone-100">“{query.trim()}”</span>
            </>
          ) : null}
        </p>

        {filtersActive ? (
          <button type="button" onClick={clearFilters} className="btn btn-ghost !px-4 !py-2 !text-xs">
            Clear filters
          </button>
        ) : null}
      </div>

      {results.length > 0 ? (
        <>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((product, index) => (
              <ProductCard key={product.slug} product={product} priority={index < 3} />
            ))}
          </div>

          {hidden > 0 ? (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <p className="text-sm text-bone-400">
                {hidden} more {hidden === 1 ? 'product' : 'products'} in the full catalog
              </p>
              <Link href="/products" className="btn btn-primary !px-5 !py-2.5 !text-[0.82rem]">
                Browse all {results.length} products
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </>
      ) : (
        <div className="panel mt-5 flex flex-col items-center gap-3 p-10 text-center">
          <h3 className="font-display text-lg text-bone-50">Nothing matches that</h3>
          <p className="max-w-md text-sm text-bone-400">
            Try a shorter search, pick another platform, or clear the filters to see everything.
          </p>
          <button type="button" onClick={clearFilters} className="btn btn-primary mt-2">
            Show every product
          </button>
        </div>
      )}
    </div>
  );
}
