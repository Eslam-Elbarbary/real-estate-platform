'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatting/currency';
import { payListingSubscriptionAction } from '../../actions';
import { listingCopy } from '../../config';
import type { ListingSubscriptionDto } from '@/types/api/listing-submission';

interface ListingPaymentClientProps {
  propertyId: string;
  subscription: ListingSubscriptionDto;
}

/**
 * Payment step for listing subscriptions.
 * Currently calls POST /subscriptions/:id/pay (backend mock provider).
 * Structure is intentional so a future Paymob checkout can replace the pay action
 * without changing the surrounding Add Property wizard flow.
 */
export function ListingPaymentClient({
  propertyId,
  subscription,
}: ListingPaymentClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onPay() {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await payListingSubscriptionAction(
        propertyId,
        subscription.id,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(result.data.href);
      router.refresh();
    });
  }

  return (
    <div className="bg-[#f4f6f8]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-xl font-extrabold text-ink-950 sm:text-2xl">
          {listingCopy.checkoutPaymentTitle}
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          أكمل الدفع لإرسال الإعلان إلى مراجعة الإدارة.
        </p>

        <div className="mt-6 rounded-xl border border-[#e5e5e5] bg-white p-5">
          <h2 className="text-base font-extrabold text-ink-900">
            {listingCopy.checkoutSummaryTitle}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-600">الباقة</dt>
              <dd className="font-semibold text-ink-900">
                {subscription.plan.name}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-600">المدة</dt>
              <dd className="font-semibold text-ink-900">
                {listingCopy.planDuration(subscription.duration)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#ececec] pt-3">
              <dt className="font-bold text-ink-800">{listingCopy.totalDue}</dt>
              <dd className="text-lg font-extrabold text-ink-950">
                {formatCurrency(subscription.price)}
              </dd>
            </div>
          </dl>

          {error ? (
            <p className="mt-4 text-sm font-semibold text-danger-700" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={onPay}
            disabled={pending}
            data-testid="listing-pay-button"
            className={getButtonClassName({
              className: 'mt-5 h-12 w-full rounded-lg text-base font-extrabold',
            })}
          >
            {pending ? 'جاري الدفع...' : listingCopy.payAndPublish}
          </button>
        </div>
      </div>
    </div>
  );
}
