export type LocationLevel =
  | 'governorate'
  | 'city'
  | 'area'
  | 'neighborhood';

export interface Location {
  id: string;
  slug: string;
  name: string;
  level: LocationLevel;
  parentSlug?: string;
  propertyCount: number;
  latitude?: number;
  longitude?: number;
  coverImageUrl?: string;
}

export interface Neighborhood {
  id: string;
  slug: string;
  name: string;
  areaSlug: string;
  areaName: string;
  citySlug: string;
  cityName: string;
  governorateSlug: string;
  governorateName: string;
  averagePricePerSqm?: number;
  propertyCount: number;
  description?: string;
}
