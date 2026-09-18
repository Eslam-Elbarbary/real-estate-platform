import { uiLabels } from '@/config/labels';
import { formatArea } from '@/lib/formatting/area';
import { formatCurrency } from '@/lib/formatting/currency';
import type { Property } from '@/types';
import {
  getFinishingLabel,
  getPaymentLabel,
  getSellerTypeLabel,
} from './labels';

export interface DetailField {
  label: string;
  value: string;
}

export function buildDetailFields(property: Property): DetailField[] {
  const fields: Array<DetailField | null> = [
    property.floor !== undefined
      ? { label: uiLabels.detailFloor, value: String(property.floor) }
      : null,
    property.yearBuilt
      ? {
          label: uiLabels.detailYearBuilt,
          value: String(property.yearBuilt),
        }
      : null,
    property.deliveryYear
      ? {
          label: uiLabels.detailDeliveryYear,
          value: String(property.deliveryYear),
        }
      : null,
    property.viewTypes?.length
      ? { label: uiLabels.detailViews, value: property.viewTypes.join('، ') }
      : null,
    property.legalStatusLabel
      ? {
          label: uiLabels.detailLegalStatus,
          value: property.legalStatusLabel,
        }
      : null,
    property.finishingType
      ? {
          label: uiLabels.detailFinishing,
          value: getFinishingLabel(property.finishingType),
        }
      : null,
    property.furnished !== undefined
      ? {
          label: uiLabels.detailFurnished,
          value: property.furnished
            ? uiLabels.detailFurnishedYes
            : uiLabels.detailFurnishedNo,
        }
      : null,
    property.gardenArea
      ? {
          label: uiLabels.detailGardenArea,
          value: formatArea(property.gardenArea),
        }
      : null,
    property.paymentType
      ? {
          label: uiLabels.detailPaymentType,
          value: getPaymentLabel(property.paymentType),
        }
      : null,
    property.seller.name
      ? {
          label: uiLabels.detailSellerType,
          value: getSellerTypeLabel(property.seller.type),
        }
      : null,
    property.referenceNumber
      ? {
          label: uiLabels.detailReference,
          value: property.referenceNumber,
        }
      : null,
    property.pricePerSqm > 0
      ? {
          label: uiLabels.detailPricePerMeter,
          value: formatCurrency(property.pricePerSqm, property.currency),
        }
      : null,
  ];

  return fields.filter((field): field is DetailField => Boolean(field));
}
