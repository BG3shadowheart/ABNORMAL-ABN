import type { CSSProperties, ReactNode } from 'react';

/**
 * Seamless infinite marquee. The group is rendered twice and the track slides
 * exactly one group-width, so there is no jump at the loop point. The duplicate
 * is inert (no duplicate tab stops) and the whole thing pauses on hover.
 * It is a pure CSS transform — nothing repaints while it runs.
 */
export function Marquee({
  children,
  speed = 42,
  reverse = false,
  className = '',
}: {
  children: ReactNode;
  /** Seconds for one full loop. Lower = faster. */
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`marquee ${className}`}
      style={{ '--marquee-duration': `${speed}s` } as CSSProperties}
    >
      <div className={`marquee__track ${reverse ? 'is-reverse' : ''}`}>
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
