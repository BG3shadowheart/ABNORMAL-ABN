# ABNORMAL Store

One responsive Next.js site for PC, Android and iOS products. **One GitHub repo, one
Vercel project, one domain.** The layout adapts to the screen by itself, so there is no
phone/PC redirect.

## What the site looks like

Plain and calm: dark pages, one accent colour per page, simple cards, normal wording.

- **Home** has a short intro, then rows of products that scroll sideways (Featured, PC,
  Android, iOS), then how ordering works, ways to pay and support.
- **Sideways rows**: swipe on a phone, use the arrow buttons or shift + mouse wheel on
  a computer. Cards snap into place. The component is `src/components/hscroll.tsx`.
- **Platform pages** (`/pc`, `/android`, `/ios`) and **/products** have search, plan
  length filter and sorting.
- **Product pages** show every plan and price, a picture viewer and the order form.
- Each page has its own colour and character picture (`src/lib/themes.ts`). The
  picture sits behind the top of the page and scrolls away with it.

There are no intro animations, custom cursors, tilting cards or particle effects.
The old stylesheet was over 4,000 lines; the current one is about 1,100.

## Run it

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm test         # catalog data checks
```

## Edit things

- Prices and products: `src/data/products.ts`, or run `add-product.bat` (Windows wizard)
- Store name, texts, payment numbers, Discord/Telegram/WhatsApp links, site URL:
  `src/data/store.ts`
- Home page layout: `src/components/home.tsx`
- Colours and spacing: `src/app/globals.css` (colour tokens at the top)
- Character art: drop files in `public/art/characters` named `anemo.webp`,
  `anemo2.webp`, `cryo.webp`... plus optional phone files like `anemo.mobile.webp`.
  A random one is shown on each visit.

To give a product a second picture in its viewer, set both `logo` and `image` on its
entry in `src/data/products.ts`.

## Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md).
