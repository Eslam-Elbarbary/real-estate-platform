'use client';

import { useRouter } from 'next/navigation';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { buildPropertySearchPath } from '@/features/property-search/search-params';
import type { PropertySearchFilters, PropertySortOption } from '@/types';
import { cn } from '@/lib/utils/cn';

const sortOptions: Array<{ value: PropertySortOption; label: string }> = [
  { value: 'recommended', label: uiLabels.sortRecommended },
  { value: 'newest', label: uiLabels.sortNewest },
  { value: 'price_asc', label: uiLabels.sortPriceAsc },
  { value: 'price_desc', label: uiLabels.sortPriceDesc },
];

interface SortControlProps {
  filters: PropertySearchFilters;
  className?: string;
}

export function SortControl({ filters, className }: SortControlProps) {
  const router = useRouter();
  const current = filters.sort ?? 'recommended';

  return (
    <label
      className={cn(
        'inline-flex h-[42px] items-center gap-1.5 rounded-lg border border-border bg-white pe-2 ps-3 text-sm text-ink-800',
        className,
      )}
    >
      <ArrowUpDown className="size-4 shrink-0 text-ink-500" aria-hidden />
      <span className="hidden whitespace-nowrap text-ink-600 sm:inline">
        {uiLabels.sortBy}
      </span>
      <select
        aria-label={uiLabels.sortBy}
        value={current}
        onChange={(event) => {
          const sort = event.target.value as PropertySortOption;
          router.push(
            buildPropertySearchPath({
              ...filters,
              sort,
              page: 1,
            }),
          );
        }}
        className="max-w-[10rem] cursor-pointer appearance-none bg-transparent pe-5 text-sm font-semibold text-ink-900 outline-none sm:max-w-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none -ms-5 size-4 text-ink-400" aria-hidden />
    </label>
  );
}
