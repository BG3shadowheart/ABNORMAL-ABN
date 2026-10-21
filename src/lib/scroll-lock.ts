/**
 * Locks page scrolling while an overlay (the image viewer) is open.
 * Calls can be nested; the page unlocks when the last overlay closes.
 */

let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  document.documentElement.classList.add('scroll-locked');
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  document.documentElement.classList.remove('scroll-locked');
}
