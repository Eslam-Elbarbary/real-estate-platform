'use client';

import { valuationCopy } from '../../config';
import type { ValuationStepContext } from '../../wizard/steps';
import { cn } from '@/lib/utils/cn';

export function GoalStep({ draft, setDraft }: ValuationStepContext) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-ink-950">{valuationCopy.goalTitle}</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {(
          [
            {
              value: 'owned-property' as const,
              title: valuationCopy.ownedGoal,
              hint: valuationCopy.ownedSaveHint,
            },
            {
              value: 'price-inquiry' as const,
              title: valuationCopy.inquiryGoal,
              hint: valuationCopy.inquirySaveHint,
            },
          ] as const
        ).map((option) => {
          const selected = draft.goal === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setDraft({ goal: option.value })}
              className={cn(
                'rounded-xl border px-4 py-5 text-start transition-colors',
                selected
                  ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600/20'
                  : 'border-border bg-white hover:border-brand-200',
              )}
            >
              <span className="block text-base font-bold text-ink-950">
                {option.title}
              </span>
              <span className="mt-2 block text-xs leading-5 text-ink-600">
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
