'use client';

import { useEffect } from 'react';
import { STORE_NAME, STORE_NAME_KANJI, STORE_TAGLINE } from '@/data/store';

/**
 * First-visit curtain. The markup is always server-rendered, but it is only
 * displayed when the boot script in <head> has set `data-intro="1"` on <html>
 * (once per browser session). The animation is pure CSS and ends by itself, so:
 *
 *  - returning visitors never see a flash,
 *  - a visitor without JavaScript still gets fully readable content after the
 *    curtain, because it never intercepts pointer events and auto-hides,
 *  - "reduce motion" visitors skip it entirely.
 */
export function SiteIntro() {
  useEffect(() => {
    const root = document.documentElement;
    // `?intro=1` replays the curtain (handy for previewing it any time).
    if (new URLSearchParams(window.location.search).get('intro') === '1') {
      root.dataset.intro = '1';
    }
    if (root.dataset.intro !== '1') return;

    const timer = window.setTimeout(() => {
      delete root.dataset.intro;
      try {
        sessionStorage.setItem('abn-intro-seen', '1');
      } catch {
        /* private mode – the curtain simply shows again next time */
      }
    }, 2050);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="site-intro" aria-hidden="true">
      <span className="site-intro__panel site-intro__panel--top" />
      <span className="site-intro__panel site-intro__panel--bottom" />

      <div className="site-intro__core">
        <span className="site-intro__mark">
          <span className="site-intro__frame" />
          <span className="site-intro__kanji">{STORE_NAME_KANJI}</span>
        </span>
        <span className="site-intro__name">{STORE_NAME}</span>
        <span className="site-intro__bar">
          <i />
        </span>
        <span className="site-intro__tag">{STORE_TAGLINE}</span>
      </div>
    </div>
  );
}
