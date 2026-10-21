/**
 * ============================================================================
 *  STORE CONFIGURATION
 * ============================================================================
 *  This is the file you edit to make the store *yours*.
 *
 *  Everything here is public information — it is sent to every visitor's
 *  browser. Never put passwords, API keys or private data in this file.
 * ============================================================================
 */

/* ---------------------------------------------------------------------------
 * 1. BRANDING
 * ------------------------------------------------------------------------ */

/** Store name shown in the logo, the page titles and the footer. */
export const STORE_NAME = 'ABNORMAL';

/** Short Japanese subtitle printed under the logo. Purely decorative. */
export const STORE_NAME_KANJI = '異常';

/** One-line positioning statement used in the hero and in SEO metadata. */
export const STORE_TAGLINE = 'PC, Android and iOS products';

/** Short paragraph shown under the hero headline. */
export const STORE_DESCRIPTION =
  'PC, Android and iOS products with the price shown on every page. Pick one, pay with bKash, Nagad or Binance, and we deliver once we have checked your payment.';

/** ⚠️ Replace with your real public URL after you deploy (used for SEO tags + sitemap). */
export const STORE_URL = 'https://your-store.vercel.app';

/* ---------------------------------------------------------------------------
 * 2. SUPPORT LINKS
 * ------------------------------------------------------------------------ */

/** Discord invite link. */
export const DISCORD_URL = 'https://discord.gg/abnormal';

/** Telegram support link. */
export const TELEGRAM_URL = 'https://t.me/ARAFATMooDZ';

/** WhatsApp support link. */
export const WHATSAPP_URL = 'https://wa.me/message/4FO2O2VCWZZQB1';

/* ---------------------------------------------------------------------------
 * 3. PAYMENT METHODS
 * ------------------------------------------------------------------------ */

export type PaymentMethod = {
  id: string;
  /** Method name, e.g. 'bKash'. */
  name: string;
  /** Optional label under the name, e.g. 'Personal'. */
  kind?: string;
  /** Label for the value row, e.g. 'Account' or 'Account ID'. */
  fieldLabel: string;
  /** The exact value a visitor must copy. */
  value: string;
  /** Short guidance line shown inside the payment card. */
  note: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bkash',
    name: 'bKash',
    kind: 'Personal',
    fieldLabel: 'Account',
    value: '+880 1629-835648',
    note: 'Personal account. Send the exact amount and keep the transaction ID.',
  },
  {
    id: 'nagad',
    name: 'Nagad',
    fieldLabel: 'Account',
    value: '+880 1629-835648',
    note: 'Send the exact amount and keep the transaction ID.',
  },
  {
    id: 'binance',
    name: 'Binance',
    fieldLabel: 'Account ID',
    value: '1220374728',
    note: 'Binance Pay or internal transfer. Keep the transaction ID after you send.',
  },
];

/** Safety line printed next to every payment card. */
export const PAYMENT_SAFETY_NOTE =
  'We will never ask for your PIN, password, OTP or wallet private key. Before you pay, check the product, plan and exact price with us.';

/* ---------------------------------------------------------------------------
 * 4. CATALOG BEHAVIOUR
 * ------------------------------------------------------------------------ */

/**
 * Sorting-only exchange rate.
 *
 * Some products are priced in USD, others only in BDT. To be able to sort a
 * mixed list by price we need one common number. This rate is used ONLY to
 * order results — it is never displayed anywhere and never changes a price
 * you configured in `src/data/products.ts`.
 */
export const SORT_BDT_PER_USD = 120;

/** How many products the "Featured" shelf on the homepage shows. */
export const FEATURED_LIMIT = 6;

/* ---------------------------------------------------------------------------
 * 5. NAVIGATION
 * ------------------------------------------------------------------------ */

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'PC', href: '/pc' },
  { label: 'Android', href: '/android' },
  { label: 'iOS', href: '/ios' },
  { label: 'Payments', href: '/payments' },
  { label: 'Support', href: '/support' },
] as const;

/** Extra link used by the hero and the footer. */
export const CATALOG_HREF = '/products';

/* ---------------------------------------------------------------------------
 * 6. SHORT COPY BLOCKS (edit freely — these are your words, not data)
 * ------------------------------------------------------------------------ */

export const ORDER_STEPS = [
  {
    title: 'Pick a product and a plan',
    body: 'Open any product and choose how long you want it. The price on the page is the price you pay.',
  },
  {
    title: 'Send the payment',
    body: 'Send the exact amount by bKash, Nagad or Binance. Keep the transaction ID, and for bKash or Nagad the number you paid from.',
  },
  {
    title: 'Fill in the order form',
    body: 'Enter your payment method, the transaction ID and, for bKash or Nagad, your sender number. You do not need an account and nothing is saved on this site.',
  },
  {
    title: 'Send it to us with proof',
    body: 'Copy the order summary, open a ticket on Discord (or message us on Telegram or WhatsApp), paste it in and attach your payment screenshot. We deliver after we have checked it by hand.',
  },
] as const;

export const FOOTER_NOTE =
  'Our team confirms availability and delivery with you before you pay.';
