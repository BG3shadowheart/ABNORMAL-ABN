'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * A 3D card shell. It writes --rx / --ry / --mx / --my and CSS does the rest,
 * so hover feels like a physical object without a single frame of layout work.
 * Phones, keyboards and "reduce motion" keep a perfectly flat card.
 */
export function Tilt({
  children,
  className = '',
  max = 6,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum rotation in degrees. */
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let rect: DOMRect | null = null;
    const measure = () => {
      rect = node.getBoundingClientRect();
    };

    const onEnter = () => {
      measure();
      node.classList.add('is-tilting');
    };

    const onMove = (event: PointerEvent) => {
      if (!rect) measure();
      if (!rect) return;
      const px = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const py = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      node.style.setProperty('--rx', ((0.5 - py) * max).toFixed(2) + 'deg');
      node.style.setProperty('--ry', ((px - 0.5) * max * 1.25).toFixed(2) + 'deg');
      node.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      node.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    };

    const onLeave = () => {
      rect = null;
      node.classList.remove('is-tilting');
      node.style.setProperty('--rx', '0deg');
      node.style.setProperty('--ry', '0deg');
    };

    node.addEventListener('pointerenter', onEnter);
    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', measure);

    return () => {
      node.removeEventListener('pointerenter', onEnter);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', measure);
      node.classList.remove('is-tilting');
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt ${glare ? 'tilt--glare' : ''} ${className}`}>
      {children}
    </div>
  );
}
