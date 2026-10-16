/**
 * ============================================================================
 *  ANDROID PRODUCTS
 * ============================================================================
 *  This route renders the shared PlatformPageView, exactly like /pc and /ios.
 *
 *  It previously had its own hand-written layout, which meant it quietly
 *  drifted: it was the only platform page without the second character partway
 *  down, and the only one that had not picked up later fixes. One page, one
 *  implementation.
 * ============================================================================
 */

import type { Metadata } from 'next';

import { PlatformPageView } from '@/components/platform-page';
import { PLATFORMS } from '@/data/products';

const meta = PLATFORMS.find((platform) => platform.id === 'android')!;

export const metadata: Metadata = {
  title: 'Android products',
  description: meta.intro,
  alternates: { canonical: '/android' },
};

export default function AndroidPage() {
  return <PlatformPageView platform="android" />;
}
