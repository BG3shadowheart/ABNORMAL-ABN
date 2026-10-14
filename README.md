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
