import type { PropertyContact } from '@/types';

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function hasUsableContactPhone(contact: PropertyContact | null | undefined): boolean {
  if (!contact) return false;
  return (
    digitsOnly(contact.phone).length >= 5 ||
    digitsOnly(contact.whatsapp).length >= 5
  );
}

export function getContactCallHref(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed || digitsOnly(trimmed).length < 5) {
    return null;
  }
  return `tel:${trimmed}`;
}

export function getContactWhatsAppHref(
  phone: string,
  message?: string,
): string | null {
  const digits = digitsOnly(phone);
  if (digits.length < 5) {
    return null;
  }
  const base = `https://wa.me/${digits}`;
  if (!message) {
    return base;
  }
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildPropertyInterestMessage(title: string): string {
  return `السلام عليكم، أنا مهتم بالعقار ${title.trim()}`;
}

export function getContactTypeLabel(
  type: PropertyContact['type'],
): string {
  switch (type) {
    case 'AGENT':
      return 'وسيط';
    case 'COMPANY':
      return 'شركة';
    default:
      return 'مالك';
  }
}
