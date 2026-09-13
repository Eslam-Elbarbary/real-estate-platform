/** Mirrors NestJS PublicPropertyCardDto / catalog / location tree shapes. */

export interface PublicNamedRef {
  id: string;
  nameEn: string;
  nameAr: string | null;
  slug?: string | null;
}

export interface PublicTypeRef {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
}

export interface PublicLocationSummary {
  country: PublicNamedRef | null;
  city: PublicNamedRef | null;
  area: PublicNamedRef | null;
  district: PublicNamedRef | null;
  summary: string;
}

export interface PublicPrimaryImage {
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface PublicCoordinates {
  latitude: number | null;
  longitude: number | null;
}

export type ApiPaymentType = 'CASH' | 'INSTALLMENT' | 'CASH_OR_INSTALLMENT';

export type ApiFinishingType =
  | 'UNFINISHED'
  | 'SEMI_FINISHED'
  | 'FINISHED'
  | 'LUX'
  | 'SUPER_LUX';

export interface PublicPropertyCardDto {
  id: string;
  slug: string;
  title: string | null;
  referenceNumber: string | null;
  price: number | null;
  pricePerSqm: number | null;
  currency: string;
  paymentType: ApiPaymentType | null;
  finishingType: ApiFinishingType | null;
  transactionType: PublicTypeRef | null;
  propertyType: PublicTypeRef | null;
  location: PublicLocationSummary;
  coordinates: PublicCoordinates;
  primaryImage: PublicPrimaryImage | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  publishedAt: string | null;
}

export interface CatalogTypeDto {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
}

export interface CatalogFeatureDto extends CatalogTypeDto {
  category: string | null;
}

export interface LocationTreeDistrict {
  id: string;
  areaId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
}

export interface LocationTreeArea {
  id: string;
  cityId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  districts: LocationTreeDistrict[];
}

export interface LocationTreeCity {
  id: string;
  countryId: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  areas: LocationTreeArea[];
}

export interface LocationTreeCountry {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
  cities: LocationTreeCity[];
}

export interface PublicCompoundDetailsDto {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
}

export type ApiRentPeriod = 'DAILY' | 'MONTHLY' | 'YEARLY';

export type ApiMediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'FLOOR_PLAN';

export interface PublicPropertyPaymentDto {
  type: ApiPaymentType | null;
  downPayment: number | null;
  installmentYears: number | null;
  monthlyInstallment: number | null;
}

export interface PublicPropertyMediaDto {
  id: string;
  mediaAssetId: string;
  url: string;
  type: ApiMediaType;
  sortOrder: number;
  isPrimary: boolean;
  width?: number | null;
  height?: number | null;
}

export interface PublicPropertyFeatureDto {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string | null;
  category: string | null;
}

export interface PublicOwnerCardDto {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

/** Mirrors NestJS PublicPropertyDetailsDto. */
export interface PublicPropertyDetailsDto {
  id: string;
  slug: string;
  title: string | null;
  description: string | null;
  referenceNumber: string | null;
  price: number | null;
  pricePerSqm: number | null;
  currency: string;
  payment: PublicPropertyPaymentDto;
  finishingType: ApiFinishingType | null;
  rentPeriod: ApiRentPeriod | null;
  propertyType: PublicTypeRef | null;
  transactionType: PublicTypeRef | null;
  country: PublicNamedRef | null;
  city: PublicNamedRef | null;
  area: PublicNamedRef | null;
  district: PublicNamedRef | null;
  compound: PublicNamedRef | null;
  developer: PublicNamedRef | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  floor: number | null;
  yearBuilt: number | null;
  furnished: boolean | null;
  viewCount: number;
  favoritesCount: number;
  images: PublicPropertyMediaDto[];
  features: PublicPropertyFeatureDto[];
  owner: PublicOwnerCardDto;
  similar: PublicPropertyCardDto[];
  publishedAt: string | null;
}

export interface PropertiesSearchMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
