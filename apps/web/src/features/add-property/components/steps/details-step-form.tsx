'use client';

import { useEffect, useMemo, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import type {
  CatalogFeatureDto,
  CatalogTypeDto,
} from '@/types/api/public-property';
import { saveDetailsStepAction } from '../../actions';
import { listingCopy, listingFinishingOptions } from '../../config';
import {
  getPropertyTypeFieldConfig,
  isDetailFieldVisible,
  isRecommendedFeature,
  sortFeaturesByRecommendation,
} from '../../lib/property-type-details';
import { getListingPublicationFee } from '../../lib/pricing';
import type { ListingDraft } from '../../types';
import type { FinishingType } from '@/types';

const inputClass =
  'h-12 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20';

interface DetailsStepFormProps {
  draft: ListingDraft;
  features: CatalogFeatureDto[];
  propertyViews: CatalogTypeDto[];
  legalStatuses: CatalogTypeDto[];
}

function featureLabel(feature: CatalogFeatureDto): string {
  return feature.nameAr?.trim() || feature.nameEn;
}

function catalogOptions(
  items: CatalogTypeDto[],
): { value: string; label: string }[] {
  return items.map((item) => ({
    value: item.id,
    label: item.nameAr?.trim() || item.nameEn,
  }));
}

export function DetailsStepForm({
  draft,
  features,
  propertyViews,
  legalStatuses,
}: DetailsStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const propertyType = draft.propertyType;
  const fieldConfig = useMemo(
    () => getPropertyTypeFieldConfig(propertyType),
    [propertyType],
  );
  const floorLabel = fieldConfig.floorLabel ?? listingCopy.floor;
  const show = (field: Parameters<typeof isDetailFieldVisible>[0]) =>
    isDetailFieldVisible(field, propertyType);

  const sortedFeatures = useMemo(
    () => sortFeaturesByRecommendation(features, propertyType),
    [features, propertyType],
  );
  const viewOptions = useMemo(
    () => catalogOptions(propertyViews),
    [propertyViews],
  );
  const legalStatusOptions = useMemo(
    () => catalogOptions(legalStatuses),
    [legalStatuses],
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
  const [furnished, setFurnished] = useState(
    draft.details.furnished ?? false,
  );
  const [finishing, setFinishing] = useState<FinishingType | undefined>(
    draft.details.finishing,
  );
  const [propertyViewIds, setPropertyViewIds] = useState<string[]>(
    draft.details.propertyViewIds ?? [],
  );
  const [legalStatusId, setLegalStatusId] = useState<string | undefined>(
    draft.details.legalStatusId,
  );
  const [mortgageEligible, setMortgageEligible] = useState(
    draft.details.mortgageEligible ?? false,
  );
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>(
    draft.details.amenities ?? [],
  );

  // Clear local state for fields hidden after a property-type change.
  useEffect(() => {
    if (!show('bedrooms')) setBedrooms('');
    if (!show('bathrooms')) setBathrooms('');
    if (!show('floor')) setFloor('');
    if (!show('yearBuilt')) setYear('');
    if (!show('finishingType')) setFinishing(undefined);
    if (!show('furnished')) setFurnished(false);
    if (!show('propertyViews')) setPropertyViewIds([]);
    if (!show('legalStatus')) setLegalStatusId(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when type changes
  }, [propertyType]);

  function toggleFeature(featureId: string) {
    setSelectedFeatureIds((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId],
    );
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const area = Number(areaSqm);
      const result = await saveDetailsStepAction(draft.id, {
        areaSqm: area,
        bedrooms: show('bedrooms') && bedrooms ? Number(bedrooms) : undefined,
        bathrooms:
          show('bathrooms') && bathrooms ? Number(bathrooms) : undefined,
        floor: show('floor') ? floor || undefined : undefined,
        buildOrDeliveryYear:
          show('yearBuilt') && year ? Number(year) : undefined,
        furnished: show('furnished') ? furnished : undefined,
        finishing: show('finishingType') ? finishing : undefined,
        propertyViewIds: show('propertyViews') ? propertyViewIds : undefined,
        legalStatusId: show('legalStatus') ? legalStatusId : undefined,
        mortgageEligible,
        amenities: selectedFeatureIds,
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

      {show('areaSqm') ? (
        <div>
          <label
            htmlFor="area"
            className="mb-1.5 block text-sm font-semibold text-ink-800"
          >
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
            <span className="pointer-events-none absolute top-0.5 end-3 -translate-y-1/2 text-xs font-semibold text-ink-500">
              متر²
            </span>
          </div>
        </div>
      ) : null}

      {show('bedrooms') ? (
        <Field
          id="bedrooms"
          label={listingCopy.bedrooms}
          value={bedrooms}
          onChange={setBedrooms}
          placeholder="اكتب عدد الغرف"
        />
      ) : null}

      {show('bathrooms') ? (
        <Field
          id="bathrooms"
          label={listingCopy.bathrooms}
          value={bathrooms}
          onChange={setBathrooms}
          placeholder="اكتب عدد الحمامات"
        />
      ) : null}

      {show('floor') ? (
        <Field
          id="floor"
          label={floorLabel}
          value={floor}
          onChange={setFloor}
          placeholder="اكتب الدور"
        />
      ) : null}

      {show('yearBuilt') ? (
        <div>
          <label
            htmlFor="year"
            className="mb-1.5 block text-sm font-semibold text-ink-800"
          >
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
      ) : null}

      {show('propertyViews') && viewOptions.length > 0 ? (
        <ChipGroup
          label={listingCopy.views}
          options={viewOptions}
          selected={propertyViewIds}
          onToggle={(value) =>
            setPropertyViewIds((prev) =>
              prev.includes(value)
                ? prev.filter((id) => id !== value)
                : [...prev, value],
            )
          }
        />
      ) : null}

      {show('finishingType') ? (
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

      {show('furnished') ? (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-[#e5e5e5] px-4 py-3">
          <span className="text-sm font-semibold text-ink-800">
            {listingCopy.furnished}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={furnished}
            onClick={() => setFurnished((v) => !v)}
            className={cn(
              'relative h-7 w-12 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              furnished ? 'bg-brand-600' : 'bg-ink-200',
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform',
                furnished ? 'start-5' : 'start-0.5',
              )}
            />
          </button>
        </div>
      ) : null}

      {show('legalStatus') && legalStatusOptions.length > 0 ? (
        <ChipGroup
          label={listingCopy.legalStatus}
          options={legalStatusOptions}
          selected={legalStatusId ? [legalStatusId] : []}
          onToggle={(value) =>
            setLegalStatusId((prev) => (prev === value ? undefined : value))
          }
          single
        />
      ) : null}

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
        {sortedFeatures.length === 0 ? (
          <p className="text-sm text-ink-500">لا تتوفر مزايا من الكتالوج حاليًا.</p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sortedFeatures.map((feature) => {
              const checked = selectedFeatureIds.includes(feature.id);
              const recommended = isRecommendedFeature(
                feature.code,
                propertyType,
              );
              return (
                <label
                  key={feature.id}
                  className="flex cursor-pointer items-center gap-2 text-sm text-ink-800"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleFeature(feature.id)}
                    className="size-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>
                    {featureLabel(feature)}
                    {recommended ? (
                      <span className="ms-1 text-xs font-semibold text-brand-700">
                        (موصى به)
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
        )}
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
