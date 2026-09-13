import type {
  FinishingType,
  PaymentType,
  PropertyMediaType,
  PublicNamedRef,
  PublicTypeRef,
  RentPeriod,
} from './types';

export function formatTypeLabel(ref: PublicTypeRef | PublicNamedRef | null): string {
  if (!ref) {
    return '—';
  }
  return ref.nameAr ?? ref.nameEn;
}

const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  CASH: 'نقدي',
  INSTALLMENT: 'تقسيط',
  CASH_OR_INSTALLMENT: 'نقدي أو تقسيط',
};

const FINISHING_TYPE_LABELS: Record<FinishingType, string> = {
  UNFINISHED: 'بدون تشطيب',
  SEMI_FINISHED: 'نصف تشطيب',
  FINISHED: 'تشطيب كامل',
  LUX: 'فاخر',
  SUPER_LUX: 'فاخر جداً',
};

const RENT_PERIOD_LABELS: Record<RentPeriod, string> = {
  MONTHLY: 'شهري',
  YEARLY: 'سنوي',
  DAILY: 'يومي',
};

const MEDIA_TYPE_LABELS: Record<PropertyMediaType, string> = {
  IMAGE: 'صورة',
  VIDEO: 'فيديو',
  DOCUMENT: 'مستند',
};

export function formatPaymentType(value: PaymentType | null | undefined): string {
  if (!value) {
    return '—';
  }
  return PAYMENT_TYPE_LABELS[value] ?? value;
}

export function formatFinishingType(value: FinishingType | null | undefined): string {
  if (!value) {
    return '—';
  }
  return FINISHING_TYPE_LABELS[value] ?? value;
}

export function formatRentPeriod(value: RentPeriod | null | undefined): string {
  if (!value) {
    return '—';
  }
  return RENT_PERIOD_LABELS[value] ?? value;
}

export function formatMediaType(value: PropertyMediaType | null | undefined): string {
  if (!value) {
    return '—';
  }
  return MEDIA_TYPE_LABELS[value] ?? value;
}

export function formatPrice(price: number | null, currency: string): string {
  if (price == null) {
    return '—';
  }

  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) {
    return '—';
  }

  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatNumber(value: number | null | undefined, suffix = ''): string {
  if (value == null) {
    return '—';
  }
  return `${value.toLocaleString('ar-EG')}${suffix}`;
}

export function formatBoolean(value: boolean | null | undefined): string {
  if (value == null) {
    return '—';
  }
  return value ? 'نعم' : 'لا';
}
