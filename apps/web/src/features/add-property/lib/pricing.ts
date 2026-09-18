import type { ListingDraft, ListingPricingDraft } from '../types';

export function getListingPublicationFee(_input: {
  transaction: ListingDraft['transaction'];
  propertyType: ListingDraft['propertyType'];
  locationId?: string;
}): {
  amountEgp: number;
  currency: 'EGP';
  reason: string;
} {
  void _input;
  return {
    amountEgp: 750,
    currency: 'EGP',
    reason: 'رسوم نشر إعلان لهذا الموقع',
  };
}

export function resolvePricingAmount(
  pricing: ListingPricingDraft | null | undefined,
): number | undefined {
  if (!pricing || pricing.price == null) return undefined;
  if (!Number.isFinite(pricing.price) || pricing.price <= 0) return undefined;
  return pricing.price;
}

export function resolveListingDisplayPrice(
  draft: ListingDraft,
): number | undefined {
  return resolvePricingAmount(draft.pricing);
}

export function showsInstallmentFields(
  paymentType: ListingPricingDraft['paymentType'],
): boolean {
  return (
    paymentType === 'INSTALLMENT' || paymentType === 'CASH_OR_INSTALLMENT'
  );
}

export function formatPaymentTypeLabel(
  paymentType: ListingPricingDraft['paymentType'],
): string {
  switch (paymentType) {
    case 'CASH':
      return 'نقدي';
    case 'INSTALLMENT':
      return 'تقسيط';
    case 'CASH_OR_INSTALLMENT':
      return 'نقدي أو تقسيط';
    default:
      return '—';
  }
}

export function formatRentPeriodLabel(
  rentPeriod: ListingPricingDraft['rentPeriod'],
): string {
  switch (rentPeriod) {
    case 'DAILY':
      return 'يومي';
    case 'MONTHLY':
      return 'شهري';
    case 'YEARLY':
      return 'سنوي';
    default:
      return '—';
  }
}
