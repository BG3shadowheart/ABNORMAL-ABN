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
