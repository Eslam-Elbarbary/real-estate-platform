/**
 * Shared property-type detail field visibility rules.
 * Used by admin wizard and public add-property.
 * Keys are PropertyType.code (normalized to UPPERCASE).
 */

export type PropertyDetailField =
  | 'areaSqm'
  | 'bedrooms'
  | 'bathrooms'
  | 'floor'
  | 'yearBuilt'
  | 'finishingType'
  | 'furnished'
  | 'propertyViews'
  | 'legalStatus';

export type PropertyTypeFieldConfig = {
  fields: readonly PropertyDetailField[];
  /** Override Arabic label for `floor` (e.g. villas → عدد الأدوار). */
  floorLabel?: string;
  /**
   * Catalog feature codes to highlight as recommended for this type.
   * Features remain catalog-driven; this is UX guidance only.
   */
  recommendedFeatureCodes?: readonly string[];
};

const RESIDENTIAL_CORE: readonly PropertyDetailField[] = [
  'areaSqm',
  'bedrooms',
  'bathrooms',
  'floor',
  'yearBuilt',
  'finishingType',
  'furnished',
  'propertyViews',
  'legalStatus',
];

const COMMERCIAL_CORE: readonly PropertyDetailField[] = [
  'areaSqm',
  'floor',
  'yearBuilt',
  'finishingType',
  'propertyViews',
  'legalStatus',
];

const COMMERCIAL_FEATURES = ['PARKING', 'SECURITY', 'ELEVATOR'] as const;

/** Fallback when type code is unknown / not yet selected. */
export const DEFAULT_PROPERTY_TYPE_FIELDS: PropertyTypeFieldConfig = {
  fields: RESIDENTIAL_CORE,
};

/**
 * Keys are PropertyType.code from catalogs API (seed-aligned).
 */
export const PROPERTY_TYPE_FIELD_RULES: Record<string, PropertyTypeFieldConfig> =
  {
    APARTMENT: {
      fields: RESIDENTIAL_CORE,
      floorLabel: 'الدور',
      recommendedFeatureCodes: ['BALCONY', 'ELEVATOR', 'PARKING', 'AC'],
    },
    VILLA: {
      fields: RESIDENTIAL_CORE,
      floorLabel: 'عدد الأدوار',
      recommendedFeatureCodes: ['GARDEN', 'POOL', 'PARKING', 'SECURITY'],
    },
    CHALET: {
      fields: RESIDENTIAL_CORE,
      floorLabel: 'الدور',
      recommendedFeatureCodes: ['POOL', 'GARDEN', 'PARKING'],
    },
    TWIN_HOUSE: {
      fields: RESIDENTIAL_CORE,
      floorLabel: 'عدد الأدوار',
      recommendedFeatureCodes: ['GARDEN', 'PARKING', 'SECURITY'],
    },
    TOWN_HOUSE: {
      fields: RESIDENTIAL_CORE,
      floorLabel: 'عدد الأدوار',
      recommendedFeatureCodes: ['GARDEN', 'PARKING'],
    },
    DUPLEX: {
      fields: RESIDENTIAL_CORE,
      floorLabel: 'الدور',
      recommendedFeatureCodes: ['ELEVATOR', 'BALCONY', 'PARKING'],
    },
    PENTHOUSE: {
      fields: RESIDENTIAL_CORE,
      floorLabel: 'الدور',
      recommendedFeatureCodes: ['ELEVATOR', 'BALCONY', 'POOL', 'AC'],
    },
    OFFICE: {
      fields: COMMERCIAL_CORE,
      floorLabel: 'الدور',
      recommendedFeatureCodes: [...COMMERCIAL_FEATURES],
    },
    SHOP: {
      fields: COMMERCIAL_CORE,
      floorLabel: 'الدور',
      recommendedFeatureCodes: [...COMMERCIAL_FEATURES],
    },
    CLINIC: {
      fields: COMMERCIAL_CORE,
      floorLabel: 'الدور',
      recommendedFeatureCodes: [...COMMERCIAL_FEATURES],
    },
    LAND: {
      fields: ['areaSqm', 'legalStatus'],
      recommendedFeatureCodes: [],
    },
  };

export function normalizePropertyTypeCode(
  propertyTypeCode: string | null | undefined,
): string | null {
  if (!propertyTypeCode?.trim()) return null;
  return propertyTypeCode.trim().toUpperCase();
}

export function getPropertyTypeFieldConfig(
  propertyTypeCode: string | null | undefined,
): PropertyTypeFieldConfig {
  const code = normalizePropertyTypeCode(propertyTypeCode);
  if (!code) {
    return DEFAULT_PROPERTY_TYPE_FIELDS;
  }
  return PROPERTY_TYPE_FIELD_RULES[code] ?? DEFAULT_PROPERTY_TYPE_FIELDS;
}

export function isDetailFieldVisible(
  field: PropertyDetailField,
  propertyTypeCode: string | null | undefined,
): boolean {
  return getPropertyTypeFieldConfig(propertyTypeCode).fields.includes(field);
}

/** Detail scalars that must be cleared when hidden for the selected type. */
export const CLEARABLE_DETAIL_FIELDS: readonly PropertyDetailField[] = [
  'bedrooms',
  'bathrooms',
  'floor',
  'yearBuilt',
  'finishingType',
  'furnished',
  'propertyViews',
  'legalStatus',
];
