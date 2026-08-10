'use client';

import { useMemo, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { savePriceStepAction } from '../../actions';
import { listingCopy } from '../../config';
import {
  downPaymentPercent,
  monthlyInstallment,
} from '../../lib/pricing';
import type {
  DeveloperPricing,
  ListingDraft,
  ListingPaymentMode,
  OwnerCashPricing,
  OwnerInstallmentPricing,
  RentPricing,
} from '../../types';

const inputClass =
  'h-12 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

interface PriceStepFormProps {
  draft: ListingDraft;
}

type SaleMode = ListingPaymentMode;
type DurationUnit = 'years' | 'months';

export function PriceStepForm({ draft }: PriceStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isRent = draft.transaction === 'rent';

  const initialMode: SaleMode | 'rent' =
    draft.pricing.mode ?? (isRent ? 'rent' : 'developer');

  const [mode, setMode] = useState<SaleMode | 'rent'>(
    isRent ? 'rent' : initialMode === 'rent' ? 'developer' : initialMode,
  );

  const [cashPrice, setCashPrice] = useState(
    draft.pricing.mode === 'developer'
      ? String(draft.pricing.cashPrice ?? '')
      : '',
  );
  const [installmentTotal, setInstallmentTotal] = useState(
    draft.pricing.mode === 'developer'
      ? String(draft.pricing.installmentTotalPrice ?? '')
      : '',
  );
  const [downMode, setDownMode] = useState<'egp' | 'percent'>(
    draft.pricing.mode === 'developer' ? draft.pricing.downPayment.mode : 'egp',
  );
  const [downValue, setDownValue] = useState(
    draft.pricing.mode === 'developer'
      ? String(draft.pricing.downPayment.value ?? '')
      : '',
  );
  const [durationMonths, setDurationMonths] = useState(() => {
    if (draft.pricing.mode === 'developer' && draft.pricing.installmentDurationMonths) {
      return draft.pricing.installmentDurationMonths;
    }
    return 0;
  });
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('years');

  const [ownerCashPrice, setOwnerCashPrice] = useState(
    draft.pricing.mode === 'owner_cash' ? String(draft.pricing.price) : '',
  );

  const [contractPrice, setContractPrice] = useState(
    draft.pricing.mode === 'owner_installments'
      ? String(draft.pricing.contractPrice)
      : '',
  );
  const [overPrice, setOverPrice] = useState(
    draft.pricing.mode === 'owner_installments'
      ? String(draft.pricing.overPrice ?? '')
      : '',
  );
  const [maintenance, setMaintenance] = useState(
    draft.pricing.mode === 'owner_installments'
      ? String(draft.pricing.maintenanceDeposit ?? '')
      : '',
  );
  const [totalPaid, setTotalPaid] = useState(
    draft.pricing.mode === 'owner_installments'
      ? String(draft.pricing.totalPaid)
      : '',
  );
  const [remainingMonths, setRemainingMonths] = useState(
    draft.pricing.mode === 'owner_installments'
      ? draft.pricing.remainingInstallmentMonths
      : 0,
  );
  const [remainingUnit, setRemainingUnit] = useState<DurationUnit>('months');

  const [rentPrice, setRentPrice] = useState(
    draft.pricing.mode === 'rent' ? String(draft.pricing.price) : '',
  );

  const developerPreview = useMemo(() => {
    if (mode !== 'developer') return null;
    const pricing: DeveloperPricing = {
      mode: 'developer',
      cashPrice: cashPrice ? Number(cashPrice) : undefined,
      installmentTotalPrice: installmentTotal ? Number(installmentTotal) : undefined,
      downPayment: {
        mode: downMode,
        value: downValue ? Number(downValue) : undefined,
      },
      installmentDurationMonths: durationMonths > 0 ? durationMonths : undefined,
    };
    return {
      monthly: monthlyInstallment(pricing),
      percent: downPaymentPercent(pricing),
    };
  }, [mode, cashPrice, installmentTotal, downMode, downValue, durationMonths]);

  function buildPayload() {
    if (isRent || mode === 'rent') {
      const payload: RentPricing = {
        mode: 'rent',
        price: Number(rentPrice),
        pricingPeriod: 'monthly',
      };
      return payload;
    }
    if (mode === 'owner_cash') {
      const payload: OwnerCashPricing = {
        mode: 'owner_cash',
        price: Number(ownerCashPrice),
      };
      return payload;
    }
    if (mode === 'owner_installments') {
      const payload: OwnerInstallmentPricing = {
        mode: 'owner_installments',
        contractPrice: Number(contractPrice),
        overPrice: overPrice ? Number(overPrice) : undefined,
        maintenanceDeposit: maintenance ? Number(maintenance) : undefined,
        totalPaid: Number(totalPaid),
        remainingInstallmentMonths: Math.max(1, remainingMonths),
      };
      return payload;
    }
    const payload: DeveloperPricing = {
      mode: 'developer',
      cashPrice: cashPrice ? Number(cashPrice) : undefined,
      installmentTotalPrice: installmentTotal ? Number(installmentTotal) : undefined,
      downPayment: {
        mode: downMode,
        value: downValue ? Number(downValue) : undefined,
      },
      installmentDurationMonths: durationMonths > 0 ? durationMonths : undefined,
    };
    return payload;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await savePriceStepAction(draft.id, buildPayload());
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(result.data.href);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {isRent ? (
        <MoneyField
          id="rent-price"
          label={listingCopy.rentPrice}
          value={rentPrice}
          onChange={setRentPrice}
          placeholder="ادخل سعر الإيجار الشهري"
        />
      ) : (
        <>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-ink-800">
              {listingCopy.paymentMethod}
            </legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['developer', listingCopy.developer],
                  ['owner_cash', listingCopy.ownerCash],
                  ['owner_installments', listingCopy.ownerInstallments],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    mode === value
                      ? 'border-brand-500 bg-brand-50 text-brand-800'
                      : 'border-[#d9d9d9] bg-white text-ink-700',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          {mode === 'developer' ? (
            <div className="space-y-4">
              <MoneyField
                id="cash-price"
                label={listingCopy.price}
                value={cashPrice}
                onChange={setCashPrice}
                placeholder="ادخل سعر العقار نقداً"
              />
              <MoneyField
                id="installment-total"
                label={listingCopy.installmentTotal}
                value={installmentTotal}
                onChange={setInstallmentTotal}
                placeholder="ادخل سعر العقار بالتقسيط"
              />
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="down-payment"
                    className="text-sm font-semibold text-ink-800"
                  >
                    {listingCopy.downPayment}
                  </label>
                  <div className="inline-flex overflow-hidden rounded-lg border border-[#d9d9d9]">
                    <button
                      type="button"
                      onClick={() => setDownMode('egp')}
                      className={cn(
                        'px-3 py-1.5 text-xs font-bold',
                        downMode === 'egp'
                          ? 'bg-brand-600 text-white'
                          : 'bg-white text-ink-600',
                      )}
                    >
                      EGP
                    </button>
                    <button
                      type="button"
                      onClick={() => setDownMode('percent')}
                      className={cn(
                        'px-3 py-1.5 text-xs font-bold',
                        downMode === 'percent'
                          ? 'bg-brand-600 text-white'
                          : 'bg-white text-ink-600',
                      )}
                    >
                      %
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input
                    id="down-payment"
                    inputMode="decimal"
                    value={downValue}
                    onChange={(e) => setDownValue(e.target.value)}
                    placeholder="ادخل سعر المقدم"
                    className={cn(inputClass, 'pe-24')}
                  />
                  <span className="pointer-events-none absolute top-1/2 end-3 -translate-y-1/2 text-xs font-semibold text-ink-500">
                    {downMode === 'percent' ? '%' : listingCopy.egp}
                  </span>
                </div>
                {developerPreview?.percent != null ? (
                  <p className="mt-1.5 text-xs font-semibold text-ink-500">
                    {listingCopy.downPaymentPercent(developerPreview.percent)}
                  </p>
                ) : null}
              </div>
              <DurationSlider
                id="duration"
                label={listingCopy.installmentDuration}
                months={durationMonths}
                unit={durationUnit}
                onUnitChange={setDurationUnit}
                onMonthsChange={setDurationMonths}
              />
              {developerPreview?.monthly != null ? (
                <p className="text-xs font-semibold text-brand-700">
                  {listingCopy.monthlyInstallment(developerPreview.monthly)}
                </p>
              ) : null}
            </div>
          ) : null}

          {mode === 'owner_cash' ? (
            <MoneyField
              id="owner-cash"
              label={listingCopy.price}
              value={ownerCashPrice}
              onChange={setOwnerCashPrice}
              placeholder="ادخل السعر"
            />
          ) : null}

          {mode === 'owner_installments' ? (
            <div className="space-y-4">
              <MoneyField
                id="contract-price"
                label={listingCopy.contractPrice}
                value={contractPrice}
                onChange={setContractPrice}
                placeholder="ادخل سعر العقد"
              />
              <MoneyField
                id="over-price"
                label={listingCopy.overPrice}
                value={overPrice}
                onChange={setOverPrice}
                placeholder="اختياري"
              />
              <MoneyField
                id="maintenance"
                label={listingCopy.maintenance}
                value={maintenance}
                onChange={setMaintenance}
                placeholder="اختياري"
              />
              <MoneyField
                id="total-paid"
                label={listingCopy.totalPaid}
                value={totalPaid}
                onChange={setTotalPaid}
                placeholder="ادخل إجمالي المدفوع"
              />
              <DurationSlider
                id="remaining"
                label={listingCopy.remainingPeriod}
                months={remainingMonths}
                unit={remainingUnit}
                onUnitChange={setRemainingUnit}
                onMonthsChange={setRemainingMonths}
              />
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
        className={getButtonClassName({
          className: 'h-12 min-w-[140px] rounded-lg px-8 text-base font-extrabold',
        })}
      >
        {listingCopy.continue}
      </button>
    </form>
  );
}

function DurationSlider({
  id,
  label,
  months,
  unit,
  onUnitChange,
  onMonthsChange,
}: {
  id: string;
  label: string;
  months: number;
  unit: DurationUnit;
  onUnitChange: (unit: DurationUnit) => void;
  onMonthsChange: (months: number) => void;
}) {
  const displayValue = unit === 'years' ? Math.round(months / 12) : months;
  const max = unit === 'years' ? 20 : 240;
  const unitLabel = unit === 'years' ? listingCopy.years : listingCopy.months;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink-800">
          {label}
        </label>
        <div className="inline-flex overflow-hidden rounded-lg border border-[#d9d9d9]">
          <button
            type="button"
            onClick={() => onUnitChange('years')}
            className={cn(
              'px-3 py-1.5 text-xs font-bold',
              unit === 'years' ? 'bg-brand-600 text-white' : 'bg-white text-ink-600',
            )}
          >
            {listingCopy.years}
          </button>
          <button
            type="button"
            onClick={() => onUnitChange('months')}
            className={cn(
              'px-3 py-1.5 text-xs font-bold',
              unit === 'months' ? 'bg-brand-600 text-white' : 'bg-white text-ink-600',
            )}
          >
            {listingCopy.months}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={0}
          max={max}
          step={1}
          value={Math.min(displayValue, max)}
          onChange={(e) => {
            const next = Number(e.target.value);
            onMonthsChange(unit === 'years' ? next * 12 : next);
          }}
          className="h-2 w-full accent-brand-600"
          aria-valuetext={`${displayValue} ${unitLabel}`}
        />
        <span className="shrink-0 rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-800">
          {displayValue} {unitLabel}
        </span>
      </div>
    </div>
  );
}

function MoneyField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(inputClass, 'pe-24')}
        />
        <span className="pointer-events-none absolute top-1/2 end-3 -translate-y-1/2 text-xs font-semibold text-ink-500">
          {listingCopy.egp}
        </span>
      </div>
    </div>
  );
}
