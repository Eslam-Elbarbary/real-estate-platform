import type { Property, PropertyPaymentPlan } from '@/types';

export function getPaymentPlan(property: Property): PropertyPaymentPlan | null {
  if (property.transactionType === 'rent') {
    return null;
  }

  const supportsInstallment =
    property.paymentType === 'installment' ||
    property.paymentType === 'cash_or_installment';

  if (
    !supportsInstallment ||
    property.downPayment === undefined ||
    property.installmentYears === undefined
  ) {
    return null;
  }

  const monthlyInstallment =
    property.monthlyInstallment ??
    Math.round(
      (property.price - property.downPayment) /
        (property.installmentYears * 12),
    );

  return {
    totalPrice: property.price,
    downPayment: property.downPayment,
    installmentYears: property.installmentYears,
    monthlyInstallment,
    currency: property.currency,
  };
}
