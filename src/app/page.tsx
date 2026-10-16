import type { Metadata } from 'next';

import { Hero } from '@/components/hero';
import { STORE_DESCRIPTION, STORE_NAME, STORE_TAGLINE } from '@/data/store';

export const metadata: Metadata = {
  title: `${STORE_NAME} — ${STORE_TAGLINE}`,
  description: STORE_DESCRIPTION,
  alternates: { canonical: '/' },
};

/** The home page is a single screen: no scrolling, no sections. */
export default function HomePage() {
  return <Hero />;
}
