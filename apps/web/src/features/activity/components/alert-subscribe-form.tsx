'use client';

import { useMemo, useState, useTransition, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, X } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import {
  propertyTypeOptions,
  transactionOptions,
} from '@/config/property-types';
import {
  RENT_PRICE_SUGGESTIONS,
  SALE_PRICE_SUGGESTIONS,
} from '@/config/search';
import { formatCurrency } from '@/lib/formatting/currency';
import { formatArea } from '@/lib/formatting/area';
import type { Location, PropertyType, TransactionType } from '@/types';
import { createAlertAction } from '../actions';
import { ALERT_AREA_OPTIONS, activityCopy } from '../copy';

const fieldClass =
  'h-10 w-full rounded-md border border-[#d0d0d0] bg-white px-3 text-sm text-ink-900 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200';

interface AlertSubscribeFormProps {
  locations: Location[];
}

export function AlertSubscribeForm({ locations }: AlertSubscribeFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    [locations.find((item) => item.slug === 'new-cairo')?.slug ?? locations[0]?.slug].filter(
      Boolean,
    ) as string[],
  );
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [transaction, setTransaction] = useState<TransactionType>('sale');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');

  const priceOptions = useMemo(
    () =>
      transaction === 'rent' ? RENT_PRICE_SUGGESTIONS : SALE_PRICE_SUGGESTIONS,
    [transaction],
  );

  function toggleLocation(slug: string) {
    setSelectedSlugs((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug],
    );
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (selectedSlugs.length === 0) {
      setError(activityCopy.alerts.noLocations);
      return;
    }
    setError(null);
    startTransition(async () => {
      await createAlertAction({
        locationSlugs: selectedSlugs,
        propertyType,
        transaction,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minArea: minArea ? Number(minArea) : undefined,
        maxArea: maxArea ? Number(maxArea) : undefined,
      });
      setToast(activityCopy.alerts.success);
      router.refresh();
      window.setTimeout(() => setToast(null), 2200);
    });
  }

  return (
    <aside className="rounded-xl bg-[#f5f5f5] p-4 sm:p-5">
      <h2 className="text-base font-extrabold text-ink-950">
        {activityCopy.alerts.sidebarTitle}
      </h2>
      <p className="mt-2 text-xs leading-6 text-ink-600">
        {activityCopy.alerts.sidebarHint}
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <fieldset>
          <legend className="mb-1.5 text-xs font-bold text-ink-700">
            {activityCopy.alerts.location}
          </legend>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {selectedSlugs.map((slug) => {
              const location = locations.find((item) => item.slug === slug);
              if (!location) return null;
              return (
                <span
                  key={slug}
                  className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700"
                >
                  <MapPin size={12} aria-hidden />
                  {location.name}
                  <button
                    type="button"
                    onClick={() => toggleLocation(slug)}
                    className="rounded hover:bg-brand-100"
                    aria-label={`إزالة ${location.name}`}
                  >
                    <X size={12} aria-hidden />
                  </button>
                </span>
              );
            })}
          </div>
          <select
            className={fieldClass}
            value=""
            aria-label={activityCopy.alerts.selectLocation}
            onChange={(event) => {
              const value = event.target.value;
              if (value) toggleLocation(value);
            }}
          >
            <option value="">{activityCopy.alerts.selectLocation}</option>
            {locations.map((location) => (
              <option
                key={location.id}
                value={location.slug}
                disabled={selectedSlugs.includes(location.slug)}
              >
                {location.name}
              </option>
            ))}
          </select>
        </fieldset>

        <Field label={activityCopy.alerts.type}>
          <select
            className={fieldClass}
            value={propertyType}
            onChange={(event) =>
              setPropertyType(event.target.value as PropertyType)
            }
          >
            {propertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={activityCopy.alerts.section}>
          <select
            className={fieldClass}
            value={transaction}
            onChange={(event) =>
              setTransaction(event.target.value as TransactionType)
            }
          >
            {transactionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label={activityCopy.alerts.minPrice}>
          <select
            className={fieldClass}
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          >
            <option value="">—</option>
            {priceOptions.map((value) => (
              <option key={value} value={value}>
                {formatCurrency(value)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={activityCopy.alerts.maxPrice}>
          <select
            className={fieldClass}
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          >
            <option value="">—</option>
            {priceOptions.map((value) => (
              <option key={value} value={value}>
                {formatCurrency(value)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={activityCopy.alerts.minArea}>
          <select
            className={fieldClass}
            value={minArea}
            onChange={(event) => setMinArea(event.target.value)}
          >
            <option value="">—</option>
            {ALERT_AREA_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {formatArea(value)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={activityCopy.alerts.maxArea}>
          <select
            className={fieldClass}
            value={maxArea}
            onChange={(event) => setMaxArea(event.target.value)}
          >
            <option value="">—</option>
            {ALERT_AREA_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {formatArea(value)}
              </option>
            ))}
          </select>
        </Field>

        {error ? (
          <p className="text-xs text-danger-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={getButtonClassName({
            className: 'h-11 w-full rounded-full font-bold',
          })}
        >
          {activityCopy.alerts.subscribe}
        </button>
      </form>

      {toast ? (
        <p
          role="status"
          className="mt-3 rounded-md bg-success-50 px-3 py-2 text-xs font-semibold text-success-700"
          data-testid="alert-created-toast"
        >
          {toast}
        </p>
      ) : null}
    </aside>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-ink-700">{label}</span>
      {children}
    </label>
  );
}
