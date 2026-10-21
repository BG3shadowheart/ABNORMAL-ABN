'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';

export type GalleryImage = {
  src: string;
  alt: string;
  /** 'logo' keeps the padding tight, 'artwork' shows the full frame. */
  kind?: 'logo' | 'artwork';
};

/**
 * The product picture, with a full-screen viewer.
 *
 *  - clicking the picture opens the viewer (Esc closes, left and right arrows
 *    move between images, focus returns to the picture afterwards),
 *  - thumbnails only appear when a product really has more than one image.
 *
 * `first` is the server-rendered picture (ProductVisual) so the default view
 * keeps every product-specific detail; the viewer and thumbnails use the real
 * files returned by getProductImages().
 */
export function ProductGallery({
  images,
  first,
  name,
  badges,
}: {
  images: GalleryImage[];
  first: ReactNode;
  name: string;
  badges?: ReactNode;
}) {
  const [view, setView] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const frameRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const thumbs = images.length > 1 ? images : [];

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
      <div className="gallery__frame panel">
        <button
          ref={frameRef}
          type="button"
          onClick={() => openViewer(view)}
          className="gallery__stage"
          aria-label={`Open ${name} picture full screen`}
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
            <span>Enlarge</span>
          </span>
        </button>

        {badges ? <div className="gallery__badges">{badges}</div> : null}
      </div>

      {thumbs.length > 0 ? (
        <div className="gallery__thumbs" role="tablist" aria-label={`${name} pictures`}>
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
                {image.kind === 'artwork' ? 'Picture' : 'Logo'}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {mounted && open && current
        ? createPortal(
            <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${name} picture`}>
          <button type="button" className="lightbox__backdrop" onClick={close} aria-label="Close picture" />
          <div className="lightbox__panel">
            <div className="lightbox__bar">
              <span className="lightbox__cap">
                {name}
              </span>
              <span className="lightbox__count">
                {lightboxIndex + 1} / {images.length}
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
              <p className="lightbox__hint">Press Esc or click outside to close</p>
            )}
          </div>
        </div>,
            document.body,
          )
        : null}
    </div>
  );
}
