'use client';

import { useRouter } from 'next/navigation';
import { uiLabels } from '@/config/labels';
import type { CompoundSearchFilters, CompoundSortOption } from '@/types';
import { compoundSortOptions } from '../lib/filter-options';
import { hrefForSort } from '../lib/toggle-filter';

interface SortControlProps {
  filters: CompoundSearchFilters;
}

export function CompoundSortControl({ filters }: SortControlProps) {
  const router = useRouter();
  const value = filters.sort ?? 'recommended';

  return (
    <label className="inline-flex items-center gap-1.5 text-[12px] text-ink-600">
      <span className="whitespace-nowrap">{uiLabels.sortBy}</span>
      <select
        value={value}
        onChange={(event) => {
          router.push(
            hrefForSort(filters, event.target.value as CompoundSortOption),
          );
        }}
        className="h-8 rounded-md border border-border bg-white px-2 text-[12px] font-medium text-ink-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        {compoundSortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
