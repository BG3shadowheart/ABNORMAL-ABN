import type { Metadata } from 'next';
import { PlatformPageView } from '@/components/platform-page';
import { CursorTrail, Scanlines } from '@/components/prestige/scanlines';
import { PLATFORMS } from '@/data/products';

const meta = PLATFORMS.find((platform) => platform.id === 'pc')!;

export const metadata: Metadata = {
  title: 'PC products',
  description: meta.intro,
  alternates: { canonical: '/pc' },
};

/**
 * The PC catalogue gets its own atmosphere: a quiet CRT scanline sheet behind
 * the content and a comet trail behind the pointer. Both are decoration and
 * both switch off for touch screens and reduced-motion visitors.
 */
export default function PcPage() {
  return (
    <>
      <Scanlines />
      <CursorTrail />
      <PlatformPageView platform="pc" />
    </>
  );
}
