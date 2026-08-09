'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getAppIcon, ICON_SIZE_UI } from '@/config/icons';
import { uiLabels } from '@/config/labels';
import {
  getSearchModeHref,
  type SearchMode,
} from '@/config/property-types';
import type { LocationOption } from '@/features/locations';
import { buildPropertySearchPath } from '@/features/property-search/search-params';
import { cn } from '@/lib/utils/cn';
import type { PropertyType, TransactionType } from '@/types';
import { AdvancedSearchDrawer } from './advanced-search-drawer';
import { LocationField } from './location-field';
import { PriceField } from './price-field';
import { PropertyTypeField } from './property-type-field';
import { SearchTabs } from './search-tabs';

export type PropertySearchVariant = 'default' | 'compact' | 'stacked' | 'hero';

interface PropertySearchFormProps {
  locations: LocationOption[];
  variant?: PropertySearchVariant;
  className?: string;
  initialTransactionType?: TransactionType;
  resultCount?: number;
}

const SearchIcon = getAppIcon('search');
const FilterIcon = getAppIcon('filter');

export function PropertySearchForm({
  locations,
  variant = 'default',
  className,
  initialTransactionType = 'sale',
  resultCount,
}: PropertySearchFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<SearchMode>(initialTransactionType);
  const [propertyType, setPropertyType] = useState<PropertyType | undefined>();
  const [location, setLocation] = useState<LocationOption | null>(null);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const formId = useMemo(() => `property-search-${variant}`, [variant]);
  const isHero = variant === 'hero';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === 'compounds') {
      router.push(getSearchModeHref('compounds', location?.pathSlugs));
      return;
    }

    const href = buildPropertySearchPath({
      transactionType: mode,
      propertyType: isHero ? undefined : propertyType,
      locationSlugs: location?.pathSlugs,
      minPrice: isHero ? undefined : minPrice,
      maxPrice: isHero ? undefined : maxPrice,
    });

    router.push(href);
  }

  if (isHero) {
    return (
      <>
        <form
          id={formId}
          onSubmit={handleSubmit}
          className={cn(
            'w-full overflow-hidden rounded-xl bg-white/94 shadow-md backdrop-blur-sm',
            className,
          )}
          aria-label={uiLabels.searchNav}
        >
          <SearchTabs
            value={mode}
            onChange={setMode}
            idPrefix={`${formId}-transaction`}
            variant="hero"
          />

          <div className="flex flex-col gap-2.5 p-4 sm:flex-row sm:items-center sm:gap-3.5 sm:px-5 sm:py-[18px]">
            <LocationField
              locations={locations}
              value={location}
              onChange={setLocation}
              variant="hero"
            />
            <div className="flex shrink-0 gap-2.5">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3.5 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-50 lg:h-[50px]"
                aria-label={uiLabels.advancedFilters}
                aria-haspopup="dialog"
                aria-expanded={filtersOpen}
              >
                <FilterIcon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
                <span className="hidden sm:inline">{uiLabels.advancedFilters}</span>
              </button>
              <Button
                type="submit"
                size="large"
                className="h-12 min-w-28 px-6 lg:h-[50px]"
              >
                <SearchIcon className="size-4" aria-hidden />
                {uiLabels.searchSubmit}
              </Button>
            </div>
          </div>
        </form>

        {filtersOpen ? (
          <AdvancedSearchDrawer
            key={`${mode}-${location?.id ?? 'none'}`}
            onClose={() => setFiltersOpen(false)}
            locations={locations}
            initialTransactionType={mode === 'compounds' ? 'sale' : mode}
            initialLocation={location}
            resultCount={resultCount}
          />
        ) : null}
      </>
    );
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={cn(
        'rounded-xl border border-border bg-white',
        variant === 'compact' ? 'p-3 shadow-sm' : 'p-4 shadow-sm sm:p-5',
        className,
      )}
      aria-label={uiLabels.searchNav}
    >
      <div className="flex flex-col gap-3">
        <SearchTabs
          value={mode === 'compounds' ? 'sale' : mode}
          onChange={(next) => {
            setMode(next);
            setMinPrice(undefined);
            setMaxPrice(undefined);
          }}
          idPrefix={`${formId}-transaction`}
        />

        <div
          className={cn(
            'grid gap-3',
            variant === 'stacked' && 'grid-cols-1',
            variant === 'default' &&
              'grid-cols-1 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_auto]',
            variant === 'compact' &&
              'grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_auto]',
          )}
        >
          <PropertyTypeField value={propertyType} onChange={setPropertyType} />
          <LocationField
            locations={locations}
            value={location}
            onChange={setLocation}
          />
          <PriceField
            transactionType={mode === 'compounds' ? 'sale' : mode}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
          />
          <div
            className={cn(
              'flex items-end',
              variant !== 'stacked' && 'sm:col-span-2 xl:col-span-1',
            )}
          >
            <Button type="submit" size="medium" className="h-11 w-full min-w-28">
              <SearchIcon className="size-4" aria-hidden />
              {uiLabels.searchSubmit}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
