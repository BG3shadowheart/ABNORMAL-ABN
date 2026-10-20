'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { lockScroll, unlockScroll } from '@/components/prestige/scroll-lock';

export type DropItem = {
  slug: string;
  name: string;
  platform: string;
  summary: string;
  price: string;
  from: string;
  image: string | null;
};

/**
 * "Featured drop" — a shelf that rises from the bottom edge.
 *
 * The home page is deliberately a single fixed screen, so the featured products
 * are not a section you scroll past: they are a drawer you pull up. The shelf
 * scrolls horizontally (wheel, drag, keyboard arrows) and closes on Esc, the
 * close button or a backdrop click. Any element with `data-drop-trigger` opens
 * it, which lets the desktop rail and the phone peek-strip share one panel.
 */
export function FeaturedDrop({ items }: { items: DropItem[] }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const opener = useRef<Element | null>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false, id: 0, captured: false });

  // Opening is delegated, so any trigger anywhere can pull the shelf up.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest?.('[data-drop-trigger]');
      if (!trigger) return;
      event.preventDefault();
      opener.current = trigger;
      setOpen(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    lockScroll();
    closeRef.current?.focus();
    const track = trackRef.current;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key === 'ArrowRight' && track) track.scrollBy({ left: 320, behavior: 'smooth' });
      if (event.key === 'ArrowLeft' && track) track.scrollBy({ left: -320, behavior: 'smooth' });
    };

    const onWheel = (event: WheelEvent) => {
      if (!track || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      const atStart = track.scrollLeft <= 0 && event.deltaY < 0;
      const atEnd = track.scrollLeft >= max - 1 && event.deltaY > 0;
      if (atStart || atEnd) return;
      event.preventDefault();
      track.scrollLeft += event.deltaY;
    };

    window.addEventListener('keydown', onKey);
    track?.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKey);
      track?.removeEventListener('wheel', onWheel);
      unlockScroll();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    return () => {
      const element = opener.current as HTMLElement | null;
      element?.focus?.();
    };
  }, [open]);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setProgress(max <= 0 ? 1 : Math.min(1, Math.max(0, track.scrollLeft / max)));
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || event.pointerType === 'touch') return;
    drag.current = { active: true, startX: event.clientX, startLeft: track.scrollLeft, moved: false, id: event.pointerId, captured: false };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !drag.current.active) return;
    const dx = event.clientX - drag.current.startX;

    if (!drag.current.moved && Math.abs(dx) > 6) {
      drag.current.moved = true;
      track.classList.add('is-dragging');
      // Capture only once a real drag has begun. Capturing on pointerdown
      // would retarget the following click away from the product link.
      try {
        track.setPointerCapture(event.pointerId);
        drag.current.captured = true;
      } catch {
        /* the pointer may already be gone – dragging still works without it */
      }
    }

    if (drag.current.moved) track.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = (event?: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (track && drag.current.captured && event) {
      try {
        track.releasePointerCapture(event.pointerId);
      } catch {
        /* already released */
      }
    }
    drag.current.active = false;
    drag.current.captured = false;
    track?.classList.remove('is-dragging');
  };

  // A drag must never be mistaken for a click on a product link.
  const onClickCapture = (event: ReactMouseEvent) => {
    if (!drag.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    drag.current.moved = false;
  };

  const count = items.length;

  return (
    <>
      {open ? (
        <div className="drop" role="dialog" aria-modal="true" aria-label="Featured drop">
          <button type="button" className="drop__backdrop" aria-label="Close featured drop" onClick={() => setOpen(false)} />
          <div className="drop__panel" ref={panelRef}>
            <div className="drop__head">
              <div>
                <span className="eyebrow">Featured drop · {String(count).padStart(2, '0')} builds</span>
                <h2 className="drop__title">This week&apos;s picks</h2>
                <p className="drop__sub">
                  Hand-picked from the catalog. Add one to your shortlist, or open it for every duration
                  and price.
                </p>
              </div>
              <button ref={closeRef} type="button" className="drop__close" onClick={() => setOpen(false)} aria-label="Close featured drop">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="drop__progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${Math.max(0.06, progress)})` }} />
            </div>

            <div
              className="drop__track"
              ref={trackRef}
              onScroll={onScroll}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onClickCapture={onClickCapture}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              tabIndex={0}
              aria-label="Featured products, scroll horizontally"
            >
              {items.map((item, index) => (
                <Link key={item.slug} href={`/products/${item.slug}`} className="drop__card">
                  <span className="drop__index font-mono">{String(index + 1).padStart(2, '0')}</span>
                  <span className="drop__art">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span className="drop__art-fallback">{item.name.slice(0, 3)}</span>
                    )}
                    <span className="drop__art-glow" aria-hidden="true" />
                  </span>
                  <span className="drop__platform">{item.platform}</span>
                  <span className="drop__name">{item.name}</span>
                  <span className="drop__summary">{item.summary}</span>
                  <span className="drop__foot">
                    <span>
                      <span className="drop__from">{item.from}</span>
                      <span className="drop__price font-mono">{item.price}</span>
                    </span>
                    <span className="drop__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </Link>
              ))}
              <Link href="/products" className="drop__card drop__card--all">
                <span className="drop__all-mark serif-accent">全</span>
                <span className="drop__all-title">The full catalog</span>
                <span className="drop__all-sub">Every product, every duration, every price.</span>
                <span className="drop__all-link">
                  Browse all
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </div>

            <p className="drop__hint">
              <span aria-hidden="true">← →</span> or drag to explore · Esc to close
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
