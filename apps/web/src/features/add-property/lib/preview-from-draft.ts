import { getPropertyTypeLabel } from '@/config/property-types';
import type { LocationOption } from '@/features/locations';
import type { PropertyGalleryImage, PropertyLocation } from '@/types';
import type {
  CatalogFeatureDto,
  CatalogTypeDto,
} from '@/types/api/public-property';
import { listingFinishingOptions } from '../config';
import { isDetailFieldVisible } from '../lib/property-type-details';
import type { ListingDraft } from '../types';

export type PreviewSummaryRow = {
  key: string;
  label: string;
  value: string;
};

export function buildPreviewTitle(draft: ListingDraft): string {
  const fromDescription = draft.description.ar.title.trim();
  if (fromDescription) return fromDescription;

  const typeLabel = draft.propertyType
    ? getPropertyTypeLabel(draft.propertyType)
    : 'عقار';
  const transactionLabel =
    draft.transaction === 'rent'
      ? 'للإيجار'
      : draft.transaction === 'sale'
        ? 'للبيع'
        : '';
  const location =
    draft.locationLabel?.trim() ||
    draft.description.ar.address.trim() ||
    '';

  const parts = [typeLabel, transactionLabel, location ? `في ${location}` : '']
    .filter(Boolean)
    .join(' ');
  return parts || 'معاينة الإعلان';
}

export function buildPreviewGalleryImages(
  draft: ListingDraft,
): PropertyGalleryImage[] {
  return [...draft.media.images]
    .sort((a, b) => a.order - b.order)
    .map((image) => ({
      id: image.id,
      url: image.url,
      alt: draft.description.ar.title || image.name,
      isCover: image.isCover,
      order: image.order,
    }));
}

export interface PreviewCatalogs {
  propertyViews?: CatalogTypeDto[];
  legalStatuses?: CatalogTypeDto[];
}

function catalogLabel(
  items: CatalogTypeDto[] | undefined,
  id: string | undefined,
): string | null {
  if (!id) return null;
  const match = items?.find((item) => item.id === id);
  if (!match) return null;
  return match.nameAr?.trim() || match.nameEn;
}

function catalogLabels(
  items: CatalogTypeDto[] | undefined,
  ids: string[] | undefined,
): string[] {
  if (!ids?.length) return [];
  return ids
    .map((id) => catalogLabel(items, id))
    .filter((label): label is string => Boolean(label));
}

export function buildPreviewSummaryRows(
  draft: ListingDraft,
  catalogs: PreviewCatalogs = {},
): PreviewSummaryRow[] {
  const type = draft.propertyType;
  const details = draft.details;
  const rows: PreviewSummaryRow[] = [];

  if (isDetailFieldVisible('areaSqm', type) && details.areaSqm != null) {
    rows.push({
      key: 'areaSqm',
      label: 'المساحة',
      value: `${details.areaSqm} م²`,
    });
  }
  if (isDetailFieldVisible('bedrooms', type) && details.bedrooms != null) {
    rows.push({
      key: 'bedrooms',
      label: 'غرف النوم',
      value: String(details.bedrooms),
    });
  }
  if (isDetailFieldVisible('bathrooms', type) && details.bathrooms != null) {
    rows.push({
      key: 'bathrooms',
      label: 'الحمامات',
      value: String(details.bathrooms),
    });
  }
  if (
    isDetailFieldVisible('floor', type) &&
    details.floor != null &&
    details.floor !== ''
  ) {
    rows.push({
      key: 'floor',
      label: 'الدور',
      value: String(details.floor),
    });
  }
  if (
    isDetailFieldVisible('finishingType', type) &&
    details.finishing
  ) {
    const finishingLabel =
      listingFinishingOptions.find((o) => o.value === details.finishing)
        ?.label ?? details.finishing;
    rows.push({
      key: 'finishing',
      label: 'التشطيب',
      value: finishingLabel,
    });
  }
  if (isDetailFieldVisible('furnished', type) && details.furnished != null) {
    rows.push({
      key: 'furnished',
      label: 'مفروش',
      value: details.furnished ? 'نعم' : 'لا',
    });
  }
  if (
    isDetailFieldVisible('yearBuilt', type) &&
    details.buildOrDeliveryYear != null
  ) {
    rows.push({
      key: 'yearBuilt',
      label: 'سنة البناء',
      value: String(details.buildOrDeliveryYear),
    });
  }
  if (isDetailFieldVisible('propertyViews', type)) {
    const labels = catalogLabels(
      catalogs.propertyViews,
      details.propertyViewIds,
    );
    if (labels.length > 0) {
      rows.push({
        key: 'propertyViews',
        label: 'الإطلالات',
        value: labels.join('، '),
      });
    }
  }
  if (isDetailFieldVisible('legalStatus', type)) {
    const label = catalogLabel(catalogs.legalStatuses, details.legalStatusId);
    if (label) {
      rows.push({
        key: 'legalStatus',
        label: 'الحالة القانونية',
        value: label,
      });
    }
  }

  return rows;
}

