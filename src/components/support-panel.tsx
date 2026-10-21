import Link from 'next/link';
import { DISCORD_URL, TELEGRAM_URL, WHATSAPP_URL } from '@/data/store';
import { resolveSupportLink } from '@/lib/links';
import { ArrowIcon } from '@/components/ui';

function DiscordIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M7.6 17.2c-1.4-.4-3.1-1.2-3.1-1.2.6-3.2 1.9-6.1 3.6-8.4l1.9-.6 1 1.7a13 13 0 0 1 4 0l1-1.7 1.9.6c1.7 2.3 3 5.2 3.6 8.4 0 0-1.7.8-3.1 1.2l-1-1.7c.7-.2 1.4-.6 2-1.1a9.6 9.6 0 0 1-9.8 0c-.6.5-1.3.9-2 1.1l-1 1.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="9.4" cy="12.4" r="1.2" fill="currentColor" />
      <circle cx="14.6" cy="12.4" r="1.2" fill="currentColor" />
    </svg>
  );
}

function TelegramIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M20.4 4.3 3.9 10.6c-1 .4-1 1.7.1 1.9l3.9.9 1.5 4.6c.3.9 1.1 1 1.7.4l2.1-2 3.7 2.7c.7.5 1.6.1 1.8-.8l2.4-12.4c.2-1-.6-1.7-1.7-1.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M8.2 13.1 17 6.6l-6.4 7.2-.3 3.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M20.1 11.7a8.1 8.1 0 0 1-11.9 7.1L3 20l1.3-5a8.1 8.1 0 1 1 15.8-3.3Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8.6 7.9c-.3-.6-.6-.6-.9-.6h-.5c-.2 0-.6.1-.9.5s-1.1 1.1-1.1 2.6 1.1 3 1.3 3.2c.2.2 2.1 3.3 5.2 4.5 2.6 1 3.1.8 3.7.7.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.7-.4l-2.1-1c-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-.9-2Z" fill="currentColor" transform="translate(2 0) scale(.82)" />
    </svg>
  );
}

type Channel = {
  id: string;
  name: string;
  body: string;
  href?: string;
  configured: boolean;
  icon: typeof DiscordIcon;
  buttonClass: string;
};

export function SupportPanel({
  productName,
  className = '',
}: {
  productName?: string;
  className?: string;
}) {
  const discord = resolveSupportLink(DISCORD_URL);
  const telegram = resolveSupportLink(TELEGRAM_URL);
  const whatsapp = resolveSupportLink(WHATSAPP_URL);

  const channels: Channel[] = [
    {
      id: 'discord',
      name: 'Discord',
      body: productName
        ? `Send us "${productName}" and the plan you want. We will confirm the price and payment details with you.`
        : 'Tell us the product, the plan and how you plan to pay. We will confirm everything before you pay.',
      href: discord.href,
      configured: discord.configured,
      icon: DiscordIcon,
      buttonClass: 'btn-primary',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      body: 'Prefer Telegram? Send the same details there and we will reply.',
      href: telegram.href,
      configured: telegram.configured,
      icon: TelegramIcon,
      buttonClass: 'btn-ghost',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      body: 'Or message us on WhatsApp with the same details.',
      href: whatsapp.href,
      configured: whatsapp.configured,
      icon: WhatsAppIcon,
      buttonClass: 'btn-ghost',
    },
  ];

  return (
    <div className={`row-scroll row-scroll--3 ${className}`}>
      {channels.map((channel) => {
        const Icon = channel.icon;
        return (
          <article key={channel.id} className="panel flex flex-col p-5">
            <div className="flex items-center gap-3">
              <span className="text-bone-100">
                <Icon />
              </span>
              <h3 className="font-display text-lg text-bone-50">{channel.name}</h3>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-bone-300">{channel.body}</p>

            <div className="mt-auto pt-5">
              {channel.configured && channel.href ? (
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`btn ${channel.buttonClass}`}
                >
                  Open {channel.name}
                  <ArrowIcon className="h-4 w-4" />
                </a>
              ) : (
                <>
                  <button type="button" className="btn btn-ghost" disabled>
                    Open {channel.name}
                  </button>
                  <p className="mt-3 text-xs leading-relaxed text-bone-500">
                    Not available right now. Please use one of the other channels.
                  </p>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/** What a buyer should include in their message. */
export function ContactChecklist({ productName }: { productName?: string }) {
  const items = [
    productName ? `Product: ${productName}` : 'The product name',
    'The plan (duration) you want',
    'The price shown on the product page',
    'How you paid: bKash, Nagad or Binance',
    'Your transaction ID',
  ];

  return (
    <div className="panel-quiet h-full p-5">
      <h3 className="font-display text-base text-bone-50">What to send us</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-bone-200">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-ink-700 pt-4 text-xs leading-relaxed text-bone-500">
        Never send a PIN, password, OTP or wallet private key.{' '}
        <Link href="/payments" className="text-crimson-300 underline underline-offset-4 hover:text-crimson-200">
          See payment details
        </Link>
        .
      </p>
    </div>
  );
}
