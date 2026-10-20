/**
 * Scroll locking that works with the site's smooth-scroll engine.
 *
 * CSS alone is not enough: Lenis drives `window.scrollTo` directly, so it keeps
 * moving the page even when the document is told to stop overflowing. These
 * helpers therefore also pause Lenis while an overlay (viewer / drawer) is open,
 * and restore everything on close.
 */

type LenisLike = { stop: () => void; start: () => void };

function lenis(): LenisLike | undefined {
  return (window as unknown as { __lenis?: LenisLike }).__lenis;
}

let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;

  document.documentElement.classList.add('scroll-locked');
  document.body.style.overflow = 'hidden';
  document.body.style.overscrollBehavior = 'none';
  lenis()?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;

  document.documentElement.classList.remove('scroll-locked');
  document.body.style.overflow = '';
  document.body.style.overscrollBehavior = '';
  lenis()?.start();
}