export function resolvePreviewFeatureLabels(
  draft: ListingDraft,
  features: CatalogFeatureDto[],
): string[] {
  const byId = new Map(features.map((feature) => [feature.id, feature]));
  return draft.details.amenities
    .map((id) => {
      const feature = byId.get(id);
      if (!feature) return null;
      return feature.nameAr?.trim() || feature.nameEn;
    })
    .filter((label): label is string => Boolean(label));
}

export function resolvePreviewLocation(
  draft: ListingDraft,
  locations: LocationOption[],
): {
  lines: { label: string; value: string }[];
  mapLocation: PropertyLocation | null;
} {
  const match =
    locations.find(
      (item) =>
        (draft.districtId &&
          (item.districtId === draft.districtId || item.id === draft.districtId)) ||
        (draft.areaId &&
          (item.areaId === draft.areaId || item.id === draft.areaId)) ||
        (draft.locationId && item.id === draft.locationId),
    ) ?? null;

  const breadcrumbParts = match?.breadcrumb
    ? match.breadcrumb.split(/\s*[›>]\s*|\s*[-–—]\s*/).map((p) => p.trim()).filter(Boolean)
    : [];

  // breadcrumb is usually Country-less; path is governorate → city → area → neighborhood
  const country = 'مصر';
  const city = breadcrumbParts[0] || '';
  const area = breadcrumbParts[1] || match?.name || draft.locationLabel || '';
  const district =
    breadcrumbParts[2] ||
    (match?.level === 'neighborhood' ? match.name : '') ||
    '';
  const address =
    draft.description.ar.address.trim() || draft.locationLabel?.trim() || '';

  const lines: { label: string; value: string }[] = [
    { label: 'الدولة', value: country },
  ];
  if (city) lines.push({ label: 'المدينة', value: city });
  if (area) lines.push({ label: 'المنطقة', value: area });
  if (district) lines.push({ label: 'الحي', value: district });
  if (address) lines.push({ label: 'العنوان', value: address });

  const lat = draft.latitude;
  const lng = draft.longitude;
  const hasCoords =
    lat != null &&
    lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0);

  const mapLocation: PropertyLocation | null = hasCoords
    ? {
        countrySlug: 'egypt',
        countryName: country,
        governorateSlug: match?.pathSlugs[0] ?? '',
        governorateName: city || area,
        citySlug: match?.pathSlugs[1] ?? match?.pathSlugs[0] ?? '',
        cityName: city || area,
        areaSlug: match?.pathSlugs[2] ?? match?.slug ?? '',
        areaName: area || draft.locationLabel || '',
        neighborhoodSlug: match?.level === 'neighborhood' ? match.slug : undefined,
        neighborhoodName: district || undefined,
        addressLine: address || undefined,
        latitude: lat!,
        longitude: lng!,
      }
    : null;

  return { lines, mapLocation };
}

export function transactionLabel(draft: ListingDraft): string {
  if (draft.transaction === 'rent') return 'للإيجار';
  if (draft.transaction === 'sale') return 'للبيع';
  return '—';
}

export function propertyTypeLabel(draft: ListingDraft): string {
  if (!draft.propertyType) return '—';
  return getPropertyTypeLabel(draft.propertyType);
}
