'use client';

import { useEffect, useState } from 'react';

const FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Dhaka',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

/** A live Dhaka clock: small, quiet proof that a real team is behind the site. */
export function StoreClock({ className = '' }: { className?: string }) {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const tick = () => setTime(FORMAT.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className={`store-clock ${className}`} title="Bangladesh Standard Time (UTC+6)">
      <span className="store-clock__dot" aria-hidden="true" />
      <span className="store-clock__label">UTC+6</span>
      <span className="store-clock__time">{time}</span>
    </span>
  );
}
