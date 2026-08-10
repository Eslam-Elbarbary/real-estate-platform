'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import { LISTING_STEPS } from '../config';
import type { ListingDraftStep } from '../types';

const STEP_ORDER = LISTING_STEPS.map((s) => s.id);

export interface ListingStepperProps {
  currentStep: ListingDraftStep;
  /** Last completed step id, or its index in LISTING_STEPS. Use -1 / null when none. */
  completedThrough: ListingDraftStep | number | null;
  draftId: string;
  /** When true, completed steps link to their page. */
  clickableCompleted?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

function resolveCompletedIndex(
  completedThrough: ListingDraftStep | number | null,
): number {
  if (completedThrough == null) return -1;
  if (typeof completedThrough === 'number') return completedThrough;
  return STEP_ORDER.indexOf(completedThrough);
}

type StepVisualState = 'completed' | 'current' | 'future';

function stepState(
  stepId: ListingDraftStep,
  currentStep: ListingDraftStep,
  completedIndex: number,
): StepVisualState {
  if (stepId === currentStep) return 'current';
  const index = STEP_ORDER.indexOf(stepId);
  if (index >= 0 && index <= completedIndex) return 'completed';
  return 'future';
}

export function ListingStepper({
  currentStep,
  completedThrough,
  draftId,
  clickableCompleted = true,
  orientation = 'vertical',
  className,
}: ListingStepperProps) {
  const completedIndex = resolveCompletedIndex(completedThrough);
  const isHorizontal = orientation === 'horizontal';

  return (
    <nav
      aria-label="خطوات إضافة الإعلان"
      className={cn(
        isHorizontal
          ? 'overflow-x-auto rounded-xl bg-[#f3f5f7] px-3 py-3'
          : 'rounded-xl bg-[#f3f5f7] p-4 sm:p-5',
        className,
      )}
    >
      <ol
        className={cn(
          isHorizontal
            ? 'flex min-w-max items-center gap-2'
            : 'relative flex flex-col gap-0',
        )}
      >
        {LISTING_STEPS.map((step, index) => {
          const state = stepState(step.id, currentStep, completedIndex);
          const isLast = index === LISTING_STEPS.length - 1;
          const href = routes.addProperty.step(draftId, step.id);
          const canClick = clickableCompleted && state === 'completed';

          const marker = (
            <span
              className={cn(
                'relative z-[1] inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2',
                state === 'completed' && 'border-brand-600 bg-brand-600 text-white',
                state === 'current' && 'border-brand-600 bg-white',
                state === 'future' && 'border-ink-300 bg-white',
              )}
              aria-hidden
            >
              {state === 'completed' ? (
                <Check size={14} strokeWidth={3} />
              ) : state === 'current' ? (
                <span className="size-2.5 rounded-full bg-brand-600" />
              ) : null}
            </span>
          );

          const label = (
            <span
              className={cn(
                'text-sm font-semibold leading-6',
                state === 'current' && 'text-brand-700',
                state === 'completed' && 'text-ink-800',
                state === 'future' && 'text-ink-400',
                isHorizontal && 'whitespace-nowrap',
              )}
            >
              {step.label}
            </span>
          );

          const content = canClick ? (
            <Link
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                isHorizontal ? 'px-1' : 'py-2.5',
              )}
            >
              {marker}
              {label}
            </Link>
          ) : (
            <div
              className={cn(
                'flex items-center gap-3',
                isHorizontal ? 'px-1' : 'py-2.5',
              )}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              {marker}
              {label}
            </div>
          );

          return (
            <li
              key={step.id}
              className={cn('relative', isHorizontal ? 'flex items-center' : '')}
            >
              {!isHorizontal && !isLast ? (
                <span
                  className="absolute start-[13px] top-8 bottom-0 w-0.5 bg-ink-200"
                  aria-hidden
                />
              ) : null}
              {content}
              {isHorizontal && !isLast ? (
                <span
                  className="mx-1 h-0.5 w-4 shrink-0 bg-ink-200"
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
