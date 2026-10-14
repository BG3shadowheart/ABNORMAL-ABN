import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Atmosphere } from '@/components/atmosphere';
import { OrderContextProvider } from '@/components/order-context';
import { CharacterStage } from '@/components/character-stage';
import { SmoothScroll } from '@/components/smooth-scroll';
import { ThemeController } from '@/components/theme-controller';
import { findLocalCharacters } from '@/lib/local-art';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { PRODUCTS } from '@/data/products';
import { STORE_DESCRIPTION, STORE_NAME, STORE_TAGLINE, STORE_URL } from '@/data/store';

// Self-hosted fonts: no request to Google at build or run time, so builds never
// fail offline and the first paint is faster.
const display = localFont({
  src: '../fonts/fredoka.woff2',
  weight: '300 700',
  variable: '--font-fredoka',
  display: 'swap',
});

const sans = localFont({
  src: '../fonts/nunito.woff2',
  weight: '200 1000',
  variable: '--font-nunito',
  display: 'swap',
});

const mono = localFont({
  src: [
    { path: '../fonts/jetbrains-mono-400.woff2', weight: '400' },
    { path: '../fonts/jetbrains-mono-500.woff2', weight: '500' },
    { path: '../fonts/jetbrains-mono-600.woff2', weight: '600' },
  ],
  variable: '--font-mono-price',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(STORE_URL),
  title: {
    default: `${STORE_NAME} — ${STORE_TAGLINE}`,
    template: `%s · ${STORE_NAME}`,
  },
  description: STORE_DESCRIPTION,
  applicationName: STORE_NAME,
  keywords: [
    'ABNORMAL',
    'premium products',
    'PC products',
    'Android APK',
    'iOS products',
    'price list',
    'USD BDT pricing',
  ],
  openGraph: {
    type: 'website',
    siteName: STORE_NAME,
    title: `${STORE_NAME} — ${STORE_TAGLINE}`,
    description: STORE_DESCRIPTION,
    url: STORE_URL,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${STORE_NAME} — ${STORE_TAGLINE}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${STORE_NAME} — ${STORE_TAGLINE}`,
    description: STORE_DESCRIPTION,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#04040a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dendro"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-ink-950 text-bone-200 antialiased">
        <Atmosphere />
        <ThemeController />
        <SmoothScroll />
        <CharacterStage local={findLocalCharacters()} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-crimson-500 focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-bone-50"
        >
          Skip to content
        </a>

        <SiteHeader productCount={PRODUCTS.length} />

        <OrderContextProvider>
          <main id="main">{children}</main>
        </OrderContextProvider>

        <SiteFooter />
      </body>
    </html>
  );
}
