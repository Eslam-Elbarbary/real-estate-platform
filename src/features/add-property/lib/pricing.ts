import type {
  DeveloperPricing,
  ListingDraft,
  ListingPublicationFee,
  OwnerInstallmentPricing,
} from '../types';

export function getListingPublicationFee(_input: {
  transaction: ListingDraft['transaction'];
  propertyType: ListingDraft['propertyType'];
  locationId?: string;
}): ListingPublicationFee {
  void _input;
  // Demo default matching reference listing fee for demonstrated location.
  return {
    amountEgp: 750,
    currency: 'EGP',
    reason: 'رسوم نشر إعلان لهذا الموقع',
  };
}

export function downPaymentAmount(pricing: DeveloperPricing): number | null {
  const total = pricing.installmentTotalPrice;
  const value = pricing.downPayment.value;
  if (total == null || value == null) return null;
  if (pricing.downPayment.mode === 'percent') {
    return Math.round((total * value) / 100);
  }
  return Math.min(value, total);
}

export function downPaymentPercent(pricing: DeveloperPricing): number | null {
  const total = pricing.installmentTotalPrice;
  const amount = downPaymentAmount(pricing);
  if (total == null || total <= 0 || amount == null) return null;
  return Math.round((amount / total) * 1000) / 10;
}

export function monthlyInstallment(pricing: DeveloperPricing): number | null {
  const total = pricing.installmentTotalPrice;
  const down = downPaymentAmount(pricing);
  const months = pricing.installmentDurationMonths;
  if (total == null || down == null || !months || months <= 0) return null;
  const remaining = Math.max(0, total - down);
  return Math.round(remaining / months);
}

export function ownerInstallmentAskingPrice(
  pricing: OwnerInstallmentPricing,
): number {
  return (
    (pricing.totalPaid ?? 0) +
    (pricing.overPrice ?? 0) +
    (pricing.maintenanceDeposit ?? 0)
  );
}

export function resolveListingDisplayPrice(draft: ListingDraft): number | undefined {
  const pricing = draft.pricing;
  if (!pricing || pricing.mode == null) return undefined;
  if (pricing.mode === 'owner_cash') return pricing.price;
  if (pricing.mode === 'rent') return pricing.price;
  if (pricing.mode === 'developer') {
    return pricing.cashPrice ?? pricing.installmentTotalPrice;
  }
  if (pricing.mode === 'owner_installments') {
    return ownerInstallmentAskingPrice(pricing);
  }
  return undefined;
}
