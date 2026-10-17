/**
 * Set STATIC_EXPORT=true (via `npm run build:static`) to export the whole site
 * as plain HTML/CSS/JS into the `out/` folder — that is what Cloudflare Pages
 * and other static hosts need. Left unset, the project builds as a normal
 * Next.js app for Vercel.
 */
const isStaticExport = process.env.STATIC_EXPORT === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: isStaticExport ? 'export' : undefined,
  images: {
    // A static host has no image optimiser, so serve the files as they are.
    unoptimized: isStaticExport,
    formats: ['image/avif', 'image/webp'],
  },
  // Character art never changes under the same file name, so let browsers and
  // the Vercel edge keep it for a year. (Ignored by static export.)
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/art/:path*',
              headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
              source: '/brand/:path*',
              headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000' }],
            },
          ];
        },
      }),
};

export default nextConfig;
