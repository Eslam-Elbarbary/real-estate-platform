'use client';

import { useMemo, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { saveDetailsStepAction } from '../../actions';
import {
  detailsFieldVisibility,
  listingAmenityOptions,
  listingCopy,
  listingFinishingOptions,
  listingRegistrationOptions,
  listingViewOptions,
} from '../../config';
import { getListingPublicationFee } from '../../lib/pricing';
import type {
  ListingAmenityId,
  ListingDraft,
  ListingRegistrationStatus,
  ListingViewType,
} from '../../types';
import type { FinishingType } from '@/types';

const inputClass =
  'h-12 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

interface DetailsStepFormProps {
  draft: ListingDraft;
}

export function DetailsStepForm({ draft }: DetailsStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const visibility = useMemo(
    () => detailsFieldVisibility(draft.propertyType),
    [draft.propertyType],
  );

  const fee = getListingPublicationFee({
    transaction: draft.transaction,
    propertyType: draft.propertyType,
    locationId: draft.locationId,
  });

  const [areaSqm, setAreaSqm] = useState(
    draft.details.areaSqm?.toString() ?? '',
  );
  const [bedrooms, setBedrooms] = useState(
    draft.details.bedrooms?.toString() ?? '',
  );
  const [bathrooms, setBathrooms] = useState(
    draft.details.bathrooms?.toString() ?? '',
  );
  const [floor, setFloor] = useState(
    draft.details.floor != null ? String(draft.details.floor) : '',
  );
  const [year, setYear] = useState(
    draft.details.buildOrDeliveryYear?.toString() ?? '',
  );
  const [views, setViews] = useState<ListingViewType[]>(draft.details.views ?? []);
  const [finishing, setFinishing] = useState<
    FinishingType | 'extra_super_lux' | undefined
  >(draft.details.finishing);
  const [registrationStatus, setRegistrationStatus] = useState<
    ListingRegistrationStatus | undefined
  >(draft.details.registrationStatus);
  const [mortgageEligible, setMortgageEligible] = useState(
    draft.details.mortgageEligible ?? false,
  );
  const [amenities, setAmenities] = useState<ListingAmenityId[]>(
    draft.details.amenities ?? [],
  );

  function toggleView(value: ListingViewType) {
    setViews((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function toggleAmenity(value: ListingAmenityId) {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const area = Number(areaSqm);
      const result = await saveDetailsStepAction(draft.id, {
        areaSqm: area,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        floor: floor || undefined,
        buildOrDeliveryYear: year ? Number(year) : undefined,
        views,
        finishing,
        registrationStatus,
        mortgageEligible,
        amenities,
      });
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
      <div className="rounded-lg border border-accent-100 bg-[#fff8e8] px-4 py-3 text-sm font-semibold text-ink-800">
        {listingCopy.feeNotice(fee.amountEgp)}
      </div>

      <div>
        <label htmlFor="area" className="mb-1.5 block text-sm font-semibold text-ink-800">
          {listingCopy.area}
        </label>
        <div className="relative">
          <input
            id="area"
            inputMode="decimal"
            value={areaSqm}
            onChange={(e) => setAreaSqm(e.target.value)}
            placeholder="اكتب المساحة"
            className={cn(inputClass, 'pe-16')}
            required
          />
          <span className="pointer-events-none absolute top-1/2 end-3 -translate-y-1/2 text-xs font-semibold text-ink-500">
            متر²
          </span>
        </div>
      </div>

      {visibility.bedrooms ? (
        <Field
          id="bedrooms"
          label={listingCopy.bedrooms}
          value={bedrooms}
          onChange={setBedrooms}
          placeholder="اكتب عدد الغرف"
        />
      ) : null}

      {visibility.bathrooms ? (
        <Field
          id="bathrooms"
          label={listingCopy.bathrooms}
          value={bathrooms}
          onChange={setBathrooms}
          placeholder="اكتب عدد الحمامات"
        />
      ) : null}

      {visibility.floor ? (
        <Field
          id="floor"
          label={listingCopy.floor}
          value={floor}
          onChange={setFloor}
          placeholder="اكتب الدور"
        />
      ) : null}

      <div>
        <label htmlFor="year" className="mb-1.5 block text-sm font-semibold text-ink-800">
          {listingCopy.year}
        </label>
        <input
          id="year"
          inputMode="numeric"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="مثال: 2020"
          className={inputClass}
        />
      </div>

      {visibility.views ? (
        <ChipGroup
          label={listingCopy.views}
          options={listingViewOptions}
          selected={views}
          onToggle={toggleView}
        />
      ) : null}

      {visibility.finishing ? (
        <ChipGroup
          label={listingCopy.finishing}
          options={listingFinishingOptions}
          selected={finishing ? [finishing] : []}
          onToggle={(value) =>
            setFinishing((prev) => (prev === value ? undefined : value))
          }
          single
        />
      ) : null}

      <ChipGroup
        label={listingCopy.registration}
        options={listingRegistrationOptions}
        selected={registrationStatus ? [registrationStatus] : []}
        onToggle={(value) =>
          setRegistrationStatus((prev) => (prev === value ? undefined : value))
        }
        single
      />

      <div className="flex items-center justify-between gap-4 rounded-lg border border-[#e5e5e5] px-4 py-3">
        <span className="text-sm font-semibold text-ink-800">
          {listingCopy.mortgage}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={mortgageEligible}
          onClick={() => setMortgageEligible((v) => !v)}
          className={cn(
            'relative h-7 w-12 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            mortgageEligible ? 'bg-brand-600' : 'bg-ink-200',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform',
              mortgageEligible ? 'start-5' : 'start-0.5',
            )}
          />
        </button>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink-800">
          {listingCopy.amenities}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {listingAmenityOptions.map((option) => {
            const checked = amenities.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm text-ink-800"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAmenity(option.value)}
                  className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

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

function Field({
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
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
  single?: boolean;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink-800">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onToggle(option.value)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                active
                  ? 'border-brand-500 bg-brand-50 text-brand-800'
                  : 'border-[#d9d9d9] bg-white text-ink-700 hover:bg-surface-50',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
