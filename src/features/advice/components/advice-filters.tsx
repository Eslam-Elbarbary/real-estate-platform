'use client';

import { useRouter } from 'next/navigation';
import { adviceCategories, adviceCopy } from '../config';
import { buildAdviceAskPath } from '../search-params';
import type { AdviceQuestionFilters } from '../types';

export interface AdviceLocationOption {
  id: string;
  name: string;
}

interface AdviceFiltersProps {
  locations: AdviceLocationOption[];
  filters: AdviceQuestionFilters;
}

const selectClass =
  'h-10 w-full rounded-md border border-[#d8d8d8] bg-white px-3 text-sm text-ink-800 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200';

export function AdviceFilters({ locations, filters }: AdviceFiltersProps) {
  const router = useRouter();

  function update(next: Partial<AdviceQuestionFilters>) {
    router.push(buildAdviceAskPath({ ...filters, page: 1, ...next }));
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
      <label className="block" htmlFor="advice-filter-location">
        <span className="sr-only">{adviceCopy.locationPlaceholder}</span>
        <select
          id="advice-filter-location"
          className={selectClass}
          value={filters.locationId ?? ''}
          onChange={(event) =>
            update({ locationId: event.target.value || undefined })
          }
        >
          <option value="">{adviceCopy.locationPlaceholder}</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block" htmlFor="advice-filter-category">
        <span className="sr-only">{adviceCopy.categoryPlaceholder}</span>
        <select
          id="advice-filter-category"
          className={selectClass}
          value={filters.categoryId ?? ''}
          onChange={(event) =>
            update({ categoryId: event.target.value || undefined })
          }
        >
          <option value="">{adviceCopy.categoryPlaceholder}</option>
          {adviceCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nameAr}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
