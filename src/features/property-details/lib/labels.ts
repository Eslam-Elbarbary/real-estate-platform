import { uiLabels } from '@/config/labels';
import type { FinishingType, PaymentType, PropertySeller } from '@/types';

export function getFinishingLabel(value: FinishingType): string {
  switch (value) {
    case 'unfinished':
      return uiLabels.finishingUnfinished;
    case 'semi_finished':
      return uiLabels.finishingSemi;
    case 'finished':
      return uiLabels.finishingFinished;
    case 'lux':
      return uiLabels.finishingLux;
    case 'super_lux':
      return uiLabels.finishingSuperLux;
    default:
      return value;
  }
}

export function getPaymentLabel(value: PaymentType): string {
  switch (value) {
    case 'cash':
      return uiLabels.paymentCash;
    case 'installment':
      return uiLabels.paymentInstallment;
    case 'cash_or_installment':
      return uiLabels.paymentCashOrInstallment;
    default:
      return value;
  }
}

export function getSellerTypeLabel(type: PropertySeller['type']): string {
  switch (type) {
    case 'owner':
      return uiLabels.sellerTypeOwner;
    case 'broker':
      return uiLabels.sellerTypeBroker;
    case 'agency':
      return uiLabels.sellerTypeAgency;
    case 'developer':
      return uiLabels.sellerTypeDeveloper;
    default:
      return type;
  }
}
