import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import type { LocationOption } from '@/features/locations';
import type { PropertySearchFilters, PropertySearchResult } from '@/types';
import { getSearchSeoContent } from '../data/search-seo-content';
import {
  getResultsCountLabel,
  getResultsHeading,
} from '../lib/search-title';
import { buildSubtypeChips } from '../lib/subtype-chips';
import { AiRecommendationBanner } from './ai-recommendation-banner';
import { EmptyState } from './empty-state';
import { PropertyMapExplorer } from './map/property-map-explorer';
import { MapListToggle } from './map/map-list-toggle';
import { Pagination } from './pagination';
import { PropertyResultsGrid } from './property-results-grid';
import { PropertyTypeChips } from './property-type-chips';
import { QuickFilterBar } from './quick-filter-bar';
import { ResultsBreadcrumb } from './results-breadcrumb';
import { ResultsLocationSearch } from './results-location-search';
import { SeoContent } from './seo-content';
import { SortControl } from './sort-control';

interface PropertySearchResultsPageProps {
  filters: PropertySearchFilters;
  result: PropertySearchResult;
  locations: LocationOption[];
  selectedLocation: LocationOption | null;
  subtypeCounts: Record<string, number>;
}

export function PropertySearchResultsPage({
  filters,
  result,
  locations,
  selectedLocation,
  subtypeCounts,
}: PropertySearchResultsPageProps) {
  const heading = getResultsHeading(filters);
  const countLabel = getResultsCountLabel(
    result.marketEstimate ?? result.total,
    filters,
  );
  const chips = buildSubtypeChips(filters, subtypeCounts);
  const seo = getSearchSeoContent(filters);
  const transaction = filters.transactionType ?? 'sale';

  const breadcrumbItems = selectedLocation
    ? [
        {
          label: heading,
          href: filters.propertyType
            ? routes.properties.byType(transaction, filters.propertyType)
            : routes.properties.root(transaction),
        },
        { label: selectedLocation.name },
      ]
    : [{ label: heading }];

  const mapMode = filters.view === 'map';

  return (
    <div className="bg-white">
      <Container wide className="py-4 sm:py-5">
        <div className="space-y-2.5 rounded-xl border border-border bg-white p-3 sm:p-3.5">
          <ResultsLocationSearch
            locations={locations}
            selectedLocation={selectedLocation}
            filters={filters}
          />
          <QuickFilterBar
            filters={filters}
            locations={locations}
            selectedLocation={selectedLocation}
            resultCount={result.marketEstimate ?? result.total}
          />
        </div>

        <div className="mt-4 space-y-3">
          <ResultsBreadcrumb items={breadcrumbItems} />
          <AiRecommendationBanner />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-ink-950 sm:text-xl">
                {heading}
              </h1>
              <p className="mt-0.5 text-sm text-ink-600">{countLabel}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <MapListToggle filters={filters} mode={mapMode ? 'map' : 'list'} />
              {mapMode ? null : <SortControl filters={filters} />}
            </div>
          </div>

          <PropertyTypeChips chips={chips} />
        </div>

        {mapMode ? (
          <PropertyMapExplorer
            key={result.items.map((item) => item.id).join(',')}
            properties={result.items}
            filters={filters}
            selectedLocation={selectedLocation}
          />
        ) : (
          <>
            <div className="mt-5">
              {result.items.length === 0 ? (
                <EmptyState transactionType={transaction} />
              ) : (
                <PropertyResultsGrid properties={result.items} />
              )}
            </div>
            <Pagination
              className="mt-7"
              filters={filters}
              page={result.page}
              totalPages={result.totalPages}
            />
          </>
        )}
      </Container>

      {mapMode ? null : (
        <Container wide>
          <SeoContent content={seo} />
        </Container>
      )}
    </div>
  );
}
