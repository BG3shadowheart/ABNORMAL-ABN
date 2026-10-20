'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Bespoke pointer for mouse/trackpad visitors: a precise crimson dot with a
 * lagging ring. The ring grows over anything interactive and can show a short
 * label (data-cursor-label) — product cards use it to say "View".
 *
 * It switches itself off for touch screens, "reduce motion" visitors and old
 * browsers, in which case the normal system cursor stays visible.
 */
export function PointerLayer() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setEnabled(fine.matches && !reduce.matches);

    sync();
    fine.addEventListener('change', sync);
    reduce.addEventListener('change', sync);
    return () => {
      fine.removeEventListener('change', sync);
      reduce.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const root = document.documentElement;
    root.classList.add('has-pointer');

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let raf = 0;
    let seen = false;
    let hovered: Element | null = null;

    const paint = () => {
      raf = 0;
      ringX += (x - ringX) * 0.18;
      ringY += (y - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%)`;

      if (Math.abs(x - ringX) + Math.abs(y - ringY) > 0.2) {
        raf = window.requestAnimationFrame(paint);
      }
    };

    const wake = () => {
      if (!raf) raf = window.requestAnimationFrame(paint);
    };

    const setState = (target: Element | null) => {
      const interactive =
        target && target.closest
          ? target.closest(
              'a, button, [role="button"], input, select, textarea, summary, [data-cursor]',
            )
          : null;
      if (interactive === hovered) return;
      hovered = interactive;

      if (!interactive) {
        ring.dataset.state = 'idle';
        ring.dataset.label = '';
        return;
      }

      const label = interactive.getAttribute('data-cursor-label');
      if (label) {
        ring.dataset.state = 'label';
        ring.dataset.label = label;
      } else if (interactive.matches('input, textarea')) {
        ring.dataset.state = 'text';
        ring.dataset.label = '';
      } else {
        ring.dataset.state = 'link';
        ring.dataset.label = '';
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!seen) {
        seen = true;
        ringX = x;
        ringY = y;
        root.classList.add('pointer-visible');
      }
      setState(event.target as Element | null);
      wake();
    };

    const onDown = () => root.classList.add('pointer-down');
    const onUp = () => root.classList.remove('pointer-down');
    const onLeave = () => {
      root.classList.remove('pointer-visible');
      seen = false;
    };
    const onEnter = () => {
      if (!seen) return;
      root.classList.add('pointer-visible');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
      window.cancelAnimationFrame(raf);
      root.classList.remove('has-pointer', 'pointer-visible', 'pointer-down');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-layer" aria-hidden="true">
      <div ref={ringRef} className="pointer-ring" data-state="idle" data-label="" />
      <div ref={dotRef} className="pointer-dot" />
    </div>
  );
}

/**
 * A soft light that follows the mouse inside the home hero. It only writes two
 * CSS custom properties — the gradient itself is handled by CSS, so this stays
 * on the compositor and costs almost nothing.
 */
export function HeroSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    const host = node?.closest<HTMLElement>('[data-home]');
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let targetX = 62;
    let targetY = 38;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      host.style.setProperty('--spot-x', `${currentX.toFixed(2)}%`);
      host.style.setProperty('--spot-y', `${currentY.toFixed(2)}%`);
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.05) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 100;
      targetY = ((event.clientY - rect.top) / rect.height) * 100;
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    host.addEventListener('pointermove', onMove, { passive: true });
    raf = window.requestAnimationFrame(tick);
    return () => {
      host.removeEventListener('pointermove', onMove);
      window.cancelAnimationFrame(raf);
      host.style.removeProperty('--spot-x');
      host.style.removeProperty('--spot-y');
    };
  }, []);

  return <div ref={ref} className="hero-spotlight" aria-hidden="true" />;
}
