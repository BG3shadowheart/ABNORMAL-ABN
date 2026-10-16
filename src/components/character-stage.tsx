'use client';

import { useEffect, useRef, useState } from 'react';
import { DEFAULT_THEME, THEME_IDS, isTheme, type ThemeId } from '@/lib/themes';
import type { LocalArtCollection } from '@/lib/local-art';

/**
 * The character that stands behind the page. One stage for the whole site:
 *
 *  - Every element (theme) has its own "slot". Only the slot of the section you
 *    are looking at is visible; the others wait invisibly, already loaded, so a
 *    swap is a clean slide-and-fade and never a pop-in.
 *  - Animation uses only opacity + transform (the two things the GPU can do
 *    without repainting), no blur or drop-shadow filters on the big artwork.
 *  - Desktop: the character drifts gently with the mouse and with scroll
 *    (soft parallax), and dims once you leave the hero so text stays readable.
 *  - Phone: no parallax, no extra loops. Just the active character, using the
 *    small `.mobile.webp` file when one exists.
 *  - When an element has several pictures (anemo.webp, anemo2.webp ...) a
 *    random one is shown on every visit, and a different one each time you
 *    come back to that element.
 */
export function CharacterStage({ local }: { local: LocalArtCollection }) {
  const [active, setActive] = useState<ThemeId>(DEFAULT_THEME);
  const [mounted, setMounted] = useState<ThemeId[]>([DEFAULT_THEME]);
  const [desktop, setDesktop] = useState(false);
  const [variant, setVariant] = useState<Partial<Record<ThemeId, number>>>({});
  const [ready, setReady] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const previous = useRef<ThemeId>(DEFAULT_THEME);

  // Pick a random picture for every element on each visit. Images are only
  // rendered after this runs, so the first one you see is already the random one.
  useEffect(() => {
    const picks: Partial<Record<ThemeId, number>> = {};
    for (const theme of THEME_IDS) {
      const count = local[theme]?.length ?? 0;
      if (count > 1) picks[theme] = Math.floor(Math.random() * count);
    }
    setVariant(picks);
    setReady(true);
  }, [local]);

  // Follow <html data-theme>, which ThemeController updates while you scroll.
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

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Keep the active slot mounted. On desktop, warm up all the others once the
  // page is idle so the first swap to each is instant; on phones keep only the
  // current one (and briefly the last one, so it can fade out).
  useEffect(() => {
    setMounted((list) => (list.includes(active) ? list : [...list, active]));

    let timer: number | undefined;
    if (!desktop) {
      timer = window.setTimeout(() => setMounted([active]), 1100);
    }
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [active, desktop]);

  useEffect(() => {
    if (!desktop) return;
    let cancelled = false;
    const warm = () => {
      if (!cancelled) setMounted([...THEME_IDS]);
    };
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const handle = idle ? idle(warm, { timeout: 3500 }) : window.setTimeout(warm, 2200);
    return () => {
      cancelled = true;
      if (idle) (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(handle);
      else window.clearTimeout(handle);
    };
  }, [desktop]);

  // Each time you leave an element, quietly line up its next picture.
  useEffect(() => {
    const left = previous.current;
    previous.current = active;
    if (left === active) return;
    const options = local[left] ?? [];
    if (options.length < 2) return;
    const timer = window.setTimeout(() => {
      setVariant((current) => {
        // A different picture from the one just shown.
        const now = current[left] ?? 0;
        const next = (now + 1 + Math.floor(Math.random() * (options.length - 1))) % options.length;
        const art = options[next];
        const warmUp = new Image();
        warmUp.decoding = 'async';
        warmUp.src = (!desktop && art.mobileUrl) || art.url;
        return { ...current, [left]: next };
      });
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [active, local, desktop]);

  // Desktop only: soft parallax + dimming, driven by ONE requestAnimationFrame
  // loop that sleeps as soon as everything has settled.
  useEffect(() => {
    if (!desktop) return;
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let x = 0;
    let y = 0;
    let opacity = 1;
    let running = false;
    let raf = 0;

    const targetOpacity = () => {
      const h = window.innerHeight;
      const t = Math.min(1, Math.max(0, (window.scrollY - h * 0.25) / (h * 0.6)));
      return 1 - t * 0.78;
    };

    const tick = () => {
      const tx = mouseX * 18;
      const ty = mouseY * 10 - Math.min(window.scrollY, 1600) * 0.035;
      const to = targetOpacity();
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      opacity += (to - opacity) * 0.08;
      frame.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      stage.style.opacity = opacity.toFixed(3);
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(to - opacity) * 100 > 0.15) {
        raf = window.requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };
    const wake = () => {
      if (running) return;
      running = true;
      raf = window.requestAnimationFrame(tick);
    };
    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
      wake();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    wake();
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
      window.cancelAnimationFrame(raf);
      frame.style.transform = '';
      stage.style.opacity = '';
    };
  }, [desktop]);

  return (
    <div ref={stageRef} className="stage" aria-hidden="true">
      <div ref={frameRef} className="stage-frame">
        {THEME_IDS.map((theme) => {
          const options = local[theme] ?? [];
          const art = options.length ? options[(variant[theme] ?? 0) % options.length] : undefined;
          const on = theme === active;
          const render = ready && !!art && mounted.includes(theme);
          return (
            <div key={theme} className={`stage-slot stage-${theme}`} data-on={on ? 'true' : 'false'}>
              <div className="stage-aura" />
              <div className="stage-ring" />
              <div className="stage-ring stage-ring--inner" />
              <div className="stage-bob">
                {render && art ? (
                  <picture>
                    {art.mobileUrl ? (
                      <source media="(max-width: 1023px)" srcSet={art.mobileUrl} type="image/webp" />
                    ) : null}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={art.url}
                      className="stage-img"
                      src={art.url}
                      alt=""
                      decoding="async"
                      loading="eager"
                      fetchPriority={on ? 'high' : 'low'}
                      draggable={false}
                    />
                  </picture>
                ) : null}
              </div>
              {art?.artist && on ? (
                <a className="stage-credit" href={art.link} target="_blank" rel="noopener noreferrer">
                  Art: {art.artist}
                </a>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
