'use client';

import { useEffect, useRef, type MouseEvent } from 'react';

const CIRCUMFERENCE = 2 * Math.PI * 17;

/**
 * Two small pieces of interface chrome:
 *  - a hairline progress bar under the header,
 *  - a "back to top" button with a progress ring that fades in after the first
 *    screen. Both are hidden automatically on the fixed-screen home page.
 */
export function ScrollHud() {
  const barRef = useRef<HTMLSpanElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const topRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = `${(CIRCUMFERENCE * (1 - progress)).toFixed(2)}`;
      }
      if (topRef.current) topRef.current.dataset.show = window.scrollY > window.innerHeight * 0.75 ? 'true' : 'false';
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  const backToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>

      <a
        ref={topRef}
        href="#main"
        onClick={backToTop}
        className="to-top"
        data-show="false"
        aria-label="Back to top"
      >
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle className="to-top__track" cx="20" cy="20" r="17" />
          <circle
            ref={ringRef}
            className="to-top__ring"
            cx="20"
            cy="20"
            r="17"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
          />
        </svg>
        <span className="to-top__arrow" aria-hidden="true">
          <svg viewBox="0 0 20 20">
            <path d="M10 15V5m0 0-4.2 4.2M10 5l4.2 4.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </>
  );
}
