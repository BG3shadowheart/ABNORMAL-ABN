# Deploy: one GitHub repo, one Vercel project

1. Create a GitHub repository and upload the CONTENTS of this project folder (not an extra `ABNORMAL-ABN-main/` folder). `package.json`, `next.config.mjs`, `src/`, and `public/` must all be directly at the repository root. This project supports both `npm run build` and `npm run vercel-build`.
2. Go to https://vercel.com/new, import the repository, keep the **Next.js**
   preset and press **Deploy**. No environment variables are needed.
3. In the Vercel project, open **Settings → Domains** and add your domain
   (for example abnormal.shop). Remove it from the old router project first.
4. Set the real public URL in `src/data/store.ts` (`STORE_URL`) so the sitemap and
   share previews use it, then commit.
5. When it works, delete the three old projects/repos (PC site, phone site,
   device-router). Nothing here depends on them.

Updating later: change a file, `git push`, Vercel redeploys.

## Pre-launch check
- Open the site on a phone and on a PC. Scroll the whole home page.
- Check the payment numbers on /payments.
- Open one product page and place a test order summary.
