import { adviceCopy } from '../config';
import { buildAdviceAskPath } from '../search-params';
import type { AdviceQuestionFilters } from '../types';

interface AdviceEmptyStateProps {
  filters: AdviceQuestionFilters;
}

export function AdviceEmptyState({ filters }: AdviceEmptyStateProps) {
  const unanswered = filters.view === 'unanswered';
  return (
    <div className="border-y border-border py-12 text-center">
      <h3 className="text-base font-bold text-ink-900">{adviceCopy.emptyTitle}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-600">
        {unanswered ? adviceCopy.emptyUnanswered : adviceCopy.emptyDescription}
      </p>
      <a
        href={buildAdviceAskPath({
          view: filters.view,
          transaction: filters.transaction,
        })}
        className="mt-4 inline-flex text-sm font-semibold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        إعادة ضبط التصفية
      </a>
    </div>
  );
}
