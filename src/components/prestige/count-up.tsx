'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Counts up to a number the first time it scrolls into view (or immediately on
 * the home screen). The server renders the final value, so crawlers and
 * no-JavaScript visitors always see the real number; the animation only starts
 * on the client.
 */
export function CountUp({
  value,
  duration = 1100,
  className = '',
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || value <= 0) return;
    setDisplay(0);
  }, [value]);

  useEffect(() => {
    const node = ref.current;
    if (!node || value <= 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;

    let started = false;
    let raf = 0;
    let timer = 0;
    let snap = 0;

    const run = () => {
      started = true;
      const begin = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - begin) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplay(Math.max(0, Math.min(value, Math.round(value * eased))));
        if (progress < 1) raf = window.requestAnimationFrame(step);
      };
      raf = window.requestAnimationFrame(step);
      // Safety net: whatever happens to the frame loop, the real number wins.
      snap = window.setTimeout(() => setDisplay(value), duration + 450);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || started) continue;
          observer.disconnect();
          timer = window.setTimeout(run, 180);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.clearTimeout(snap);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}
