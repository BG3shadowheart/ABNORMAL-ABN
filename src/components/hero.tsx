import fs from 'node:fs';
import type { CSSProperties } from 'react';
import path from 'node:path';
import Link from 'next/link';
import {
  CATALOG_HREF,
  STORE_DESCRIPTION,
  STORE_NAME,
  STORE_NAME_KANJI,
} from '@/data/store';
import { getAllProducts, getCatalogStats } from '@/lib/catalog';
import { formatBdt, formatUsd } from '@/lib/format';
import { ArrowIcon, LinkButton } from '@/components/ui';
import { HeroSpotlight } from '@/components/prestige/pointer';
import { CountUp } from '@/components/prestige/count-up';
import { Magnetic } from '@/components/prestige/magnetic';
import { Marquee } from '@/components/prestige/marquee';

/** Drop public/art/hero.jpg (or .png/.webp/.avif) in and it replaces the generated hero art. */
function findHeroImage(): string | null {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp', 'avif']) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'art', `hero.${ext}`))) return `/art/hero.${ext}`;
  }
  return null;
}

export function Hero() {
  const heroImage = findHeroImage();
  const stats = getCatalogStats();
  const products = getAllProducts();
  const rail = products.slice(0, 12);

  return (
    <section data-home className="home-hero relative isolate h-[100svh] overflow-hidden">
      {heroImage ? (
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
        </div>
      ) : null}

      {/* Mouse-tracked light + giant kanji watermark, both pure decoration. */}
      <HeroSpotlight />
      <div className="hero-watermark" aria-hidden="true">
        <span>{STORE_NAME_KANJI}</span>
      </div>
      <div className="hero-frame" aria-hidden="true">
        <span className="hero-frame__corner hero-frame__corner--tl" />
        <span className="hero-frame__corner hero-frame__corner--tr" />
        <span className="hero-frame__corner hero-frame__corner--bl" />
        <span className="hero-frame__corner hero-frame__corner--br" />
      </div>

      {/* vertical kanji accent (desktop) */}
      <div aria-hidden="true" className="hero-spine">
        <span className="hero-spine__label">{STORE_NAME_KANJI} · PREMIUM PRODUCTS</span>
        <span className="hero-spine__line" />
      </div>

      <div className="shell relative flex h-full flex-col">
        <div className="hero-body flex flex-1 flex-col justify-center pb-1 pt-24 sm:pt-28">
          <div className="hero-copy">
            <span className="hero-badge">
              <span className="hero-badge__pulse" aria-hidden="true" />
              <span className="hero-badge__text">Live catalog</span>
              <span className="hero-badge__rule" aria-hidden="true" />
              <span className="font-mono">{stats.products} products</span>
              <span className="hero-badge__rule hero-badge__rule--end" aria-hidden="true" />
              <span className="font-mono">USD / BDT</span>
            </span>

            <h1
              className="hero-title"
              aria-label="Premium products for PC, Android and iOS"
            >
              <span className="hero-line" aria-hidden="true">
                <span className="hero-word" style={{ '--i': 0 } as CSSProperties}>
                  <span className="hero-word__in">
                    <em className="hero-serif">Premium</em>
                  </span>
                </span>{' '}
                <span className="hero-word" style={{ '--i': 1 } as CSSProperties}>
                  <span className="hero-word__in">products</span>
                </span>
              </span>
              <span className="hero-line hero-line--accent" aria-hidden="true">
                <span className="hero-line__in">
                  <span className="hero-grad">for PC · Android · iOS</span>
                </span>
              </span>
            </h1>

            <p className="hero-desc">
              <span className="hero-desc__long">{STORE_DESCRIPTION}</span>
              <span className="hero-desc__short">
                Hand-picked PC, Android and iOS builds with fixed prices in USD and BDT —
                confirmed by a real person before you pay.
              </span>
            </p>

            <div className="hero-actions">
              <Magnetic strength={7}>
                <LinkButton href={CATALOG_HREF} className="!px-7 !py-4 !text-[0.95rem]">
                  Explore products
                  <ArrowIcon className="h-4 w-4" />
                </LinkButton>
              </Magnetic>
              <Magnetic strength={5}>
                <LinkButton
                  href="/payments"
                  variant="ghost"
                  className="!px-6 !py-4 !text-[0.9rem]"
                >
                  Payment methods
                </LinkButton>
              </Magnetic>
              <span className="hero-note">
                <span className="hero-note__line" aria-hidden="true" />
                {STORE_NAME} · {stats.products} products ·{' '}
                {stats.lowestUsd !== null ? `from ${formatUsd(stats.lowestUsd)}` : 'USD & BDT pricing'}
              </span>
            </div>
          </div>
        </div>

        <div className="hero-bottom">
          <dl className="hero-stats">
            <HeroStat value={stats.products} label="Products listed" />
            <HeroStat value={stats.platforms} label="Platforms" />
            <HeroStat value={stats.durationLabels} label="Durations" />
            <HeroStat value={stats.lifetimeProducts} label="With lifetime" />
          </dl>

          <p className="hero-lowest">
            Lowest listed price{' '}
            <span className="font-mono text-bone-300">
              {stats.lowestUsd !== null ? formatUsd(stats.lowestUsd) : '—'}
            </span>
            {stats.lowestBdt !== null ? (
              <>
                {' '}
                / <span className="font-mono text-bone-300">{formatBdt(stats.lowestBdt)}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      {/* Full-bleed ticker along the bottom edge of the screen. */}
      <div className="hero-rail">
        <div className="shell hero-rail__inner">
          <span className="hero-rail__label">
            <i aria-hidden="true" />
            Index
          </span>
          <Marquee speed={58} className="hero-rail__marquee">
            {rail.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="hero-rail__item">
                <span>{product.name}</span>
                <span className="hero-rail__arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </Marquee>
          <Link href={CATALOG_HREF} className="hero-rail__all">
            <span>All {stats.products}</span>
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="hero-stat">
      <dt className="hero-stat__value">
        <CountUp value={value} />
      </dt>
      <dd className="hero-stat__label">
        <span aria-hidden="true" className="hero-stat__tick" />
        {label}
      </dd>
    </div>
  );
}
