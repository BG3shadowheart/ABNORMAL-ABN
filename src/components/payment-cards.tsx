import Link from 'next/link';
import { PAYMENT_METHODS, PAYMENT_SAFETY_NOTE } from '@/data/store';
import { CopyButton } from '@/components/copy-button';
import { ShieldIcon } from '@/components/ui';

/**
 * The three ways to pay. `row` lays them out as a sideways-scrolling row on
 * small screens (and a normal three-column grid on large ones).
 */
export function PaymentCards({
  className = '',
  variant = 'grid',
}: {
  className?: string;
  variant?: 'grid' | 'row';
}) {
  return (
    <div className={`${variant === 'row' ? 'row-scroll row-scroll--3' : 'grid gap-4 md:grid-cols-3'} ${className}`}>
      {PAYMENT_METHODS.map((method) => (
        <article key={method.id} className="panel flex flex-col p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg text-bone-50">{method.name}</h3>
            {method.kind ? <span className="text-xs text-bone-400">{method.kind}</span> : null}
          </div>

          <div className="mt-5">
            <div className="text-xs text-bone-500">{method.fieldLabel}</div>
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-lg text-bone-50">{method.value}</span>
              <CopyButton value={method.value} label="Copy" />
            </div>
          </div>

          <p className="mt-auto border-t border-ink-700 pt-4 text-sm leading-relaxed text-bone-400">
            {method.note}
          </p>
        </article>
      ))}
    </div>
  );
}

export function PaymentSafetyNote({ className = '' }: { className?: string }) {
  return (
    <div
      className={`panel-quiet flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-crimson-300">
          <ShieldIcon className="h-5 w-5" />
        </span>
        <p className="max-w-3xl text-sm leading-relaxed text-bone-300">{PAYMENT_SAFETY_NOTE}</p>
      </div>
      <Link href="/support" className="btn btn-ghost shrink-0 !px-4 !py-2 !text-xs">
        Ask us first
      </Link>
    </div>
  );
}
