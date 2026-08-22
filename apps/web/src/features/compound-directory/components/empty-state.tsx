import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { uiLabels } from '@/config/labels';
import type { CompoundSearchFilters } from '@/types';
import { hrefForResetFilters } from '../lib/toggle-filter';

interface EmptyStateProps {
  filters: CompoundSearchFilters;
}

export function CompoundEmptyState({ filters }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-border bg-white px-6 py-14 text-center">
      <h2 className="text-lg font-bold text-ink-900">
        {uiLabels.compoundsEmptyTitle}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-600">
        {uiLabels.compoundsEmptyDescription}
      </p>
      <Link
        href={hrefForResetFilters(filters)}
        className={getButtonClassName({ className: 'mt-5' })}
      >
        {uiLabels.compoundsEmptyReset}
      </Link>
    </div>
  );
}
