import { getPropertyTypeLabel } from '@/config/property-types';
import type { ListingDraft } from '../types';
import { listingFinishingOptions, listingViewOptions } from '../config';

function stablePick(seed: string, values: string[]): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return values[hash % values.length] ?? values[0];
}

export function generateListingCopy(
  draft: ListingDraft,
  locale: 'ar' | 'en',
): { title: string; description: string; address: string } {
  const typeLabel = draft.propertyType
    ? getPropertyTypeLabel(draft.propertyType)
    : locale === 'ar'
      ? 'عقار'
      : 'Property';
  const location = draft.locationLabel ?? (locale === 'ar' ? 'موقع مميز' : 'Prime location');
  const area = draft.details.areaSqm;
  const beds = draft.details.bedrooms;
  const baths = draft.details.bathrooms;
  const finishing = listingFinishingOptions.find(
    (o) => o.value === draft.details.finishing,
  )?.label;
  const view = listingViewOptions.find((o) => o.value === draft.details.views[0])
    ?.label;
  const tx =
    draft.transaction === 'rent'
      ? locale === 'ar'
        ? 'للإيجار'
        : 'for rent'
      : locale === 'ar'
        ? 'للبيع'
        : 'for sale';

  if (locale === 'ar') {
    const title = `${typeLabel} ${tx} في ${location}${area ? ` بمساحة ${area} م²` : ''}`;
    const parts = [
      finishing ? `التشطيب: ${finishing}` : null,
      view ? `الإطلالة: ${view}` : null,
      beds != null ? `${beds} غرف` : null,
      baths != null ? `${baths} حمام` : null,
      draft.details.floor != null ? `الدور ${draft.details.floor}` : null,
    ].filter(Boolean);
    return {
      title,
      description: parts.length
        ? `${title}. ${parts.join('، ')}.`
        : `${title}. عقار مناسب للسكن أو الاستثمار.`,
      address: location,
    };
  }

  const title = `${typeLabel} ${tx} in ${location}${area ? ` — ${area} m²` : ''}`;
  const parts = [
    finishing ? `Finish: ${finishing}` : null,
    view ? `View: ${view}` : null,
    beds != null ? `${beds} bedrooms` : null,
    baths != null ? `${baths} bathrooms` : null,
    draft.details.floor != null ? `Floor ${draft.details.floor}` : null,
  ].filter(Boolean);
  return {
    title,
    description: parts.length
      ? `${title}. ${parts.join(', ')}.`
      : `${title}. Suitable for living or investment.`,
    address: stablePick(draft.id, [
      `${location}`,
      `Street near ${location}`,
    ]),
  };
}
