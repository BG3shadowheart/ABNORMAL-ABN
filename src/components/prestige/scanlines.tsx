'use client';

import { useEffect, useRef } from 'react';

/**
 * PC-only atmosphere: a quiet CRT scanline sheet behind the page content and a
 * short-lived comet trail behind the pointer.
 *
 * Both are decorative, both are opt-in for fine pointers, and both disappear
 * for "reduce motion" visitors. The trail uses a small pool of DOM nodes that
 * is reused, never appended to, so it cannot grow while you move the mouse.
 */
export function CursorTrail({ size = 7, life = 620 }: { size?: number; life?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const COUNT = 14;
    const nodes = Array.from({ length: COUNT }, () => {
      const dot = document.createElement('span');
      dot.className = 'trail-dot';
      host.appendChild(dot);
      return dot;
    });

    let cursor = 0;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;

    const paint = () => {
      raf = 0;
      const dx = pendingX - lastX;
      const dy = pendingY - lastY;
      if (Math.abs(dx) + Math.abs(dy) < 2) return;
      lastX = pendingX;
      lastY = pendingY;

      const dot = nodes[cursor];
      cursor = (cursor + 1) % COUNT;
      dot.style.setProperty('--tx', `${pendingX.toFixed(1)}px`);
      dot.style.setProperty('--ty', `${pendingY.toFixed(1)}px`);
      dot.classList.remove('is-fading');
      // Force the fade to restart even when a pooled dot is reused quickly.
      void dot.offsetWidth;
      dot.classList.add('is-fading');
    };

    const onMove = (event: PointerEvent) => {
      pendingX = event.clientX;
      pendingY = event.clientY;
      if (!raf) raf = window.requestAnimationFrame(paint);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.cancelAnimationFrame(raf);
      for (const node of nodes) node.remove();
    };
  }, [life]);

  return <div ref={ref} className="trail" aria-hidden="true" style={{ ['--trail-size' as string]: `${size}px`, ['--trail-life' as string]: `${life}ms` }} />;
}

/** Scanline sheet + slow beam. Rendered only on the PC catalogue. */
export function Scanlines() {
  return (
    <div className="fx-screen" aria-hidden="true">
      <div className="fx-screen__lines" />
      <div className="fx-screen__beam" />
      <div className="fx-screen__vignette" />
    </div>
  );
}
