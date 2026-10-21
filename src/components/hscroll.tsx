'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * A titled row that scrolls sideways.
 *
 * - Touch, trackpad and shift + mouse wheel all work natively.
 * - On bigger screens, two round buttons next to the title move the row one
 *   page at a time. They switch off at either end.
 * - Cards snap into place, so nothing stops half-cut at the left edge.
 * - The row starts and ends in line with the rest of the page, but scrolls all
 *   the way to the edge of the screen.
 */
export function HScroll({
  title,
  description,
  href,
  hrefLabel,
  children,
  as: Tag = 'h2',
  className = '',
}: {
  title: string;
  description?: string;
  /** Optional "see all" link shown next to the arrows. */
  href?: string;
  hrefLabel?: string;
  children: ReactNode;
  as?: 'h2' | 'h3';
  className?: string;
}) {
  const track = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const node = track.current;
    if (!node) return;
    setCanPrev(node.scrollLeft > 4);
    setCanNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const node = track.current;
    if (!node) return;
    update();
    node.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    observer?.observe(node);
    return () => {
      node.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer?.disconnect();
    };
  }, [update]);

  const move = (direction: 1 | -1) => {
    const node = track.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.max(280, node.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <section className={`hrow ${className}`} aria-label={title}>
      <div className="shell hrow__head">
        <div className="min-w-0">
          <Tag className="font-display text-xl text-bone-50 sm:text-2xl">{title}</Tag>
          {description ? <p className="mt-1 text-sm text-bone-400">{description}</p> : null}
        </div>

        <div className="hrow__tools">
          {href ? (
            <Link href={href} className="text-link">
              {hrefLabel ?? 'See all'}
              <span aria-hidden="true"> →</span>
            </Link>
          ) : null}
          <button
            type="button"
            className="hrow__arrow"
            onClick={() => move(-1)}
            disabled={!canPrev}
            aria-label={`Scroll ${title} back`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m12 4-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="hrow__arrow"
            onClick={() => move(1)}
            disabled={!canNext}
            aria-label={`Scroll ${title} forward`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m8 4 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={track} className="hscroll__track" tabIndex={0} role="group" aria-label={`${title}, scroll sideways`}>
        {children}
      </div>
    </section>
  );
}
