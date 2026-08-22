'use client';

import { useRouter } from 'next/navigation';
import { uiLabels } from '@/config/labels';
import type { LocationOption } from '@/features/locations';
import { LocationField } from '@/features/property-search';
import { buildPropertySearchPath } from '@/features/property-search/search-params';
import type { PropertySearchFilters } from '@/types';

interface ResultsLocationSearchProps {
  locations: LocationOption[];
  selectedLocation: LocationOption | null;
  filters: PropertySearchFilters;
}

export function ResultsLocationSearch({
  locations,
  selectedLocation,
  filters,
}: ResultsLocationSearchProps) {
  const router = useRouter();

  return (
    <LocationField
      locations={locations}
      value={selectedLocation}
      variant="results"
      placeholder={uiLabels.resultsLocationPlaceholder}
      onChange={(location) => {
        router.push(
          buildPropertySearchPath({
            ...filters,
            locationSlugs: location?.pathSlugs,
            page: 1,
          }),
        );
      }}
    />
  );
}
