import Link from 'next/link';
import type { ReactNode } from 'react';
import { PLATFORM_LABEL, type Platform } from '@/data/products';
import { formatBdt, formatUsd } from '@/lib/format';

/* -------------------------------------------------------------------------- */
/* Section heading                                                             */
/* -------------------------------------------------------------------------- */

export function SectionHeading({
  title,
  description,
  action,
  as: Tag = 'h2',
  className = '',
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-3 ${className}`}>
      <div className="max-w-2xl">
        <Tag className="font-display text-2xl leading-tight text-bone-50 sm:text-3xl">{title}</Tag>
        {description ? (
          <p className="mt-2 text-[0.95rem] leading-relaxed text-bone-300">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Badges + chips                                                              */
/* -------------------------------------------------------------------------- */

export function PlatformBadge({
  platform,
  className = '',
}: {
  platform: Platform;
  className?: string;
}) {
  return <span className={`chip chip-platform ${className}`}>{PLATFORM_LABEL[platform]}</span>;
}

export function Chip({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode;
  tone?: 'default' | 'aura';
  className?: string;
}) {
  return <span className={`chip ${tone === 'aura' ? 'chip-aura' : ''} ${className}`}>{children}</span>;
}

/* -------------------------------------------------------------------------- */
/* Prices                                                                      */
/* -------------------------------------------------------------------------- */

export function PricePair({
  usd,
  bdt,
  className = '',
}: {
  usd?: number;
  bdt?: number;
  className?: string;
}) {
  return (
    <span className={`font-mono ${className}`}>
      {typeof usd === 'number' ? <span className="text-bone-50">{formatUsd(usd)}</span> : null}
      {typeof usd === 'number' && typeof bdt === 'number' ? (
        <span className="mx-1.5 text-bone-500">/</span>
      ) : null}
      {typeof bdt === 'number' ? <span className="text-bone-200">{formatBdt(bdt)}</span> : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons as links                                                            */
/* -------------------------------------------------------------------------- */

export function LinkButton({
  href,
  children,
  variant = 'primary',
  className = '',
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'aura';
  className?: string;
  ariaLabel?: string;
}) {
  const variantClass =
    variant === 'primary' ? 'btn-primary' : variant === 'aura' ? 'btn-aura' : 'btn-ghost';

  const isInternal = href.startsWith('/') || href.startsWith('#');

  if (isInternal) {
    return (
      <Link href={href} aria-label={ariaLabel} className={`btn ${variantClass} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target="_blank"
      rel="noreferrer noopener"
      className={`btn ${variantClass} ${className}`}
    >
      {children}
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* Small utilities                                                             */
/* -------------------------------------------------------------------------- */

export function Rule({ className = '' }: { className?: string }) {
  return <div className={`rule ${className}`} aria-hidden="true" />;
}

/** Arrow used on text links — kept inline so there is no icon dependency. */
export function ArrowIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false">
      <path
        d="M4 10h11m0 0-4.2-4.2M15 10l-4.2 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false">
      <path
        d="M10 2.5 16 5v5c0 3.6-2.5 6.4-6 7.5-3.5-1.1-6-3.9-6-7.5V5l6-2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7.4 10.2 9.3 12l3.3-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
