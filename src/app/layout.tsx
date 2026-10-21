import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { OrderContextProvider } from '@/components/order-context';
import { CharacterStage } from '@/components/character-stage';
import { THEME_BOOT_SCRIPT } from '@/lib/themes';
import { ThemeSync } from '@/components/theme-sync';
import { findLocalCharacters } from '@/lib/local-art';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { STORE_DESCRIPTION, STORE_NAME, STORE_TAGLINE, STORE_URL } from '@/data/store';

// Self-hosted fonts: no request to Google at build or run time, so builds never
// fail offline and the first paint is faster. Headings use Sora, text uses Manrope.
const display = localFont({
  src: '../fonts/sora-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-sora',
  display: 'swap',
  preload: true,
});

const sans = localFont({
  src: '../fonts/manrope-latin-wght-normal.woff2',
  weight: '200 800',
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(STORE_URL),
  title: {
    default: `${STORE_NAME} — ${STORE_TAGLINE}`,
    template: `%s · ${STORE_NAME}`,
  },
  description: STORE_DESCRIPTION,
  applicationName: STORE_NAME,
  keywords: ['ABNORMAL', 'PC products', 'Android APK', 'iOS products', 'price list', 'USD BDT pricing'],
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
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-ink-950 text-bone-200 antialiased">
        <ThemeSync />
        <CharacterStage local={findLocalCharacters()} />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-crimson-500 focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-bone-50"
        >
          Skip to content
        </a>

        <SiteHeader />

        <OrderContextProvider>
          <main id="main">{children}</main>
        </OrderContextProvider>

        <SiteFooter />
      </body>
    </html>
  );
}
