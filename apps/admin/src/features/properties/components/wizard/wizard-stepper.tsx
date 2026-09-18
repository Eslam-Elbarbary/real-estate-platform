'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { WIZARD_STEPS, type WizardStepId } from './wizard-types';

export interface WizardStepperProps {
  currentStepId: WizardStepId;
  completionPercent: number;
  disabled?: boolean;
  onStepSelect: (stepId: WizardStepId) => void;
}

export function WizardStepper({
  currentStepId,
  completionPercent,
  disabled = false,
  onStepSelect,
}: WizardStepperProps) {
  const currentIndex = WIZARD_STEPS.findIndex((step) => step.id === currentStepId);
  const clampedPercent = Math.min(100, Math.max(0, completionPercent));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-ink-900">
          {WIZARD_STEPS[currentIndex]?.number} — {WIZARD_STEPS[currentIndex]?.title}
        </p>
        <p className="text-xs text-ink-500">
          اكتمال البيانات:{' '}
          <span className="font-semibold text-ink-800" dir="ltr">
            {clampedPercent.toLocaleString('ar-EG')}%
          </span>
        </p>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-surface-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedPercent}
        aria-label="نسبة اكتمال بيانات المعالج"
      >
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>

      <nav aria-label="خطوات المعالج" className="-mx-1 overflow-x-auto px-1 pb-1">
        <ol className="flex min-w-max items-stretch gap-2">
          {WIZARD_STEPS.map((step, index) => {
            const active = index === currentIndex;
            const completed = index < currentIndex;
            return (
              <li key={step.id} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'flex min-w-[9.5rem] max-w-[11rem] flex-col gap-1 rounded-xl border px-3 py-2.5 text-start transition-colors sm:min-w-[10.5rem]',
                    active && 'border-brand-500 bg-brand-50 text-brand-900 shadow-sm',
                    completed &&
                      !active &&
                      'border-brand-200 bg-white text-ink-800 hover:border-brand-400',
                    !active &&
                      !completed &&
                      'border-border bg-white text-ink-500 hover:border-brand-200',
                    disabled && 'cursor-not-allowed opacity-60',
                  )}
                  onClick={() => onStepSelect(step.id)}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold',
                        active && 'bg-brand-600 text-white',
                        completed && !active && 'bg-brand-100 text-brand-800',
                        !active && !completed && 'bg-surface-100 text-ink-500',
                      )}
                    >
                      {completed && !active ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : (
                        step.number
                      )}
                    </span>
                    <span className="text-[11px] font-medium leading-snug sm:text-xs">
                      {step.title}
                    </span>
                  </span>
                  <span className="ps-9 text-[10px] text-ink-400">
                    {active
                      ? 'الخطوة الحالية'
                      : completed
                        ? 'مكتملة'
                        : 'قادمة'}
                  </span>
                </button>
                {index < WIZARD_STEPS.length - 1 ? (
                  <span
                    className={cn(
                      'hidden h-px w-4 shrink-0 sm:block',
                      completed ? 'bg-brand-300' : 'bg-border',
                    )}
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
