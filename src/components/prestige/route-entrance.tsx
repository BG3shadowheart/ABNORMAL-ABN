'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * A short, tasteful entrance on every route change — fade, lift and a touch of
 * blur. Re-keying by pathname restarts the animation without intercepting
 * navigation, so links stay instant and the back button behaves normally.
 */
export function RouteEntrance({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="route-entrance">
      {children}
    </div>
  );
}
