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
    property.deliveryYear
      ? {
          label: uiLabels.detailDeliveryYear,
          value: String(property.deliveryYear),
        }
      : null,
    property.viewType
      ? { label: uiLabels.detailView, value: property.viewType }
      : null,
    {
      label: uiLabels.detailFinishing,
      value: getFinishingLabel(property.finishingType),
    },
    property.gardenArea
      ? {
          label: uiLabels.detailGardenArea,
          value: formatArea(property.gardenArea),
        }
      : null,
    {
      label: uiLabels.detailPaymentType,
      value: getPaymentLabel(property.paymentType),
    },
    {
      label: uiLabels.detailSellerType,
      value: getSellerTypeLabel(property.seller.type),
    },
    {
      label: uiLabels.detailReference,
      value: property.referenceNumber,
    },
    {
      label: uiLabels.detailPricePerMeter,
      value: formatCurrency(property.pricePerSqm, property.currency),
    },
  ];

  return fields.filter((field): field is DetailField => Boolean(field));
}
