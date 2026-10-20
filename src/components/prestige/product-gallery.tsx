'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { lockScroll, unlockScroll } from '@/components/prestige/scroll-lock';

export type GalleryImage = {
  src: string;
  alt: string;
  /** 'logo' keeps the padding tight, 'artwork' shows the full frame. */
  kind?: 'logo' | 'artwork';
};

/**
 * The product stage: a lit exhibition frame around the product artwork.
 *
 *  - the light follows the pointer across the frame (screen-blended sheen),
 *  - corner brackets, a catalogue number and a scanline shimmer make it feel
 *    mounted rather than dropped on the page,
 *  - clicking the frame opens a full-screen viewer (Esc closes, ← → move
 *    between real images, focus returns to the trigger afterwards),
 *  - thumbnails only appear when a product really has more than one asset, so
 *    nothing is invented for products with a single image.
 *
 * `first` is the server-rendered composite (ProductVisual) so the default view
 * keeps every product-specific detail — the viewer and thumbnails use the real
 * files returned by getProductImages().
 */
export function ProductGallery({
  images,
  first,
  name,
  label,
  badges,
}: {
  images: GalleryImage[];
  first: ReactNode;
  name: string;
  label?: string;
  badges?: ReactNode;
}) {
  const [view, setView] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const frameRef = useRef<HTMLButtonElement | null>(null);
  const frameBox = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const thumbs = images.length > 1 ? images : [];

  // The light inside the frame follows the pointer. Two CSS variables, no
  // layout work, and it simply does not run for reduced-motion visitors.
  useEffect(() => {
    const node = frameBox.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      node.style.setProperty('--gx', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
      node.style.setProperty('--gy', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
    };

    node.addEventListener('pointermove', onMove, { passive: true });
    return () => node.removeEventListener('pointermove', onMove);
  }, []);

  const openViewer = useCallback((index: number) => {
    setLightboxIndex(index);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => frameRef.current?.focus(), 40);
  }, []);

  const step = useCallback(
    (direction: number) => {
      setLightboxIndex((current) => {
        if (images.length === 0) return current;
        return (current + direction + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    lockScroll();
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [open, close, step]);

  const pick = (index: number) => {
    setView(index);
    setLightboxIndex(index);
  };

  const alternate = view > 0 ? images[view - 1] : null;
  const current = images[lightboxIndex] ?? images[0];

  return (
    <div className="gallery">
      <div className="gallery__frame panel" ref={frameBox}>
        <span className="gallery__brackets" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="gallery__scan" aria-hidden="true" />
        <span className="gallery__glow" aria-hidden="true" />
        <span className="gallery__index font-mono" aria-hidden="true">
          {label ?? 'PRODUCT'} · 01
        </span>

        <button
          ref={frameRef}
          type="button"
          onClick={() => openViewer(view)}
          className="gallery__stage"
          aria-label={`Open ${name} artwork full screen`}
          data-cursor="view"
        >
          {alternate ? (
            <span className="gallery__alt">
              <Image
                key={alternate.src}
                src={alternate.src}
                alt={alternate.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={alternate.kind === 'artwork' ? 'object-contain p-3' : 'object-contain p-10'}
              />
            </span>
          ) : (
            first
          )}

          <span className="gallery__zoom" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <circle cx="9" cy="9" r="5.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9 6.6v4.8M6.6 9h4.8M13.3 13.3 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Expand</span>
          </span>
        </button>

        {badges ? <div className="gallery__badges">{badges}</div> : null}
      </div>

      {thumbs.length > 0 ? (
        <div className="gallery__thumbs" role="tablist" aria-label={`${name} artwork views`}>
          {thumbs.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              role="tab"
              aria-selected={view === index}
              onClick={() => pick(index)}
              className="gallery__thumb"
              data-active={view === index ? 'true' : 'false'}
            >
              <span className="gallery__thumb-art">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="gallery__thumb-label">
                {image.kind === 'artwork' ? 'Artwork' : 'Emblem'}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {mounted && open && current
        ? createPortal(
            <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${name} artwork`}>
          <button type="button" className="lightbox__backdrop" onClick={close} aria-label="Close artwork" />
          <div className="lightbox__panel">
            <div className="lightbox__bar">
              <span className="lightbox__cap">
                <span className="lightbox__dot" aria-hidden="true" />
                {name}
              </span>
              <span className="lightbox__count font-mono">
                {String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
              <button ref={closeRef} type="button" onClick={close} className="lightbox__close" aria-label="Close">
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="lightbox__stage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={current.src} src={current.src} alt={current.alt} className="lightbox__img" />
            </div>

            {images.length > 1 ? (
              <div className="lightbox__foot">
                <button type="button" className="lightbox__arrow" onClick={() => step(-1)} aria-label="Previous image">
                  ←
                </button>
                <div className="lightbox__dots">
                  {images.map((image, index) => (
                    <button
                      key={`${image.src}-${index}`}
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`Image ${index + 1}`}
                      aria-current={index === lightboxIndex}
                      className="lightbox__dotbtn"
                    />
                  ))}
                </div>
                <button type="button" className="lightbox__arrow" onClick={() => step(1)} aria-label="Next image">
                  →
                </button>
              </div>
            ) : (
              <p className="lightbox__hint">Press Esc or click anywhere to close</p>
            )}
          </div>
        </div>,
            document.body,
          )
        : null}
    </div>
  );
}
