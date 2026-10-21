'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_THEME, isTheme, type ThemeId } from '@/lib/themes';
import type { LocalArtCollection } from '@/lib/local-art';
import { THEME_IDS } from '@/lib/themes';

/**
 * The picture behind the top of each page.
 *
 * Every page has its own character. It sits behind the first screen only and
 * scrolls away with the page, so it never gets in the way of text further down.
 * When a page has more than one picture, a random one is shown on each visit.
 */
export function CharacterStage({ local }: { local: LocalArtCollection }) {
  const [active, setActive] = useState<ThemeId>(DEFAULT_THEME);
  const [picks, setPicks] = useState<Partial<Record<ThemeId, number>>>({});
  const [ready, setReady] = useState(false);

  // One random picture per page-colour, chosen once per visit.
  useEffect(() => {
    const next: Partial<Record<ThemeId, number>> = {};
    for (const theme of THEME_IDS) {
      const count = local[theme]?.length ?? 0;
      if (count > 1) next[theme] = Math.floor(Math.random() * count);
    }
    setPicks(next);
    setReady(true);
  }, [local]);

  // Follow <html data-theme>, which ThemeSync updates on every page change.
  useEffect(() => {
    const html = document.documentElement;
    const read = () => {
      const value = html.dataset.theme;
      if (isTheme(value)) setActive(value);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const options = local[active] ?? [];
  const art = options.length ? options[(picks[active] ?? 0) % options.length] : undefined;

  return (
    <div className="stage">
      {ready && art ? (
        <>
          <picture key={art.url} aria-hidden="true">
            {art.mobileUrl ? (
              <source media="(max-width: 1023px)" srcSet={art.mobileUrl} type="image/webp" />
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="stage-img" src={art.url} alt="" decoding="async" draggable={false} />
          </picture>
          {art.artist ? (
            <a className="stage-credit" href={art.link} target="_blank" rel="noopener noreferrer">
              Art: {art.artist}
            </a>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
