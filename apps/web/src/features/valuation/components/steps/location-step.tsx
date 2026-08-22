'use client';

import { valuationCopy } from '../../config';
import { LocationAutocomplete } from '../location-autocomplete';
import type { ValuationStepContext } from '../../wizard/steps';

export function LocationStep({
  draft,
  setDraft,
  locations,
}: ValuationStepContext) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-ink-950">
        {valuationCopy.locationTitle}
      </h2>
      <label className="mt-6 mb-1.5 block text-sm font-semibold text-ink-800">
        {valuationCopy.locationLabel}
      </label>
      <LocationAutocomplete
        locations={locations}
        valueSlug={draft.location?.slug}
        onSelect={(location) =>
          setDraft({
            location: {
              slug: location.slug,
              name: location.name,
              citySlug: location.level === 'city' ? location.slug : location.pathSlugs.at(-1),
              governorateSlug: location.pathSlugs[0],
            },
          })
        }
      />
    </div>
  );
}
