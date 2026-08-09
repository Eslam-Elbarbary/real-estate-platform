import type { PropertySeller } from '@/types';

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function getCallHref(phone: string): string {
  return `tel:${phone}`;
}

export function getWhatsAppHref(seller: PropertySeller, message?: string): string {
  const phone = digitsOnly(seller.whatsapp ?? seller.phone);
  const base = `https://wa.me/${phone}`;
  if (!message) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(message)}`;
}
