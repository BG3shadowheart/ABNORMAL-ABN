import type { Platform } from '@/data/products';

/**
 * Section themes (inspired by the seven elements on the Genshin site).
 * The actual colours live in globals.css under html[data-theme='…'].
 */
export const THEMES = {
  anemo: { label: 'Anemo', glyph: '風' },
  geo: { label: 'Geo', glyph: '岩' },
  electro: { label: 'Electro', glyph: '雷' },
  dendro: { label: 'Dendro', glyph: '草' },
  hydro: { label: 'Hydro', glyph: '水' },
  pyro: { label: 'Pyro', glyph: '火' },
  cryo: { label: 'Cryo', glyph: '氷' },
} as const;

export type ThemeId = keyof typeof THEMES;

export const THEME_IDS = Object.keys(THEMES) as ThemeId[];
export const DEFAULT_THEME: ThemeId = 'dendro';

export function isTheme(value: string | undefined): value is ThemeId {
  return !!value && value in THEMES;
}

/** Theme for each platform block on the home page. */
export const PLATFORM_THEME: Record<Platform, ThemeId> = {
  pc: 'dendro',
  android: 'cryo',
  ios: 'pyro',
};

/** Theme for pages that have no themed sections of their own. */
export function themeForPath(path: string): ThemeId {
  if (path === '/' || path === '') return 'dendro';
  if (path.startsWith('/pc')) return 'electro';
  if (path.startsWith('/android')) return 'cryo';
  if (path.startsWith('/ios')) return 'pyro';
  if (path.startsWith('/payments')) return 'geo';
  if (path.startsWith('/support')) return 'anemo';
  if (path.startsWith('/products') || path.startsWith('/order-confirmation')) return 'hydro';
  return DEFAULT_THEME;
}

/**
 * Same mapping as a tiny script that runs before the first paint, so a page
 * opens already in its own colours (no flash of the wrong theme).
 */
export const THEME_BOOT_SCRIPT = `(function(){var p=location.pathname,t='dendro';
if(p==='/'||p==='')t='dendro';else if(p.indexOf('/pc')===0)t='electro';
else if(p.indexOf('/android')===0)t='cryo';else if(p.indexOf('/ios')===0)t='pyro';
else if(p.indexOf('/payments')===0)t='geo';else if(p.indexOf('/support')===0)t='anemo';
else if(p.indexOf('/products')===0||p.indexOf('/order-confirmation')===0)t='hydro';
document.documentElement.setAttribute('data-theme',t);})();`;
