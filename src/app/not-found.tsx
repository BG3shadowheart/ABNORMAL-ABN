import Link from 'next/link';
import { ArrowIcon, LinkButton } from '@/components/ui';
import { PLATFORMS } from '@/data/products';

export default function NotFound() {
  return (
    <section className="shell page-top min-h-[70svh]">
      <p className="text-sm text-bone-400">Error 404</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-semibold leading-tight text-bone-50">
        We could not find that page
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-bone-300">
        The link may be old or mistyped. Head back to the products and carry on from there.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton href="/products">
          See all products
          <ArrowIcon className="h-4 w-4" />
        </LinkButton>
        <LinkButton href="/" variant="ghost">
          Back to home
        </LinkButton>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {PLATFORMS.map((platform) => (
          <Link key={platform.id} href={platform.href} className="filter-pill">
            {platform.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
