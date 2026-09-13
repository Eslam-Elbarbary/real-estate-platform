import type { FinishingType, PropertyType, TransactionType } from '@/types';
import type { ApiPropertyStatus } from '@/types/api/my-property';

export type ListingDraftStep =
  | 'basic'
  | 'details'
  | 'price'
  | 'description'
  | 'media'
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

export type ListingRegistrationStatus =
  | 'registered'
  | 'registerable'
  | 'urban_communities'
  | 'unsure';

export type ListingViewType =
  | 'main_street'
  | 'side_street'
  | 'corner'
  | 'rear'
  | 'garden'
  | 'nile'
  | 'lake'
  | 'pool'
  | 'sea'
  | 'plaza'
  | 'golf'
  | 'club'
  | 'other';

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
  views: ListingViewType[];
  finishing?: FinishingType | 'extra_super_lux';
  registrationStatus?: ListingRegistrationStatus;
  mortgageEligible?: boolean;
  /** Selected Feature catalog UUIDs (PUT /properties/me/:id/features). */
  amenities: string[];
}

export interface DeveloperPricing {
  mode: 'developer';
  cashPrice?: number;
  installmentTotalPrice?: number;
  downPayment: {
    mode: 'egp' | 'percent';
    value?: number;
  };
  installmentDurationMonths?: number;
}

export interface OwnerCashPricing {
  mode: 'owner_cash';
  price: number;
}

export interface OwnerInstallmentPricing {
  mode: 'owner_installments';
  contractPrice: number;
  overPrice?: number;
  maintenanceDeposit?: number;
  totalPaid: number;
  remainingInstallmentMonths: number;
}

export interface RentPricing {
  mode: 'rent';
  price: number;
  pricingPeriod: 'monthly' | 'daily' | 'yearly';
}

export type ListingPricingDraft =
  | DeveloperPricing
  | OwnerCashPricing
  | OwnerInstallmentPricing
  | RentPricing
  | { mode: null };

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
  locationId?: string;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
  details: ListingDetailsDraft;
  pricing: ListingPricingDraft;
  description: ListingDescriptionDraft;
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
