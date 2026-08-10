import type { ReactNode } from 'react';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils/cn';
import { listingCopy } from '../config';
import type { ListingDraft, ListingDraftStep } from '../types';
import { earliestIncompleteStep } from '../lib/step-access';
import { LISTING_STEPS } from '../config';
import { ListingStepper } from './listing-stepper';

const STEP_ORDER = LISTING_STEPS.map((s) => s.id);

function completedThroughFor(draft: ListingDraft): ListingDraftStep | null {
  const earliest = earliestIncompleteStep(draft);
  const index = STEP_ORDER.indexOf(earliest);
  if (index <= 0) return null;
  return STEP_ORDER[index - 1] ?? null;
}

export interface ListingWizardShellProps {
  title: string;
  draft: ListingDraft;
  currentStep: ListingDraftStep;
  children: ReactNode;
  tips?: ReactNode;
  className?: string;
}

export function ListingWizardShell({
  title,
  draft,
  currentStep,
  children,
  tips,
  className,
}: ListingWizardShellProps) {
  const completedThrough = completedThroughFor(draft);

  return (
    <div className={cn('bg-[#f4f6f8] py-6 sm:py-8 lg:py-10', className)}>
      <Container dashboard>
        <div className="mb-4 lg:hidden">
          <ListingStepper
            currentStep={currentStep}
            completedThrough={completedThrough}
            draftId={draft.id}
            orientation="horizontal"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-ink-950 sm:text-2xl">
              {title}
            </h1>
            <div className="mt-5 rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-6">
              {children}
            </div>
            {tips ? (
              <aside className="mt-5 rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
                <h2 className="text-sm font-extrabold text-ink-900">
                  {listingCopy.tipsTitle}
                </h2>
                <div className="mt-2 text-sm leading-7 text-ink-600">{tips}</div>
              </aside>
            ) : null}
          </div>

          <aside className="hidden lg:block">
            <ListingStepper
              currentStep={currentStep}
              completedThrough={completedThrough}
              draftId={draft.id}
              orientation="vertical"
              className="sticky top-24"
            />
          </aside>
        </div>
      </Container>
    </div>
  );
}
