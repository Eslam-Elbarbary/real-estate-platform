'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/lib/formatting/currency';
import { cn } from '@/lib/utils/cn';
import type {
  ListingPlanDto,
  ListingSubscriptionDto,
  PropertyCompletionDto,
} from '@/types/api/listing-submission';
import {
  resubmitRejectedListingAction,
  selectListingPlanAction,
  validateListingBeforeSubmitAction,
} from '../../actions';
import { completionFieldLabels, listingCopy } from '../../config';
import type { ListingDraft } from '../../types';

interface ListingSubmissionClientProps {
  draft: ListingDraft;
  completion: PropertyCompletionDto;
  plans: ListingPlanDto[];
  subscription: ListingSubscriptionDto | null;
}

function missingLabel(field: string): string {
  return completionFieldLabels[field] ?? field;
}

function planFeaturesText(features: unknown): string[] {
  if (!features || typeof features !== 'object' || Array.isArray(features)) {
    return [];
  }
  return Object.entries(features as Record<string, unknown>).map(([key, value]) => {
    if (typeof value === 'boolean') {
      return value ? key : `${key}: لا`;
    }
    return `${key}: ${String(value)}`;
  });
}

export function ListingSubmissionClient({
  draft,
  completion,
  plans,
  subscription,
}: ListingSubmissionClientProps) {
  const status = draft.apiStatus;

  if (status === 'PENDING_REVIEW') {
    return (
      <StatusPanel
        title={listingCopy.submittedTitle}
        body={listingCopy.submittedBody}
        tone="info"
      />
    );
  }

  if (status === 'PUBLISHED') {
    return (
      <StatusPanel
        title={listingCopy.publishedTitle}
        body={listingCopy.publishedBody}
        tone="success"
      />
    );
  }

  if (status === 'PENDING_PAYMENT') {
    return (
      <div className="space-y-4">
        <StatusPanel
          title={listingCopy.pendingPaymentTitle}
          body={listingCopy.pendingPaymentBody}
          tone="warning"
        />
        <Link
          href={routes.addProperty.step(draft.id, 'checkout')}
          className={getButtonClassName({
            className:
              'inline-flex h-12 min-w-[140px] items-center justify-center rounded-lg px-8 text-base font-extrabold',
          })}
        >
          {listingCopy.paySubscription}
        </Link>
      </div>
    );
  }

  if (status === 'ARCHIVED' || status === 'EXPIRED') {
    return (
      <StatusPanel
        title={status === 'EXPIRED' ? 'انتهى الإعلان' : 'الإعلان مؤرشف'}
        body="لا يمكن تعديل هذا الإعلان من هنا حاليًا."
        tone="muted"
      />
    );
  }

  return (
    <EditableSubmission
      draft={draft}
      completion={completion}
      plans={plans}
      subscription={subscription}
    />
  );
}

