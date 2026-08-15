'use client';

import type { RefObject } from 'react';
import { SearchX } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { getButtonClassName } from '@/components/ui/button';
import { SortControl } from '../sort-control';
import { MapListToggle } from './map-list-toggle';
import { MapPropertyCard } from './map-property-card';
import type { Property, PropertySearchFilters } from '@/types';

interface MapResultsPanelProps {
  heading: string;
  countLabel: string;
  filters: PropertySearchFilters;
  properties: Property[];
  activePropertyId: string | null;
  onHover: (id: string | null) => void;
  onFocusProperty: (id: string) => void;
  onUserScroll?: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export function MapResultsPanel({
  heading,
  countLabel,
  filters,
  properties,
  activePropertyId,
  onHover,
  onFocusProperty,
  onUserScroll,
  scrollRef,
}: MapResultsPanelProps) {
  return (
    <section className="flex h-full min-h-0 flex-col border-s border-border bg-white">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-2 border-b border-border px-3 py-3">
        <div className="min-w-0">
          <MapListToggle filters={filters} mode="map" className="mb-2 h-8 px-2 text-xs" />
          <h2 className="text-sm font-extrabold text-ink-950 sm:text-base">{heading}</h2>
          <p className="text-xs text-ink-600">{countLabel}</p>
        </div>
        <SortControl filters={filters} className="h-9" />
      </div>

      <div
        ref={scrollRef}
        data-testid="map-results-panel"
        tabIndex={0}
        onScroll={onUserScroll}
        className="min-h-0 flex-1 overflow-y-auto p-3"
      >
        {properties.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <SearchX className="size-10 text-ink-400" aria-hidden />
            <p className="mt-3 text-sm font-bold text-ink-900">{uiLabels.mapEmptyTitle}</p>
            <p className="mt-1 text-xs leading-6 text-ink-600">{uiLabels.mapEmptyDescription}</p>
            <button
              type="button"
              className={getButtonClassName({ className: 'mt-4', size: 'small' })}
              onClick={() =>
                document.querySelector<HTMLButtonElement>('[data-testid="filter-advanced"]')?.click()
              }
            >
              {uiLabels.mapEmptyCta}
            </button>
          </div>
        ) : (
          <ul className="grid gap-3 min-[1500px]:grid-cols-2">
            {properties.map((property) => (
              <li key={property.id}>
                <MapPropertyCard
                  property={property}
                  active={property.id === activePropertyId}
                  onHover={onHover}
                  onFocusProperty={onFocusProperty}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
