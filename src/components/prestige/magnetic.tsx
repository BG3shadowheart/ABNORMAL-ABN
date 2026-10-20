'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** A gentle magnetic pull towards the pointer — used on primary buttons. */
export function Magnetic({
  children,
  strength = 8,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const tick = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      node.style.setProperty('--mag-x', `${x.toFixed(2)}px`);
      node.style.setProperty('--mag-y', `${y.toFixed(2)}px`);
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const wake = () => {
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      targetX = ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * strength;
      targetY = ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * strength;
      wake();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      wake();
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      window.cancelAnimationFrame(raf);
      node.style.removeProperty('--mag-x');
      node.style.removeProperty('--mag-y');
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic ${className}`}>
      <span className="magnetic__inner">{children}</span>
    </span>
  );
}
