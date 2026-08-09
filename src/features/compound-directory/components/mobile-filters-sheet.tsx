'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import type { CompoundSearchAggregations, CompoundSearchFilters } from '@/types';
import { CompoundFiltersSidebar } from './compound-filters-sidebar';

interface MobileFiltersSheetProps {
  filters: CompoundSearchFilters;
  aggregations: CompoundSearchAggregations;
}

export function MobileFiltersSheet({
  filters,
  aggregations,
}: MobileFiltersSheetProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-white text-sm font-semibold text-ink-800 lg:hidden"
      >
        {uiLabels.compoundsOpenFilters}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={uiLabels.closeMenu}
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 end-0 flex w-[min(100%,360px)] flex-col bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-bold text-ink-900">
                {uiLabels.compoundsFilterResults}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={uiLabels.closeMenu}
                className="inline-flex size-9 items-center justify-center rounded-md hover:bg-surface-50"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <CompoundFiltersSidebar
                filters={filters}
                aggregations={aggregations}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
