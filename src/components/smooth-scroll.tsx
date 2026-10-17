'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Buttery desktop scrolling.
 *
 * - Runs ONLY on desktop-class devices (wide screen + mouse/trackpad) and only
 *   when the visitor has not asked for reduced motion. Phones and tablets keep
 *   their own native touch scrolling, which is already the best there is.
 * - It is real document scrolling underneath (no nested scroll box, no snap, no
 *   hijacked wheel events), so the scrollbar, Page Down, Space, Home/End, find
 *   in page and the browser's back/forward position all behave normally.
 * - Anchor links (#catalog, #payments ...) glide to their target.
 * - Anything inside a `[data-lenis-prevent]` element keeps native scrolling
 *   (use it on inner scroll boxes such as menus).
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia(
      '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );

    let lenis: Lenis | null = null;
    let frame = 0;
    let removeAnchors: (() => void) | null = null;

    const raf = (time: number) => {
      lenis?.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    const start = () => {
      if (lenis) return;
      lenis = new Lenis({
        // Lower = longer glide. 0.085 is soft but never feels laggy.
        lerp: 0.085,
        wheelMultiplier: 0.95,
        smoothWheel: true,
        syncTouch: false,
        anchors: false,
      });
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      frame = window.requestAnimationFrame(raf);

      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
        if (!anchor || anchor.target === '_blank') return;
        const url = new URL(anchor.href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
        if (!url.hash || url.hash === '#') return;
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        lenis?.scrollTo(target, { offset: -88, duration: 1.4 });
        window.history.pushState(null, '', url.hash);
      };
      document.addEventListener('click', onClick);
      removeAnchors = () => document.removeEventListener('click', onClick);
    };

    const stop = () => {
      window.cancelAnimationFrame(frame);
      removeAnchors?.();
      removeAnchors = null;
      lenis?.destroy();
      lenis = null;
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };

    const sync = () => (query.matches ? start() : stop());
    sync();
    query.addEventListener('change', sync);
    return () => {
      query.removeEventListener('change', sync);
      stop();
    };
  }, []);

  return null;
}
