import type { Metadata } from 'next';
import { OrderConfirmationClient } from '@/components/order-confirmation-client';

export const metadata: Metadata = {
  title: 'Order confirmation',
  description: 'Copy your order summary and send payment proof to support for manual verification.',
  robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
  return <section className="shell page-top pb-24"><OrderConfirmationClient /></section>;
}
