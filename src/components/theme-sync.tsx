'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { themeForPath } from '@/lib/themes';

/**
 * Each page has its own colour. The first paint is handled by a tiny script in
 * <head>; this keeps the colour right when you move between pages without a
 * full reload.
 */
export function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.theme = themeForPath(pathname);
  }, [pathname]);

  return null;
}
