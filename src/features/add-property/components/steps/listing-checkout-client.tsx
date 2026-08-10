'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import type { SavedPaymentMethod } from '@/features/account/types';
import { DemoPaymentMethodModal } from '@/features/subscriptions/components/demo-payment-method-modal';
import { cn } from '@/lib/utils/cn';
import { publishListingDemoAction } from '../../actions';
import { listingCopy } from '../../config';
import type { ListingPublicationFee } from '../../types';

const DEMO_CARD: SavedPaymentMethod = {
  id: 'demo-visa-4242',
  nickname: 'بطاقة تجريبية',
  brandLabel: 'Visa',
  lastFour: '4242',
};

interface ListingCheckoutClientProps {
  draftId: string;
  fee: ListingPublicationFee;
}

function formatEgp(amount: number): string {
  return `${amount.toLocaleString('en-US')} ج.م`;
}

export function ListingCheckoutClient({
  draftId,
  fee,
}: ListingCheckoutClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<SavedPaymentMethod | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const canPay = Boolean(selectedMethod) && !pending;

  function onPay() {
    if (!canPay) return;
    setError(null);
    startTransition(async () => {
      const result = await publishListingDemoAction(draftId);
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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <section aria-labelledby="listing-payment-title">
            <h1
              id="listing-payment-title"
              className="text-xl font-extrabold text-ink-950 sm:text-2xl"
            >
              {listingCopy.checkoutPaymentTitle}
            </h1>
            <div className="mt-4 rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
              <div role="radiogroup" aria-label="وسيلة الدفع" className="space-y-3">
                <button
                  type="button"
                  role="radio"
                  aria-checked={!selectedMethod}
                  data-testid="add-payment-method"
                  onClick={() => {
                    setSelectedMethod(null);
                    setCardModalOpen(true);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    !selectedMethod
                      ? 'border-brand-500 bg-brand-50/40'
                      : 'border-[#e5e5e5] bg-white hover:bg-surface-50',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                        !selectedMethod ? 'border-brand-600' : 'border-ink-300',
                      )}
                      aria-hidden
                    >
                      {!selectedMethod ? (
                        <span className="size-2.5 rounded-full bg-brand-600" />
                      ) : null}
                    </span>
                    <span className="text-sm font-semibold text-ink-900">
                      {listingCopy.addCard}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-black text-ink-500">
                    VISA · MC
                  </span>
                </button>

                {selectedMethod ? (
                  <button
                    type="button"
                    role="radio"
                    aria-checked
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-brand-500 bg-brand-50/50 px-4 py-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-brand-600"
                        aria-hidden
                      >
                        <span className="size-2.5 rounded-full bg-brand-600" />
                      </span>
                      <span className="text-sm font-semibold text-ink-900">
                        {selectedMethod.brandLabel} •••• {selectedMethod.lastFour}
                      </span>
                    </span>
                  </button>
                ) : null}
              </div>
            </div>
          </section>

          <section aria-labelledby="listing-summary-title">
            <h2
              id="listing-summary-title"
              className="text-xl font-extrabold text-ink-950 sm:text-2xl"
            >
              {listingCopy.checkoutSummaryTitle}
            </h2>
            <div className="mt-4 rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-ink-600">{listingCopy.listingFeeLabel}</span>
                <span className="font-semibold text-ink-900">
                  {formatEgp(fee.amountEgp)}
                </span>
              </div>
              <div className="mt-4 border-t border-[#ececec] pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-ink-800">
                    {listingCopy.totalDue}
                  </p>
                  <p className="text-lg font-extrabold text-ink-950">
                    {formatEgp(fee.amountEgp)}
                  </p>
                </div>
              </div>
            </div>

            {error ? (
              <p className="mt-3 text-sm font-semibold text-danger-700" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={onPay}
              disabled={!canPay}
              data-testid="listing-pay-button"
              className={getButtonClassName({
                className: cn(
                  'mt-4 h-12 w-full rounded-lg text-base font-extrabold',
                  !canPay &&
                    'disabled:pointer-events-none disabled:bg-[#9ec0ea] disabled:opacity-100',
                ),
              })}
            >
              {listingCopy.payAndPublish}
            </button>
          </section>
        </div>
      </div>

      <DemoPaymentMethodModal
        open={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        onSelect={() => {
          setSelectedMethod(DEMO_CARD);
          setCardModalOpen(false);
        }}
      />
    </div>
  );
}
