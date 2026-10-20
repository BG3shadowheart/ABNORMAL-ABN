'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_LINKS, CATALOG_HREF, STORE_NAME_KANJI } from '@/data/store';
import { Logo } from '@/components/logo';
import { ArrowIcon } from '@/components/ui';
import { Magnetic } from '@/components/prestige/magnetic';
import { StoreClock } from '@/components/prestige/clock';

export function SiteHeader({ productCount }: { productCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed inset-x-0 top-0 z-50" data-menu={open ? 'open' : 'closed'}>
      {/* crimson hairline + the live scroll bar sits right above it */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-crimson-600/70 to-transparent" />

      <div
        className={`site-header__bar transition-all duration-500 ${
          scrolled
            ? 'border-b border-ink-700/80 bg-ink-950/85 backdrop-blur-xl shadow-[0_18px_50px_-35px_rgba(0,0,0,1)]'
            : 'border-b border-transparent bg-gradient-to-b from-ink-950/90 to-transparent'
        }`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
          <Link
            href="/"
            aria-label={`${STORE_NAME_KANJI} — home`}
            className="logo-link group flex items-center transition-opacity hover:opacity-100"
          >
            <Logo />
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className="nav-link"
                  data-active={active ? 'true' : 'false'}
                >
                  <span className="nav-link__dot" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <StoreClock className="hidden xl:inline-flex" />
            <span className="chip chip-live font-mono">
              <span className="chip-live__dot" aria-hidden="true" />
              {productCount} live
            </span>
            <Magnetic strength={5}>
              <Link href={CATALOG_HREF} className="btn btn-primary btn-browse !px-4 !py-2.5 !text-[0.8rem]">
                Browse all products
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="menu-toggle btn btn-ghost !px-3 !py-2.5 lg:hidden"
          >
            <span className="relative flex h-4 w-5 flex-col justify-between">
              <span
                className={`h-[2px] w-full rounded bg-current transition-transform duration-300 ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[2px] w-full rounded bg-current transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`h-[2px] w-full rounded bg-current transition-transform duration-300 ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      <div id="mobile-navigation" className="mobile-nav lg:hidden" data-open={open ? 'true' : 'false'}>
        <nav aria-label="Mobile navigation" className="shell flex flex-col gap-1.5 py-8">
          {NAV_LINKS.map((link, index) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className="mobile-nav__link"
                data-active={active ? 'true' : 'false'}
                style={{ transitionDelay: open ? `${90 + index * 55}ms` : '0ms' }}
              >
                <span className="mobile-nav__index font-mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mobile-nav__label">{link.label}</span>
                <ArrowIcon className="mobile-nav__arrow h-5 w-5" />
              </Link>
            );
          })}

          <Link
            href={CATALOG_HREF}
            className="btn btn-primary mt-6 !py-4"
            style={{ transitionDelay: open ? '440ms' : '0ms' }}
          >
            Browse all {productCount} products
            <ArrowIcon className="h-4 w-4" />
          </Link>

          <div className="mobile-nav__foot">
            <StoreClock />
            <span className="font-mono">{STORE_NAME_KANJI} · ABNORMAL</span>
          </div>
        </nav>
      </div>
    </header>
  );
}
