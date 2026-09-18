import type { FinishingType, PropertyType, TransactionType } from '@/types';
import type { ApiPropertyStatus } from '@/types/api/my-property';

export type ListingDraftStep =
  | 'basic'
  | 'details'
  | 'price'
  | 'description'
  | 'contact'
  | 'media'
  | 'preview'
  | 'publish';

/** Legacy cookie status — prefer `apiStatus` from the backend. */
export type ListingDraftStatus =
  | 'draft'
  | 'ready_to_publish'
  | 'payment_pending'
  | 'published';

export type ListingPaymentMode =
  | 'developer'
  | 'owner_cash'
  | 'owner_installments';

/** @deprecated Prefer catalog feature UUIDs in amenities. */
export type ListingAmenityId = string;

export interface ListingDetailsDraft {
  areaSqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number | string;
  buildOrDeliveryYear?: number;
  furnished?: boolean;
  rentPeriod?: 'DAILY' | 'MONTHLY' | 'YEARLY';
  finishing?: FinishingType;
  /** PropertyView catalog UUIDs (PATCH /properties/me/:id/details). */
  propertyViewIds?: string[];
  /** PropertyLegalStatus catalog UUID (same details PATCH). */
  legalStatusId?: string;
  mortgageEligible?: boolean;
  /** Selected Feature catalog UUIDs (PUT /properties/me/:id/features). */
  amenities: string[];
}

export type ApiPaymentType = 'CASH' | 'INSTALLMENT' | 'CASH_OR_INSTALLMENT';
export type ApiRentPeriodCode = 'DAILY' | 'MONTHLY' | 'YEARLY';

/**
 * Pricing aligned with Property payment columns / admin wizard.
 * Survives via API PATCH /properties/me/:id (not cookies).
 */
export interface ListingPricingDraft {
  price?: number;
  currency: string;
  /** Sale only — maps to backend paymentType */
  paymentType?: ApiPaymentType | '';
  downPayment?: number;
  installmentYears?: number;
  monthlyInstallment?: number;
  /** Rent only */
  rentPeriod?: ApiRentPeriodCode | '';
}

export function emptyPricingDraft(): ListingPricingDraft {
  return {
    currency: 'EGP',
    paymentType: '',
    rentPeriod: '',
  };
}

export interface LocalizedListingDescription {
  title: string;
  description: string;
  address: string;
}

export interface ListingDescriptionDraft {
  ar: LocalizedListingDescription;
  en: LocalizedListingDescription;
}

export interface ListingImageDraft {
  id: string;
  url: string;
  name: string;
  size: number;
  order: number;
  isCover: boolean;
}

export interface ListingMediaDraft {
  images: ListingImageDraft[];
  videoUrl?: string;
}

export type ListingContactSource = 'OWNER' | 'CUSTOM';
export type ListingContactType = 'OWNER' | 'AGENT' | 'COMPANY';

export interface ListingContactDraft {
  contactSource: ListingContactSource;
  contactType: ListingContactType;
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export interface ListingDraft {
  id: string;
  ownerUserId: string;
  /** Authoritative backend property status. */
  apiStatus: ApiPropertyStatus;
  transaction: TransactionType | null;
  propertyType: PropertyType | null;
  /** Backend catalog UUIDs when known from API. */
  propertyTypeId?: string;
  transactionTypeId?: string;
  areaId?: string;
  districtId?: string;
  compoundId?: string;
  countryId?: string;
  cityId?: string;
  address?: string;
  locationId?: string;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
  details: ListingDetailsDraft;
  pricing: ListingPricingDraft;
  description: ListingDescriptionDraft;
  contact: ListingContactDraft;
  media: ListingMediaDraft;
  currentStep: ListingDraftStep;
  /** @deprecated Prefer apiStatus */
  status: ListingDraftStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ListingPublicationFee {
  amountEgp: number;
  currency: 'EGP';
  reason: string;
}
