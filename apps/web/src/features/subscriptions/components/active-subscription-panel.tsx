'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PackageModalShell } from '@/features/packages/components/package-modal-shell';
import { getButtonClassName } from '@/components/ui/button';
import type { UserSubscription } from '@/features/account/types';
import { cancelDemoSubscriptionAction } from '../actions';
import { subscriptionCopy } from '../config';

interface ActiveSubscriptionPanelProps {
  subscription: UserSubscription;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

function billingLabel(period: UserSubscription['billingPeriod']): string {
  if (period === 'yearly') return subscriptionCopy.billingYearly;
  if (period === 'quarterly') return subscriptionCopy.billingQuarterly;
  return subscriptionCopy.billingMonthly;
}

export function ActiveSubscriptionPanel({
  subscription,
}: ActiveSubscriptionPanelProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isActive = subscription.status === 'active';

  function onCancel() {
    setError(null);
    startTransition(async () => {
      const result = await cancelDemoSubscriptionAction();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfirmOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <div
        className="rounded-xl border border-[#e5e5e5] bg-white p-5 sm:p-7"
        data-testid="active-subscription"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-ink-950">
              {subscription.planTitle}
            </h3>
            <p className="mt-2 text-sm text-ink-600">
              {subscriptionCopy.billingPeriod}:{' '}
              <span className="font-semibold text-ink-900">
                {billingLabel(subscription.billingPeriod)}
              </span>
            </p>
          </div>
          <span
            className={
              isActive
                ? 'rounded-full bg-success-50 px-3 py-1 text-xs font-extrabold text-success-700'
                : 'rounded-full bg-danger-50 px-3 py-1 text-xs font-extrabold text-danger-700'
            }
          >
            {isActive
              ? subscriptionCopy.activeStatus
              : subscriptionCopy.cancelledStatus}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold text-ink-500">السعر</dt>
            <dd className="mt-1 text-sm font-bold text-ink-900">
              {subscription.priceEgp.toLocaleString('en-US')} جنيه
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">
              {subscriptionCopy.startedAt}
            </dt>
            <dd className="mt-1 text-sm font-bold text-ink-900">
              {formatDate(subscription.startedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">
              {subscriptionCopy.expiresAt}
            </dt>
            <dd className="mt-1 text-sm font-bold text-ink-900">
              {formatDate(subscription.expiresAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-ink-500">
              {subscriptionCopy.autoRenew}
            </dt>
            <dd className="mt-1 text-sm font-bold text-ink-900">
              {subscription.autoRenew ? 'مفعّل' : 'متوقف'}
            </dd>
          </div>
        </dl>

        {error ? (
          <p className="mt-4 text-sm font-semibold text-danger-700" role="alert">
            {error}
          </p>
        ) : null}

        {isActive ? (
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className={getButtonClassName({
              variant: 'outline',
              className: 'mt-6 h-11 rounded-lg border-danger-200 text-danger-700',
            })}
            data-testid="cancel-subscription"
          >
            {subscriptionCopy.cancelSubscription}
          </button>
        ) : null}
      </div>

      <PackageModalShell
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={subscriptionCopy.cancelConfirmTitle}
        size="md"
        testId="cancel-subscription-modal"
      >
        <div className="space-y-4 py-3">
          <p className="text-sm leading-7 text-ink-700">
            {subscriptionCopy.cancelConfirmBody}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={onCancel}
              className={getButtonClassName({
                variant: 'danger',
                className: 'h-11 rounded-lg px-5 font-bold',
              })}
              data-testid="confirm-cancel-subscription"
            >
              {subscriptionCopy.cancelConfirmContinue}
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className={getButtonClassName({
                variant: 'outline',
                className: 'h-11 rounded-lg px-5 font-bold',
              })}
            >
              {subscriptionCopy.cancelConfirmClose}
            </button>
          </div>
        </div>
      </PackageModalShell>
    </>
  );
}
