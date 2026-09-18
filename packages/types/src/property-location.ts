/**
 * Shared property location input / summary shapes.
 * Property persists areaId (+ optional district/compound/address/coords).
 * countryId/cityId are UI + validation only (derived from Area hierarchy).
 */

export type PropertyLocationNamedRef = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  slug?: string | null;
  code?: string | null;
};

/** Canonical form for Admin + Web location steps. */
export type PropertyLocationInput = {
  countryId: string;
  cityId: string;
  areaId: string;
  districtId?: string | null;
  compoundId?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

/** Nested location for API responses / SEO path building. */
export type PropertyLocationSummary = {
  country: PropertyLocationNamedRef | null;
  city: PropertyLocationNamedRef | null;
  area: PropertyLocationNamedRef | null;
  district: PropertyLocationNamedRef | null;
  compound: PropertyLocationNamedRef | null;
  summary: string;
};

export function isPropertyLocationComplete(
  location: Partial<PropertyLocationInput> | null | undefined,
): boolean {
  return Boolean(
    location?.countryId?.trim() &&
      location?.cityId?.trim() &&
      location?.areaId?.trim(),
  );
}

export function buildLocationSummaryLabel(
  parts: Array<string | null | undefined>,
): string {
  return parts.map((p) => p?.trim()).filter(Boolean).join(' · ');
}
