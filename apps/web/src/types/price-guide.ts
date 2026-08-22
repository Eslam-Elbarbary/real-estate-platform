export interface PriceGuide {
  id: string;
  locationSlug: string;
  locationName: string;
  propertyType: string;
  transactionType: 'sale' | 'rent';
  averagePrice: number;
  averagePricePerSqm: number;
  currency: 'EGP';
  sampleSize: number;
  updatedAt: string;
}
