import type { Metadata } from 'next';

import { Home } from '@/components/home';
import { STORE_DESCRIPTION, STORE_NAME, STORE_TAGLINE } from '@/data/store';

export const metadata: Metadata = {
  title: `${STORE_NAME} — ${STORE_TAGLINE}`,
  description: STORE_DESCRIPTION,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <Home />;
}
