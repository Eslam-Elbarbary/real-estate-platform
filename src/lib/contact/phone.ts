export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function getCallHref(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) {
    return null;
  }

  return `tel:${trimmed}`;
}

export function getWhatsAppHref(
  phone: string,
  message?: string,
): string | null {
  const digits = digitsOnly(phone);
  if (digits.length < 8) {
    return null;
  }

  const base = `https://wa.me/${digits}`;
  if (!message) {
    return base;
  }

  return `${base}?text=${encodeURIComponent(message)}`;
}