function EditableSubmission({
  draft,
  completion,
  plans,
  subscription,
}: ListingSubmissionClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const isRejected = draft.apiStatus === 'REJECTED';

  const hasActiveSubscription =
    subscription?.status === 'ACTIVE' &&
    Boolean(subscription.endsAt) &&
    new Date(subscription.endsAt!).getTime() > Date.now();

  async function ensureValidOrRedirect(): Promise<boolean> {
    const validation = await validateListingBeforeSubmitAction(draft.id);
    if (!validation.ok) {
      setError(validation.error);
      return false;
    }
    if (!validation.data.complete) {
      router.push(validation.data.href);
      router.refresh();
      return false;
    }
    return true;
  }

  function onSelectPlan(planId: string) {
    if (!completion.completed || pending) return;
    setError(null);
    setSelectedPlanId(planId);
    startTransition(async () => {
      const valid = await ensureValidOrRedirect();
      if (!valid) {
        setSelectedPlanId(null);
        return;
      }

      const result = await selectListingPlanAction(draft.id, planId);
      if (!result.ok) {
        setError(result.error);
        setSelectedPlanId(null);
        if (result.href) {
          router.push(result.href);
          router.refresh();
        }
        return;
      }
      router.push(result.data.href);
      router.refresh();
    });
  }

  function onResubmit() {
    if (!completion.completed || pending) return;
    setError(null);
    startTransition(async () => {
      const valid = await ensureValidOrRedirect();
      if (!valid) return;

      const result = await resubmitRejectedListingAction(draft.id);
      if (!result.ok) {
        setError(result.error);
        if (result.href) {
          router.push(result.href);
          router.refresh();
        }
        return;
      }
      router.push(result.data.href);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {isRejected ? (
        <div className="rounded-lg border border-danger-100 bg-danger-50 px-4 py-3">
          <p className="text-sm font-extrabold text-danger-800">
            {listingCopy.rejectedTitle}
          </p>
          <p className="mt-1 text-sm leading-6 text-danger-700">
            {listingCopy.rejectedBody}
          </p>
          <Link
            href={routes.addProperty.step(draft.id, 'preview')}
            className="mt-3 inline-flex text-sm font-bold text-brand-700 underline"
          >
            {listingCopy.editListing}
          </Link>
        </div>
      ) : null}

      <div className="rounded-lg border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-ink-800">
        <p className="font-semibold">
          راجع معاينة إعلانك قبل الإرسال للمراجعة.
        </p>
        <Link
          href={routes.addProperty.step(draft.id, 'preview')}
          className="mt-2 inline-flex text-sm font-bold text-brand-700 underline"
        >
          فتح المعاينة
        </Link>
      </div>

      <CompletionPanel completion={completion} />

      {completion.completed && isRejected && hasActiveSubscription ? (
        <div className="space-y-3">
          <p className="text-sm text-ink-600">
            لديك باقة نشطة. يمكنك إعادة إرسال الإعلان للمراجعة مباشرة.
          </p>
          <button
            type="button"
            disabled={pending}
            onClick={onResubmit}
            className={getButtonClassName({
              className: 'h-12 min-w-[160px] rounded-lg px-8 text-base font-extrabold',
            })}
          >
            {listingCopy.previewSubmit}
          </button>
        </div>
      ) : null}

      {completion.completed && !(isRejected && hasActiveSubscription) ? (
        <PlansPanel
          plans={plans}
          selectedPlanId={selectedPlanId}
          pending={pending}
          onSelect={onSelectPlan}
        />
      ) : null}

      {error ? (
        <p className="text-sm font-semibold text-danger-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function CompletionPanel({ completion }: { completion: PropertyCompletionDto }) {
  return (
    <section className="rounded-lg border border-[#e5e5e5] bg-surface-50 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-extrabold text-ink-900">
          {listingCopy.completionTitle}
        </h2>
        <span className="text-sm font-bold text-brand-700">
          {completion.progress}%
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            completion.completed ? 'bg-success-600' : 'bg-brand-600',
          )}
          style={{ width: `${Math.max(0, Math.min(100, completion.progress))}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-700">
        {completion.completed
          ? listingCopy.completionReady
          : listingCopy.completionIncomplete}
      </p>
      {!completion.completed && completion.missingFields.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pe-5 text-sm font-semibold text-danger-700">
          {completion.missingFields.map((field) => (
            <li key={field}>{missingLabel(field)}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function PlansPanel({
  plans,
  selectedPlanId,
  pending,
  onSelect,
}: {
  plans: ListingPlanDto[];
  selectedPlanId: string | null;
  pending: boolean;
  onSelect: (planId: string) => void;
}) {
  if (plans.length === 0) {
    return (
      <p className="text-sm font-semibold text-ink-600">
        لا توجد باقات متاحة حاليًا.
      </p>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-extrabold text-ink-900">
        {listingCopy.plansTitle}
      </h2>
      <p className="text-sm text-ink-600">
        اختر الباقة لإرسال الإعلان للمراجعة ({listingCopy.previewSubmit}).
      </p>
      <ul className="grid gap-3">
        {plans.map((plan) => {
          const features = planFeaturesText(plan.features);
          const selected = selectedPlanId === plan.id;
          return (
            <li key={plan.id}>
              <button
                type="button"
                disabled={pending}
                onClick={() => onSelect(plan.id)}
                className={cn(
                  'w-full rounded-lg border px-4 py-4 text-start transition-colors',
                  selected
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-[#e5e5e5] bg-white hover:bg-surface-50',
                  pending && 'opacity-60',
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-base font-extrabold text-ink-900">
                      {plan.name}
                    </p>
                    <p className="mt-1 text-sm text-ink-600">
                      {listingCopy.planDuration(plan.durationDays)}
                    </p>
                  </div>
                  <p className="text-base font-extrabold text-brand-700">
                    {plan.price === 0
                      ? listingCopy.planFree
                      : formatCurrency(plan.price, 'EGP')}
                  </p>
                </div>
                {features.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-xs font-semibold text-ink-600">
                    {features.slice(0, 4).map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-3 text-sm font-bold text-brand-700">
                  {listingCopy.previewSubmit}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StatusPanel({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: 'info' | 'success' | 'warning' | 'muted';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-success-100 bg-success-50 text-success-800'
      : tone === 'warning'
        ? 'border-accent-100 bg-[#fff8e8] text-ink-800'
        : tone === 'info'
          ? 'border-brand-100 bg-brand-50 text-brand-900'
          : 'border-[#e5e5e5] bg-surface-50 text-ink-700';

  return (
    <div className={cn('rounded-lg border px-4 py-4', toneClass)}>
      <p className="text-sm font-extrabold">{title}</p>
      <p className="mt-1 text-sm leading-6 opacity-90">{body}</p>
    </div>
  );
}
