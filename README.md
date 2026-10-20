# ABNORMAL Store

One responsive Next.js site for PC, Android and iOS products. It replaces the
separate PC site, phone site and device-router: **one GitHub repo, one Vercel
project, one domain.** The layout adapts to the screen by itself, so there is no
phone/PC redirect any more.

## Home page and themes

The home page is one fixed screen (no scrolling, phone and PC). Each page has its own
theme and character: Home = Dendro, PC = Electro, Android = Cryo, iOS = Pyro,
Payments = Geo, Support = Anemo, Products / Explore products = Hydro. The mapping is in
`src/lib/themes.ts`. A random picture is chosen for each theme on every visit.

## What changed in this merged version

**Desktop scrolling** is now smooth. It is real page scrolling with a soft glide
(Lenis, see `src/components/smooth-scroll.tsx`). The old nested scroll box, scroll
snapping and blocked mouse wheel are gone. Page Down, Space, Home/End, the
scrollbar and `#anchor` links all work. Phones and tablets keep their own native
touch scrolling, and "reduce motion" users get plain native scrolling too.

**Background character** (`src/components/character-stage.tsx`):
- one fixed stage; each element (Dendro, Cryo, Pyro...) has its own slot
- slots slide and fade (opacity/transform only, no heavy filters)
- all desktop images are preloaded when the browser is idle, so swaps never pop in
- soft parallax with the mouse and scroll; dims after the hero so text stays readable
- when an element has several pictures (`anemo.webp`, `anemo2.webp`...), it shows
  the next one each time you come back to it
- phone: just the current character as a soft backdrop, using `*.mobile.webp`

**Performance**
- fonts are self-hosted (`src/fonts`), no Google Fonts request, builds work offline
- animated background patterns use GPU transforms instead of repainting
- inactive element scenes and particles are paused, not just hidden
- removed big blur filters, blend-mode noise layer and blur on scroll-reveals
- character art is cached for a year (`next.config.mjs`)
- phone version keeps its lighter rules (fewer particles, no ring animation)

## Design system (2026 refresh)

The store now uses a sharper, more editorial identity while keeping every price,
product and page exactly where it was.

**Type** — Sora (display) + Manrope (text) + Instrument Serif (italic accents),
all self-hosted in `src/fonts`. Two tiny glyph subsets (`public/fonts/kanji.woff2`,
`taka.woff2`) guarantee `異常` and `৳` render everywhere. Fonts are wired up in
`src/app/layout.tsx`; change the `@theme` tokens in `src/app/globals.css` to
re-skin the whole site.

**Motion** — every effect lives in `src/components/prestige/` and switches itself
off for `prefers-reduced-motion`, touch screens and no-JS visitors:

| File | What it does |
| --- | --- |
| `site-intro.tsx` | First-visit curtain (once per browser session; replay with `?intro=1`) |
| `pointer.tsx` | Custom crimson pointer + hero spotlight that follows the mouse |
| `scroll-hud.tsx` | Scroll progress hairline + back-to-top ring |
| `split-text.tsx` | Word-by-word masked headline reveal |
| `tilt.tsx` | 3D product cards with specular glare and an orbiting border |
| `magnetic.tsx` | Buttons that lean towards the pointer |
| `parallax.tsx` | Soft scroll drift for decorative blocks |
| `marquee.tsx` | Seamless infinite tickers (hero index, footer wordmark) |
| `count-up.tsx` | Hero stats that count up once |
| `clock.tsx` | Live Bangladesh-time chip in the header |
| `route-entrance.tsx` | A short fade-lift on every page change |

The new visual layer itself is appended to `src/app/globals.css` under
`PRESTIGE LAYER`; the original tokens, panels and themes above it are untouched.

## Run it

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm test         # catalog data checks
```

## Edit things

- Prices, products: `src/data/products.ts`, or run `add-product.bat` (Windows wizard)
- Payment numbers, Discord/Telegram links, site URL: `src/data/store.ts`
- Character art: drop files in `public/art/characters` named `anemo.webp`,
  `anemo2.webp`, `cryo.webp`... plus optional phone files like `anemo.mobile.webp`

## Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md).
