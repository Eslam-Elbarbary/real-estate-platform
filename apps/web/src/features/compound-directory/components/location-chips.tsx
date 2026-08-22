'use client';

import { useState } from 'react';
import Link from 'next/link';
import { uiLabels } from '@/config/labels';
import type { CompoundSearchAggregations, CompoundSearchFilters } from '@/types';
import { cn } from '@/lib/utils/cn';
import { popularLocationChips } from '../lib/filter-options';
import { buildCompoundSearchPath } from '../search-params';

interface LocationChipsProps {
  filters: CompoundSearchFilters;
  aggregations: CompoundSearchAggregations;
}

function chipCount(
  aggregations: CompoundSearchAggregations,
  slugs: readonly string[],
): number {
  const key = slugs[slugs.length - 1];
  return aggregations.locations[key] ?? 0;
}

function isSelected(
  filters: CompoundSearchFilters,
  slugs: readonly string[],
): boolean {
  const current = filters.locationSlugs ?? [];
  if (current.length !== slugs.length) {
    return false;
  }

  return slugs.every((slug, index) => current[index] === slug);
}

export function LocationChips({ filters, aggregations }: LocationChipsProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded
    ? popularLocationChips
    : popularLocationChips.slice(0, 5);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((chip) => {
        const selected = isSelected(filters, chip.slugs);
        const count = chipCount(aggregations, chip.slugs);
        return (
          <Link
            key={chip.label}
            href={buildCompoundSearchPath({
              ...filters,
              locationSlugs: [...chip.slugs],
              page: 1,
            })}
            className={cn(
              'inline-flex h-8 items-center rounded-full border px-3 text-[12px] font-medium transition-colors',
              selected
                ? 'border-brand-200 bg-[#eef6fc] text-brand-700'
                : 'border-border bg-white text-ink-700 hover:bg-surface-50',
            )}
          >
            {chip.label}
            {count > 0 ? (
              <span className="ms-1 text-ink-400">({count})</span>
            ) : null}
          </Link>
        );
      })}
      {popularLocationChips.length > 5 ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="h-8 px-2 text-[12px] font-semibold text-brand-700 hover:text-brand-600"
        >
          {expanded ? uiLabels.showLess : uiLabels.showMore}
        </button>
      ) : null}
    </div>
  );
}
