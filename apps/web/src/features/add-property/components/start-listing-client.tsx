'use client';

import { useEffect, useMemo, useRef, useTransition } from 'react';
import {
  createNewListingDraftAction,
  resumeListingDraftAction,
} from '@/features/add-property/actions';
import type { ListingDraftStep } from '@/features/add-property/types';
import { getButtonClassName } from '@/components/ui/button';
import { formatDate } from '@/lib/formatting/date';

export interface AddPropertyDraftOption {
  id: string;
  title: string | null;
  status: 'DRAFT';
  updatedAt: string;
  currentStep: ListingDraftStep;
}

interface StartListingClientProps {
  initialError?: string;
  drafts: AddPropertyDraftOption[];
}

const STEP_LABELS: Record<ListingDraftStep, string> = {
  basic: 'الأساسيات',
  details: 'التفاصيل',
  price: 'السعر',
  description: 'الوصف',
  contact: 'التواصل',
  media: 'الصور',
  preview: 'المعاينة',
  publish: 'الإرسال',
};

export function StartListingClient({
  initialError,
  drafts,
}: StartListingClientProps) {
  const [pending, startTransition] = useTransition();
  const autoCreateStarted = useRef(false);
  const sorted = useMemo(
    () =>
      [...drafts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [drafts],
  );

  function startNew() {
    startTransition(() => {
      void createNewListingDraftAction();
    });
  }

  function resume(id: string) {
    startTransition(() => {
      void resumeListingDraftAction(id);
    });
  }

  useEffect(() => {
    if (initialError) return;
    if (sorted.length > 0) return;
    if (autoCreateStarted.current) return;
    autoCreateStarted.current = true;
    startNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- create once when no drafts
  }, [initialError, sorted.length]);

  if (initialError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-sm font-semibold text-danger-700" role="alert">
          {initialError}
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={startNew}
          className={getButtonClassName({
            className: 'inline-flex h-11 items-center justify-center px-5 text-sm font-bold',
          })}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <p className="text-sm font-semibold text-ink-600" role="status">
          جارٍ إنشاء مسودة الإعلان...
        </p>
      </div>
    );
  }

  if (sorted.length === 1) {
    const draft = sorted[0]!;
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-4 py-10">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-extrabold text-ink-950">
            لديك إعلان غير مكتمل
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            يمكنك استكمال المسودة الحالية أو بدء إعلان جديد.
          </p>
          <div className="mt-4 rounded-xl bg-surface-50 px-4 py-3 text-sm">
            <p className="font-bold text-ink-900">
              {draft.title?.trim() || 'مسودة بدون عنوان'}
            </p>
            <p className="mt-1 text-ink-500">
              آخر تحديث: {formatDate(draft.updatedAt)} · الخطوة:{' '}
              {STEP_LABELS[draft.currentStep]}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={pending}
              onClick={() => resume(draft.id)}
              className={getButtonClassName({
                className: 'h-11 flex-1 font-bold',
              })}
            >
              استكمال المسودة
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={startNew}
              className={getButtonClassName({
                variant: 'outline',
                className: 'h-11 flex-1 font-bold',
              })}
            >
              بدء إعلان جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col px-4 py-10">
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-extrabold text-ink-950">
          لديك إعلانات غير مكتملة
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          اختر مسودة للاستكمال، أو ابدأ إعلانًا جديدًا.
        </p>
        <ul className="mt-5 space-y-3">
          {sorted.map((draft) => (
            <li
              key={draft.id}
              className="flex flex-col gap-3 rounded-xl border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-bold text-ink-900">
                  {draft.title?.trim() || 'مسودة بدون عنوان'}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  آخر تحديث: {formatDate(draft.updatedAt)} ·{' '}
                  {STEP_LABELS[draft.currentStep]}
                </p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => resume(draft.id)}
                className={getButtonClassName({
                  size: 'small',
                  className: 'font-semibold',
                })}
              >
                استكمال
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={pending}
          onClick={startNew}
          className={getButtonClassName({
            variant: 'outline',
            className: 'mt-5 h-11 w-full font-bold',
          })}
        >
          بدء إعلان جديد
        </button>
      </div>
    </div>
  );
}
