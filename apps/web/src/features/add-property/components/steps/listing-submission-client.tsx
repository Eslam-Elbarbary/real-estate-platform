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

  function onSelectPlan(planId: string) {
    if (!completion.completed || pending) return;
    setError(null);
    setSelectedPlanId(planId);
    startTransition(async () => {
      const result = await selectListingPlanAction(draft.id, planId);
      if (!result.ok) {
        setError(result.error);
        setSelectedPlanId(null);
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
      const result = await resubmitRejectedListingAction(draft.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(routes.addProperty.step(draft.id, 'publish'));
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
            href={routes.addProperty.step(draft.id, 'basic')}
            className="mt-3 inline-flex text-sm font-bold text-brand-700 underline"
          >
            {listingCopy.editListing}
          </Link>
        </div>
      ) : null}

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
            {listingCopy.resubmit}
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
      <ul className="grid gap-3">
        {plans.map((plan) => {
          const features = planFeaturesText(plan.features);
          const isFree = Number(plan.price) === 0;
          const selecting = pending && selectedPlanId === plan.id;
          return (
            <li
              key={plan.id}
              className="rounded-xl border border-[#e5e5e5] bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-extrabold text-ink-950">
                    {plan.name}
                  </p>
                  <p className="mt-1 text-xs text-ink-500">{plan.code}</p>
                  <p className="mt-2 text-sm font-bold text-ink-800">
                    {isFree
                      ? listingCopy.planFree
                      : formatCurrency(Number(plan.price))}
                  </p>
                  <p className="mt-1 text-xs text-ink-600">
                    {listingCopy.planDuration(plan.durationDays)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => onSelect(plan.id)}
                  className={getButtonClassName({
                    className: 'h-10 rounded-lg px-4 text-sm font-extrabold',
                  })}
                >
                  {selecting ? 'جاري الاختيار...' : listingCopy.selectPlan}
                </button>
              </div>
              {features.length > 0 ? (
                <ul className="mt-3 space-y-1 text-xs text-ink-600">
                  {features.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              ) : null}
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
        ? 'border-warning-100 bg-warning-50 text-warning-900'
        : tone === 'muted'
          ? 'border-[#e5e5e5] bg-surface-50 text-ink-700'
          : 'border-brand-100 bg-brand-50 text-brand-900';

  return (
    <div className="space-y-4">
      <div className={cn('rounded-lg border px-4 py-4', toneClass)}>
        <p className="text-base font-extrabold">{title}</p>
        <p className="mt-2 text-sm leading-7">{body}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href={`${routes.myProperties}?status=pending`}
          className={getButtonClassName({
            className:
              'inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-extrabold',
          })}
        >
          {listingCopy.viewMyProperties}
        </Link>
        <Link
          href={routes.myProperties}
          className={getButtonClassName({
            variant: 'outline',
            className:
              'inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-extrabold',
          })}
        >
          {listingCopy.viewPropertyStatus}
        </Link>
      </div>
    </div>
  );
}
