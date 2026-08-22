'use client';

import { useId, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import type {
  SavedPaymentMethod,
  SubscriptionBillingPeriod,
  SubscriptionPlan,
} from '@/features/account/types';
import { cn } from '@/lib/utils/cn';
import {
  activateDemoSubscriptionAction,
} from '../actions';
import {
  resolvePlanPricing,
  subscriptionCopy,
} from '../config';
import { buildProCheckoutHref } from '../search-params';
import { DemoPaymentMethodModal } from './demo-payment-method-modal';

const DEMO_CARD: SavedPaymentMethod = {
  id: 'demo-visa-4242',
  nickname: 'بطاقة تجريبية',
  brandLabel: 'Visa',
  lastFour: '4242',
};

interface ProCheckoutClientProps {
  plan: SubscriptionPlan;
  billing: SubscriptionBillingPeriod;
  initialPaymentMethods: SavedPaymentMethod[];
}

function formatEgp(amount: number): string {
  return `${amount.toLocaleString('en-US')} جنيه`;
}

function autoRenewCopy(billing: SubscriptionBillingPeriod): string {
  if (billing === 'yearly') return subscriptionCopy.autoRenewYearly;
  if (billing === 'monthly') return subscriptionCopy.autoRenewMonthly;
  return subscriptionCopy.autoRenewQuarterly;
}

export function ProCheckoutClient({
  plan,
  billing,
  initialPaymentMethods,
}: ProCheckoutClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<SavedPaymentMethod | null>(
    initialPaymentMethods[0] ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const billingGroupId = useId();
  const paymentGroupId = useId();

  const pricing = resolvePlanPricing(plan, billing);
  const discountAmount =
    pricing.originalPriceEgp != null
      ? pricing.originalPriceEgp - pricing.priceEgp
      : 0;
  const canPay = Boolean(selectedMethod) && !pending && !success;

  function selectBilling(next: SubscriptionBillingPeriod) {
    if (next === billing) return;
    router.push(buildProCheckoutHref({ plan: plan.id, billing: next }));
  }

  function onPay() {
    if (!canPay) return;
    setError(null);
    startTransition(async () => {
      const result = await activateDemoSubscriptionAction({
        planId: plan.id,
        billingPeriod: billing,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      router.push(routes.account.subscription);
      router.refresh();
    });
  }

  return (
    <div className="bg-[#f4f6f8]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <section aria-labelledby="payment-details-title">
            <h1
              id="payment-details-title"
              className="text-xl font-extrabold text-ink-950 sm:text-2xl"
            >
              {subscriptionCopy.checkoutPaymentTitle}
            </h1>
            <div className="mt-4 rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
              <div
                role="radiogroup"
                aria-labelledby={paymentGroupId}
                className="space-y-3"
              >
                <p id={paymentGroupId} className="sr-only">
                  وسيلة الدفع
                </p>
                <button
                  type="button"
                  role="radio"
                  aria-checked={!selectedMethod}
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
                  data-testid="add-payment-method"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                        !selectedMethod
                          ? 'border-brand-600'
                          : 'border-ink-300',
                      )}
                      aria-hidden
                    >
                      {!selectedMethod ? (
                        <span className="size-2.5 rounded-full bg-brand-600" />
                      ) : null}
                    </span>
                    <span className="text-sm font-semibold text-ink-900">
                      {subscriptionCopy.addCard}
                    </span>
                  </span>
                  <span className="flex items-center gap-2" aria-hidden>
                    <VisaMark />
                    <MastercardMark />
                  </span>
                </button>

                {selectedMethod ? (
                  <button
                    type="button"
                    role="radio"
                    aria-checked
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-brand-500 bg-brand-50/50 px-4 py-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    data-testid="selected-payment-method"
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
                    <VisaMark />
                  </button>
                ) : null}
              </div>
              {!selectedMethod ? (
                <p className="mt-3 text-xs text-ink-500">
                  {subscriptionCopy.selectPaymentHint}
                </p>
              ) : null}
            </div>
          </section>

          <section aria-labelledby="order-summary-title">
            <div className="flex items-center justify-between gap-3">
              <h2
                id="order-summary-title"
                className="text-xl font-extrabold text-ink-950 sm:text-2xl"
              >
                {subscriptionCopy.checkoutSummaryTitle}
              </h2>
            </div>

            <div className="mt-4 rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-extrabold text-ink-950">
                  {pricing.title}
                </h3>
                <Link
                  href={routes.pro.root}
                  className="shrink-0 text-sm font-bold text-brand-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {subscriptionCopy.changePlan}
                </Link>
              </div>

              {(plan.billingOptions?.length ?? 0) > 1 ? (
                <div
                  role="radiogroup"
                  aria-label="فترة الفوترة"
                  className="mt-4 space-y-2"
                  id={billingGroupId}
                >
                  {plan.billingOptions?.includes('quarterly') ? (
                    <BillingOption
                      selected={billing === 'quarterly'}
                      onSelect={() => selectBilling('quarterly')}
                      label={subscriptionCopy.billingQuarterly}
                      priceLabel={`${formatEgp(299)} ${subscriptionCopy.perQuarter}`}
                      originalLabel={formatEgp(400)}
                      testId="billing-quarterly"
                    />
                  ) : null}
                  {plan.billingOptions?.includes('yearly') ? (
                    <BillingOption
                      selected={billing === 'yearly'}
                      onSelect={() => selectBilling('yearly')}
                      label={subscriptionCopy.billingYearly}
                      priceLabel={`${formatEgp(599)} ${subscriptionCopy.perYear}`}
                      originalLabel={formatEgp(1_200)}
                      badge={subscriptionCopy.saveBadge(50)}
                      testId="billing-yearly"
                    />
                  ) : null}
                </div>
              ) : null}

              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-600">{subscriptionCopy.packagePrice}</dt>
                  <dd className="font-semibold text-ink-900">
                    {formatEgp(pricing.originalPriceEgp ?? pricing.priceEgp)}
                  </dd>
                </div>
                {pricing.discountPercent != null && discountAmount > 0 ? (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink-600">
                      {subscriptionCopy.discountLabel(pricing.discountPercent)}
                    </dt>
                    <dd className="font-semibold text-success-700">
                      −{formatEgp(discountAmount)}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <p className="mt-4 text-xs font-medium leading-6 text-accent-600">
                * {autoRenewCopy(billing)}
              </p>

              <div className="mt-5 border-t border-[#ececec] pt-4">
                <div className="flex items-end justify-between gap-3">
                  <p className="text-sm font-bold text-ink-800">
                    {subscriptionCopy.totalDue}
                  </p>
                  <p className="text-lg font-extrabold text-ink-950">
                    {formatEgp(pricing.priceEgp)}{' '}
                    <span className="text-sm font-bold">{pricing.periodLabel}</span>
                  </p>
                </div>
              </div>
            </div>

            {error ? (
              <p className="mt-3 text-sm font-semibold text-danger-700" role="alert">
                {error}
              </p>
            ) : null}
            {success ? (
              <p
                className="mt-3 text-sm font-semibold text-success-700"
                role="status"
                data-testid="checkout-success"
              >
                {subscriptionCopy.successTitle}
              </p>
            ) : null}

            <button
              type="button"
              onClick={onPay}
              disabled={!canPay}
              aria-disabled={!canPay}
              className={getButtonClassName({
                className: cn(
                  'mt-4 h-12 w-full rounded-lg text-base font-extrabold',
                  !canPay &&
                    'disabled:pointer-events-none disabled:bg-[#9ec0ea] disabled:opacity-100',
                ),
              })}
              data-testid="pro-pay-button"
            >
              {subscriptionCopy.pay}
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

function BillingOption({
  selected,
  onSelect,
  label,
  priceLabel,
  originalLabel,
  badge,
  testId,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  priceLabel: string;
  originalLabel?: string;
  badge?: string;
  testId: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      data-testid={testId}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        selected
          ? 'border-brand-400 bg-[#e8f1fb]'
          : 'border-[#e5e5e5] bg-white hover:bg-surface-50',
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            'inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2',
            selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-300',
          )}
          aria-hidden
        >
          {selected ? <Check size={12} strokeWidth={3} /> : null}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-ink-900">{label}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-extrabold text-ink-950">{priceLabel}</span>
            {originalLabel ? (
              <span className="text-ink-400 line-through">{originalLabel}</span>
            ) : null}
          </span>
        </span>
      </span>
      {badge ? (
        <span className="shrink-0 rounded bg-success-50 px-2 py-1 text-xs font-extrabold text-success-700">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function VisaMark() {
  return (
    <span className="inline-flex h-6 items-center rounded bg-[#1a1f71] px-1.5 text-[10px] font-black tracking-wide text-white">
      VISA
    </span>
  );
}

function MastercardMark() {
  return (
    <span
      className="relative inline-flex h-6 w-9 items-center justify-center"
      aria-hidden
    >
      <span
        className="absolute end-2 size-4 rounded-full"
        style={{ backgroundColor: "#eb001b" }}
      />
      <span
        className="absolute start-2 size-4 rounded-full"
        style={{ backgroundColor: "#f79e1b" }}
      />
    </span>
  );
}
