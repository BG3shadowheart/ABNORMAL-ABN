'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { NAV_LINKS, CATALOG_HREF } from '@/data/store';
import { Logo } from '@/components/logo';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState('home');

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const sync = (event: Event) => setActivePanel((event as CustomEvent<string>).detail);
    window.addEventListener('abn:panelchange', sync);
    const initial = window.location.hash.slice(1);
    if (initial) setActivePanel(initial);
    return () => window.removeEventListener('abn:panelchange', sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const panelId = (href: string) => href === '/' ? 'home' : href.slice(1);
  const sectionHref = (href: string) => pathname === '/' ? `#${panelId(href)}` : href;
  const isActive = (href: string) => pathname === '/'
    ? activePanel === panelId(href)
    : href === '/' ? false : pathname === href || pathname.startsWith(`${href}/`);
  const choosePanel = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== '/') return;
    event.preventDefault();
    const id = panelId(href);
    const track = document.querySelector<HTMLElement>('.store-deck__track');
    const panel = document.getElementById(id);
    if (track && panel) {
      track.scrollTo({ left: panel.offsetLeft, behavior: 'smooth' });
      setOpen(false);
    }
  };

  return (
    <header className="site-header">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="ABNORMAL home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={sectionHref(link.href)}
              onClick={(event) => choosePanel(event, link.href)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className="nav-link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href={CATALOG_HREF} className="btn btn-primary !px-4 !py-2">
            All products
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="menu-toggle lg:hidden"
        >
          <span className="relative block h-3.5 w-5">
            <span className={`absolute left-0 h-0.5 w-full rounded bg-current transition-all ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-full rounded bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 h-0.5 w-full rounded bg-current transition-all ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </div>

      <div id="mobile-navigation" className="mobile-nav lg:hidden" hidden={!open}>
        <nav aria-label="Mobile navigation" className="shell flex flex-col py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={sectionHref(link.href)}
              onClick={(event) => choosePanel(event, link.href)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className="mobile-nav__link"
            >
              {link.label}
            </Link>
          ))}
          <Link href={CATALOG_HREF} className="btn btn-primary mt-3">
            All products
          </Link>
        </nav>
      </div>
    </header>
  );
}
