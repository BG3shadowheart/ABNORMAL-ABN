'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, type WheelEvent } from 'react';
import { PLATFORMS } from '@/data/products';
import { CATALOG_HREF, FEATURED_LIMIT } from '@/data/store';
import { getCatalogStats, getFeaturedProducts, getPlatformCounts, getProductsByPlatform } from '@/lib/catalog';
import type { LocalArtCollection } from '@/lib/local-art';
import { HScroll } from '@/components/hscroll';
import { PaymentCards, PaymentSafetyNote } from '@/components/payment-cards';
import { ProductCard } from '@/components/product-card';
import { SupportPanel } from '@/components/support-panel';
import { ArrowIcon, LinkButton } from '@/components/ui';

const PANELS = [
  { id: 'home', theme: 'dendro', art: 'dendro' },
  { id: 'pc', theme: 'electro', art: 'electro' },
  { id: 'android', theme: 'cryo', art: 'cryo' },
  { id: 'ios', theme: 'pyro', art: 'pyro' },
  { id: 'payments', theme: 'geo', art: 'geo' },
  { id: 'support', theme: 'anemo', art: 'anemo' },
] as const;

function PanelArt({ characters, theme }: { characters: LocalArtCollection; theme: (typeof PANELS)[number]['art'] }) {
  const art = characters[theme]?.[0];
  return art ? (
    <picture className="store-panel__art" aria-hidden="true">
      {art.mobileUrl ? <source media="(max-width: 767px)" srcSet={art.mobileUrl} type="image/webp" /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={art.url} alt="" decoding="async" draggable={false} />
    </picture>
  ) : null;
}

export function HomeDeck({ characters }: { characters: LocalArtCollection }) {
  const track = useRef<HTMLDivElement | null>(null);
  const activeIndex = useRef(-1);
  const stats = getCatalogStats();
  const counts = getPlatformCounts();
  const featured = getFeaturedProducts(FEATURED_LIMIT);

  const goTo = useCallback((index: number) => {
    const node = track.current;
    if (!node) return;
    const bounded = Math.max(0, Math.min(PANELS.length - 1, index));
    node.scrollTo({ left: bounded * node.clientWidth, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const sync = () => {
      const index = Math.max(0, Math.min(PANELS.length - 1, Math.round(node.scrollLeft / node.clientWidth)));
      if (index === activeIndex.current) return;
      activeIndex.current = index;
      const panel = PANELS[index];
      document.documentElement.dataset.theme = panel.theme;
      window.history.replaceState(null, '', index === 0 ? `${location.pathname}${location.search}` : `#${panel.id}`);
      window.dispatchEvent(new CustomEvent('abn:panelchange', { detail: panel.id }));
    };
    const start = PANELS.findIndex((panel) => panel.id === window.location.hash.slice(1));
    if (start > 0) node.scrollLeft = start * node.clientWidth;
    sync();
    node.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"], .hscroll__track')) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        goTo(activeIndex.current + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goTo(activeIndex.current - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(PANELS.length - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      window.removeEventListener('keydown', onKey);
    };
  }, [goTo]);

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    const shelf = (event.target as HTMLElement).closest<HTMLElement>('.hscroll__track');
    if (shelf) {
      if (Math.abs(event.deltaX) > 0 || (event.shiftKey && Math.abs(event.deltaY) > 0)) {
        event.preventDefault();
        shelf.scrollLeft += event.deltaX || event.deltaY;
      }
      if (event.defaultPrevented) return;
    }
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      goTo(activeIndex.current + (event.deltaY > 0 ? 1 : -1));
    }
  };

  return (
    <div className="store-deck">
      <div ref={track} className="store-deck__track" onWheel={onWheel} tabIndex={0} aria-label="Store sections">
        <section id="home" data-panel="home" className="store-panel store-panel--home">
          <PanelArt characters={characters} theme="dendro" />
          <div className="store-panel__intro">
            <h1>Products for PC, Android and iOS</h1>
            <p>Browse PC, Android and iOS products. Prices are listed up front. Pay by bKash, Nagad or Binance.</p>
            <div className="store-panel__actions">
              <LinkButton href={CATALOG_HREF}>See all 25 products <ArrowIcon className="h-4 w-4" /></LinkButton>
              <a className="store-panel__text-link" href="#payments">How to pay <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <HScroll title="Featured" description="Pick a starting point." href={CATALOG_HREF} hrefLabel={`All ${stats.products} products`} className="store-panel__shelf">
            {featured.map((product, index) => <div key={product.slug} className="hscroll__item"><ProductCard product={product} priority={index < 3} /></div>)}
          </HScroll>
        </section>

        {PLATFORMS.map((platform, position) => (
          <section key={platform.id} id={platform.id} data-panel={platform.id} className={`store-panel store-panel--${platform.id}`}>
            <PanelArt characters={characters} theme={PANELS[position + 1].art} />
            <div className="store-panel__heading">
              <div>
                <h2>{platform.label}</h2>
                <p>{platform.blurb}</p>
              </div>
              <Link className="store-panel__browse" href={platform.href}>Browse all {counts[platform.id]} <ArrowIcon className="h-4 w-4" /></Link>
            </div>
            <HScroll title={`${platform.label} products`} description={`${counts[platform.id]} options · prices shown on every card.`} href={platform.href} hrefLabel="Browse platform" className="store-panel__shelf store-panel__shelf--platform">
              {getProductsByPlatform(platform.id).map((product) => <div key={product.slug} className="hscroll__item"><ProductCard product={product} /></div>)}
            </HScroll>
          </section>
        ))}

        <section id="payments" data-panel="payments" className="store-panel store-panel--payments">
          <PanelArt characters={characters} theme="geo" />
          <div className="store-panel__heading">
            <div><h2>Payments</h2><p>Exact payment details, with a person checking every order.</p></div>
            <Link className="store-panel__browse" href="/payments">Payment guide <ArrowIcon className="h-4 w-4" /></Link>
          </div>
          <div className="store-panel__payment-content">
            <PaymentCards variant="row" />
            <PaymentSafetyNote className="mt-4" />
          </div>
        </section>

        <section id="support" data-panel="support" className="store-panel store-panel--support">
          <PanelArt characters={characters} theme="anemo" />
          <div className="store-panel__heading">
            <div><h2>Support</h2><p>Ask about the product, plan, price or payment before you send money.</p></div>
            <Link className="store-panel__browse" href="/support">More support details <ArrowIcon className="h-4 w-4" /></Link>
          </div>
          <SupportPanel className="store-panel__support-content" />
          <p className="store-panel__privacy">We never ask for your PIN, password, OTP or wallet private key.</p>
        </section>
      </div>
    </div>
  );
}
