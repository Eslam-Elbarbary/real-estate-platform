'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { savePriceStepAction } from '../../actions';
import { listingCopy } from '../../config';
import { showsInstallmentFields } from '../../lib/pricing';
import type {
  ApiPaymentType,
  ApiRentPeriodCode,
  ListingDraft,
  ListingPricingDraft,
} from '../../types';

const inputClass =
  'h-12 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

const PAYMENT_OPTIONS: Array<{ value: ApiPaymentType; label: string }> = [
  { value: 'CASH', label: 'نقدي' },
  { value: 'INSTALLMENT', label: 'تقسيط' },
  { value: 'CASH_OR_INSTALLMENT', label: 'نقدي أو تقسيط' },
];

const RENT_PERIOD_OPTIONS: Array<{ value: ApiRentPeriodCode; label: string }> =
  [
    { value: 'DAILY', label: 'يومي' },
    { value: 'MONTHLY', label: 'شهري' },
    { value: 'YEARLY', label: 'سنوي' },
  ];

interface PriceStepFormProps {
  draft: ListingDraft;
}

function parseOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : undefined;
}

export function PriceStepForm({ draft }: PriceStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isRent = draft.transaction === 'rent';

  const [price, setPrice] = useState(
    draft.pricing.price != null ? String(draft.pricing.price) : '',
  );
  const [currency, setCurrency] = useState(
    draft.pricing.currency?.trim() || 'EGP',
  );
  const [paymentType, setPaymentType] = useState<ApiPaymentType | ''>(
    isRent ? '' : draft.pricing.paymentType || '',
  );
  const [downPayment, setDownPayment] = useState(
    draft.pricing.downPayment != null ? String(draft.pricing.downPayment) : '',
  );
  const [installmentYears, setInstallmentYears] = useState(
    draft.pricing.installmentYears != null
      ? String(draft.pricing.installmentYears)
      : '',
  );
  const [monthlyInstallment, setMonthlyInstallment] = useState(
    draft.pricing.monthlyInstallment != null
      ? String(draft.pricing.monthlyInstallment)
      : '',
  );
  const [rentPeriod, setRentPeriod] = useState<ApiRentPeriodCode | ''>(
    isRent ? draft.pricing.rentPeriod || 'MONTHLY' : '',
  );

  const showInstallments =
    !isRent && showsInstallmentFields(paymentType);

  function onSelectPaymentType(next: ApiPaymentType) {
    setPaymentType(next);
    if (next === 'CASH') {
      setDownPayment('');
      setInstallmentYears('');
      setMonthlyInstallment('');
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const payload: ListingPricingDraft = {
      price: parseOptionalNumber(price),
      currency: currency.trim() || 'EGP',
      paymentType: isRent ? '' : paymentType,
      rentPeriod: isRent ? rentPeriod : '',
      downPayment: showInstallments
        ? parseOptionalNumber(downPayment)
        : undefined,
      installmentYears: showInstallments
        ? parseOptionalNumber(installmentYears)
        : undefined,
      monthlyInstallment: showInstallments
        ? parseOptionalNumber(monthlyInstallment)
        : undefined,
    };

    startTransition(async () => {
      const result = await savePriceStepAction(draft.id, payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(result.data.href);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="listing-price"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          {isRent ? listingCopy.rentPrice : listingCopy.price}
        </label>
        <input
          id="listing-price"
          inputMode="decimal"
          className={inputClass}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={pending}
          dir="ltr"
        />
      </div>

      <div>
        <label
          htmlFor="listing-currency"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          العملة
        </label>
        <input
          id="listing-currency"
          className={inputClass}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={pending}
          dir="ltr"
        />
      </div>

      {isRent ? (
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-extrabold text-ink-900">
            فترة الإيجار
          </legend>
          <div className="flex flex-wrap gap-2">
            {RENT_PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={pending}
                onClick={() => setRentPeriod(option.value)}
                className={cn(
                  'h-10 rounded-lg border px-4 text-sm font-bold',
                  rentPeriod === option.value
                    ? 'border-brand-600 bg-brand-50 text-brand-800'
                    : 'border-[#e5e5e5] bg-white text-ink-700',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <>
          <fieldset className="space-y-2">
            <legend className="mb-1 text-sm font-extrabold text-ink-900">
              {listingCopy.paymentMethod}
            </legend>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={pending}
                  onClick={() => onSelectPaymentType(option.value)}
                  className={cn(
                    'h-10 rounded-lg border px-4 text-sm font-bold',
                    paymentType === option.value
                      ? 'border-brand-600 bg-brand-50 text-brand-800'
                      : 'border-[#e5e5e5] bg-white text-ink-700',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          {showInstallments ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="down-payment"
                  className="mb-1.5 block text-sm font-semibold text-ink-800"
                >
                  {listingCopy.downPayment}
                  {paymentType === 'CASH_OR_INSTALLMENT' ? ' (اختياري)' : ''}
                </label>
                <input
                  id="down-payment"
                  inputMode="decimal"
                  className={inputClass}
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  disabled={pending}
                  dir="ltr"
                />
              </div>
              <div>
                <label
                  htmlFor="installment-years"
                  className="mb-1.5 block text-sm font-semibold text-ink-800"
                >
                  سنوات التقسيط
                  {paymentType === 'CASH_OR_INSTALLMENT' ? ' (اختياري)' : ''}
                </label>
                <input
                  id="installment-years"
                  inputMode="numeric"
                  className={inputClass}
                  value={installmentYears}
                  onChange={(e) => setInstallmentYears(e.target.value)}
                  disabled={pending}
                  dir="ltr"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="monthly-installment"
                  className="mb-1.5 block text-sm font-semibold text-ink-800"
                >
                  القسط الشهري
                  {paymentType === 'CASH_OR_INSTALLMENT' ? ' (اختياري)' : ''}
                </label>
                <input
                  id="monthly-installment"
                  inputMode="decimal"
                  className={inputClass}
                  value={monthlyInstallment}
                  onChange={(e) => setMonthlyInstallment(e.target.value)}
                  disabled={pending}
                  dir="ltr"
                />
              </div>
            </div>
          ) : null}
        </>
      )}

      {error ? (
        <p className="text-sm font-semibold text-danger-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          getButtonClassName({
            className:
              'h-12 min-w-[140px] rounded-lg px-8 text-base font-extrabold',
          }),
          pending && 'opacity-70',
        )}
      >
        {pending ? 'جارٍ الحفظ…' : listingCopy.continue}
      </button>
    </form>
  );
}
