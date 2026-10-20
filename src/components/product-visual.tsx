import Image from 'next/image';
import type { Product } from '@/data/products';
import { ProductArtwork } from '@/components/artwork';

/**
 * Product visual selection is explicit and keyed one-to-one by catalog slug.
 * Only DRIP products use the legacy logo-overlay behavior from Product.logo.
 * Every other built-in product uses its own matching file, preventing a shared
 * ABN fallback or one product's logo from leaking onto another product.
 */
export type MatchedArtwork = {
  src: string;
  alt: string;
  kind?: 'logo' | 'artwork';
};

const MATCHED_PRODUCT_ARTWORK: Record<string, MatchedArtwork> = {
  'br-mods-pc': {
    src: '/art/products/br-mods-pc.webp',
    alt: 'BR Mods PC product logo',
  },
  'fake-lag-pc': {
    src: '/art/products/fake-lag-pc.webp',
    alt: 'Abnormal Fake Lag PC logo',
  },
  'br-fake-lag-pc-bundle': {
    src: '/art/products/br-mods-fake-lag-bundle.webp',
    alt: 'BR Mods and Fake Lag PC bundle logo',
  },
  'abnormal-aimbot-premium-pc': {
    src: '/art/products/abnormal-aimbot-premium-pc.webp',
    alt: 'Abnormal Aimbot Premium PC logo',
  },
  'streamer-pc-fully-hidden-phone-control': {
    src: '/art/products/streamer-pc-fully-hidden-phone-control.webp',
    alt: 'Abnormal Streamer PC logo',
  },
  'br-mods-android': {
    src: '/art/products/br-mods-android.webp',
    alt: 'BR Mods Android logo',
  },
  'prime-apk-mod': {
    src: '/art/products/prime-apk-mod.webp',
    alt: 'Prime APK Mod logo',
  },
  'aim-hack-non-root-android': {
    src: '/art/products/aim-hack-non-root-android.webp',
    alt: 'Aim Hack non-root Android logo',
  },
  'pato-blue-apk-mod': {
    src: '/art/products/pato-blue-apk-mod.webp',
    alt: 'Pato Blue APK Mod logo',
  },
  'pato-orange-apk-mod': {
    src: '/art/products/pato-orange-apk-mod.webp',
    alt: 'Pato Orange APK Mod logo',
  },
  'pato-green-apk-mod': {
    src: '/art/products/pato-green-apk-mod.webp',
    alt: 'Pato Green APK Mod logo',
  },
  'pato-yellow': {
    src: '/art/products/pato-yellow.webp',
    alt: 'Pato Yellow logo',
  },
  'silentceats-apk-mod': {
    src: '/art/products/silentceats-apk-mod.webp',
    alt: 'Silentceats APK Mod logo',
  },
  'bala-mod-android': {
    src: '/art/products/bala-mod-android.webp',
    alt: 'Bala Mod Android logo',
  },
  'rocket-mod': {
    src: '/art/products/rocket-mod-emblem.webp',
    alt: 'Rocket Mod logo',
  },
  'fluorite-ios': {
    src: '/art/products/fluorite-ios.webp',
    alt: 'Fluorite iOS logo',
  },
  'migul-ios': {
    src: '/art/products/migul-ios.webp',
    alt: 'Migul iOS logo',
  },
  'gbox-esign': {
    src: '/art/products/gbox-esign-optimized.webp',
    alt: 'GBOX and ESIGN signing tools artwork',
    kind: 'artwork',
  },
  'ios-external': {
    src: '/art/products/ios-external-optimized.webp',
    alt: 'iOS External product artwork',
    kind: 'artwork',
  },
  'aim-hack-non-root-ios': {
    src: '/art/products/aim-hack-non-root-ios.webp',
    alt: 'Aim Hack non-root iOS logo',
  },
};

/**
 * Every real image asset a product has, in display order. Used by the product
 * gallery (thumbnails + full-screen view) so it never invents artwork that the
 * owner did not provide.
 */
export function getProductImages(product: Product): MatchedArtwork[] {
  const out: MatchedArtwork[] = [];

  const push = (image: MatchedArtwork | undefined) => {
    // The same file can be referenced twice (logo + artwork); show it once.
    if (image && !out.some((existing) => existing.src === image.src)) out.push(image);
  };

  if (isDripProduct(product)) {
    if (product.logo) push({ src: product.logo, alt: `${product.name} logo` });
    if (product.image) {
      push({ src: product.image, alt: product.imageAlt ?? `${product.name} artwork`, kind: 'artwork' });
    }
    return out;
  }

  const matched = MATCHED_PRODUCT_ARTWORK[product.slug];
  if (matched) push(matched);
  else if (product.image) {
    push({ src: product.image, alt: product.imageAlt ?? `${product.name} artwork`, kind: 'artwork' });
  }
  return out;
}

export function isDripProduct(product: Pick<Product, 'slug' | 'name'>): boolean {
  return product.slug.startsWith('drip-') || product.name.trim().toUpperCase().startsWith('DRIP ');
}

export function ProductVisual({
  product,
  priority = false,
  context = 'card',
}: {
  product: Product;
  priority?: boolean;
  context?: 'card' | 'detail';
}) {
  const sizes = context === 'detail'
    ? '(max-width: 1024px) 100vw, 50vw'
    : '(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 22vw';
  const dripLogoPadding = context === 'detail' ? 'p-10' : 'p-8';
  const matchedLogoPadding = context === 'detail' ? 'p-7 sm:p-10' : 'p-4 sm:p-5';

  // Keep all existing DRIP artwork / logo rendering logic unchanged.
  if (isDripProduct(product)) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-ink-950">
        <ProductArtwork
          seed={product.slug}
          platform={product.platform}
          name={product.name}
          className="art-layer absolute inset-0 h-full w-full"
        />
        {product.logo ? (
          <Image
            src={product.logo}
            alt={`${product.name} logo`}
            fill
            sizes={sizes}
            priority={priority}
            className={`absolute inset-0 z-[1] object-contain ${dripLogoPadding} drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-105`}
          />
        ) : null}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt ?? `${product.name} artwork`}
            fill
            sizes={sizes}
            priority={priority}
            className="art-layer absolute inset-0 z-[2] object-contain bg-ink-950/30"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
      </div>
    );
  }

  // Non-DRIP products do not use the legacy logo props, generated monograms,
  // or a generic ABN fallback. Each product resolves to its named artwork only.
  const matched = MATCHED_PRODUCT_ARTWORK[product.slug];
  const customArtwork = product.image ? {
    src: product.image,
    alt: product.imageAlt ?? `${product.name} artwork`,
    kind: 'artwork' as const,
  } : undefined;
  const artwork = matched ?? customArtwork;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#08070d]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(90,25,42,0.22),_transparent_72%)]" />
      {artwork ? (
        <Image
          src={artwork.src}
          alt={artwork.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`relative z-[1] object-contain ${artwork.kind === 'artwork' ? 'p-2 sm:p-3' : matchedLogoPadding} transition-transform duration-500 group-hover:scale-[1.03]`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <span className="font-display text-lg font-semibold tracking-widest text-bone-300">{product.name}</span>
        </div>
      )}
    </div>
  );
}
