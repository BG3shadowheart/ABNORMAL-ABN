import Image from 'next/image';
import { STORE_NAME } from '@/data/store';

/**
 * Store logo — the owner's own artwork from /public/brand/logo.png.
 * To swap it later, just replace that file.
 */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-lg border border-ink-600 bg-ink-900 ${className}`}
    >
      <Image
        src="/brand/logo.png"
        alt={`${STORE_NAME} logo`}
        fill
        sizes="80px"
        priority
        className="object-contain p-0.5"
      />
    </span>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-display text-[1.05rem] font-semibold tracking-[0.12em] text-bone-50">
        {STORE_NAME}
      </span>
    </span>
  );
}
