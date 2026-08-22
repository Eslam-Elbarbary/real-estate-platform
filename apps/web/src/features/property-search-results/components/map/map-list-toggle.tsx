'use client';

import Link from 'next/link';
import { LayoutGrid, MapPinned } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { buildPropertySearchPath } from '@/features/property-search/search-params';
import type { PropertySearchFilters } from '@/types';
import { cn } from '@/lib/utils/cn';

interface MapListToggleProps {
  filters: PropertySearchFilters;
  mode: 'list' | 'map';
  className?: string;
}

export function MapListToggle({ filters, mode, className }: MapListToggleProps) {
  const mapHref = buildPropertySearchPath({ ...filters, view: 'map', page: 1 });
  const listHref = buildPropertySearchPath({ ...filters, view: 'list', page: 1 });

  if (mode === 'map') {
    return (
      <Link
        href={listHref}
        data-testid="back-to-list"
        className={cn(
          'inline-flex h-[42px] items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-sm font-semibold text-ink-800',
          'hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
          className,
        )}
      >
        <LayoutGrid className="size-4 text-brand-600" aria-hidden />
        {uiLabels.backToList}
      </Link>
    );
  }

  return (
    <Link
      href={mapHref}
      data-testid="map-search-toggle"
      className={cn(
        'relative inline-flex h-[42px] items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-sm font-semibold text-ink-800',
        'hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        className,
      )}
      aria-label={uiLabels.mapSearch}
    >
      <MapPinned className="size-4 text-brand-600" aria-hidden />
      {uiLabels.mapSearch}
      <span className="absolute -top-2 start-2 rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
        {uiLabels.newBadgeShort}
      </span>
    </Link>
  );
}
