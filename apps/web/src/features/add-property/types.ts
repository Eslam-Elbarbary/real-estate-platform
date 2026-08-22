import type { FinishingType, PropertyType, TransactionType } from '@/types';

export type ListingDraftStep =
  | 'basic'
  | 'details'
  | 'price'
  | 'description'
  | 'media'
  | 'publish';

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

export type ListingAmenityId =
  | 'security'
  | 'elevator'
  | 'landline'
  | 'private_garden'
  | 'natural_gas'
  | 'balcony'
  | 'maid_room'
  | 'covered_garage'
  | 'kitchen_appliances'
  | 'kids_area'
  | 'ac'
  | 'water_meter'
  | 'pool'
  | 'electricity_meter'
  | 'pets_allowed';

export interface ListingDetailsDraft {
  areaSqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number | string;
  buildOrDeliveryYear?: number;
  views: ListingViewType[];
  finishing?: FinishingType | 'extra_super_lux';
  registrationStatus?: ListingRegistrationStatus;
  mortgageEligible?: boolean;
  amenities: ListingAmenityId[];
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
  previewUrl: string;
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
  transaction: TransactionType | null;
  propertyType: PropertyType | null;
  locationId?: string;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
  details: ListingDetailsDraft;
  pricing: ListingPricingDraft;
  description: ListingDescriptionDraft;
  media: ListingMediaDraft;
  currentStep: ListingDraftStep;
  status: ListingDraftStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ListingPublicationFee {
  amountEgp: number;
  currency: 'EGP';
  reason: string;
}
