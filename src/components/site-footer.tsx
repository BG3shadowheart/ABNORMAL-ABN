import Link from 'next/link';
import {
  CATALOG_HREF,
  DISCORD_URL,
  FOOTER_NOTE,
  STORE_NAME,
  TELEGRAM_URL,
  WHATSAPP_URL,
} from '@/data/store';
import { PLATFORMS } from '@/data/products';
import { LogoMark } from '@/components/logo';
import { resolveSupportLink } from '@/lib/links';

const STORE_LINKS = [
  { label: 'All products', href: CATALOG_HREF },
  { label: 'How to pay', href: '/payments' },
  { label: 'How ordering works', href: '/support#how-to-order' },
  { label: 'Support', href: '/support' },
];

export function SiteFooter() {
  const contacts = [
    { label: 'Discord', link: resolveSupportLink(DISCORD_URL) },
    { label: 'Telegram', link: resolveSupportLink(TELEGRAM_URL) },
    { label: 'WhatsApp', link: resolveSupportLink(WHATSAPP_URL) },
  ];
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-9 w-9" />
              <span className="font-display text-base font-semibold tracking-[0.12em] text-bone-50">
                {STORE_NAME}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone-400">
              PC, Android and iOS products. Got a question before you buy? Message us on
              Discord, Telegram or WhatsApp.
            </p>
          </div>

          <FooterColumn
            title="Platforms"
            links={PLATFORMS.map((platform) => ({ label: platform.label, href: platform.href }))}
          />
          <FooterColumn title="Store" links={STORE_LINKS} />

          <div>
            <h3 className="footer-title">Talk to us</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {contacts.map(({ label, link }) => (
                <li key={label}>
                  {link.configured ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="footer-link"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-bone-500">{label} (not set up yet)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ink-700 pt-6 text-xs text-bone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {STORE_NAME}
          </p>
          <p className="sm:text-right">{FOOTER_NOTE}</p>
        </div>

        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-bone-500">
          Third-party tools can go against a game&apos;s terms of service. Check the rules that apply
          to you before you buy. Never share a PIN, password, OTP or private key with anyone.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="footer-title">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={`${title}-${link.href}`}>
            <Link href={link.href} className="footer-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
