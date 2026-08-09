'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AREA_HISTOGRAM_BARS,
  FILTER_AREA_BOUNDS,
  FILTER_PRICE_BOUNDS,
  filterPaymentOptions,
  filterPropertyTypeOptions,
  filterViewOptions,
  PRICE_HISTOGRAM_BARS,
} from '@/config/filter-options';
import { getAppIcon, ICON_SIZE_UI } from '@/config/icons';
import { uiLabels } from '@/config/labels';
import type { LocationOption } from '@/features/locations';
import { buildPropertySearchPath } from '@/features/property-search/search-params';
import type { FilterPaymentType, PropertyType, TransactionType } from '@/types';
import { cn } from '@/lib/utils/cn';
import { LocationField } from './location-field';
import { FilterChip } from './filter-chip';
import { RangeHistogram } from './range-histogram';

const CloseIcon = getAppIcon('close');
const ResetIcon = getAppIcon('reset');
const LocationIcon = getAppIcon('location');
const SectionIcon = getAppIcon('section');
const SearchIcon = getAppIcon('search');
const SaleIcon = getAppIcon('sale');
const RentIcon = getAppIcon('rent');

interface AdvancedSearchDrawerProps {
  onClose: () => void;
  locations: LocationOption[];
  initialTransactionType?: TransactionType;
  initialLocation?: LocationOption | null;
  resultCount?: number;
}

interface DrawerState {
  transactionType: TransactionType;
  location: LocationOption | null;
  propertyTypes: string[];
  paymentTypes: FilterPaymentType[];
  downPayment: string;
  installmentYears: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  views: string[];
  insideCompound: boolean;
  directOwner: boolean;
  hasVideo: boolean;
  aiRecommended: boolean;
  keyword: string;
}

function createDefaultState(
  transactionType: TransactionType,
  location: LocationOption | null = null,
): DrawerState {
  return {
    transactionType,
    location,
    propertyTypes: ['all'],
    paymentTypes: [],
    downPayment: '',
    installmentYears: '',
    minPrice: FILTER_PRICE_BOUNDS.min,
    maxPrice: FILTER_PRICE_BOUNDS.max,
    minArea: FILTER_AREA_BOUNDS.min,
    maxArea: FILTER_AREA_BOUNDS.max,
    views: ['all'],
    insideCompound: false,
    directOwner: false,
    hasVideo: false,
    aiRecommended: false,
    keyword: '',
  };
}

function formatPriceLabel(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} مليون`;
  }

  if (value >= 1_000) {
    return `${Math.round(value / 1_000)} ألف`;
  }

  return String(value);
}

function formatAreaLabel(value: number): string {
  return `${value.toLocaleString('en-US')} م²`;
}

function resolveDomainPropertyType(
  propertyTypes: string[],
): PropertyType | undefined {
  const selected = propertyTypes.filter((value) => value !== 'all');
  if (selected.length !== 1) {
    return undefined;
  }

  const [value] = selected;
  if (
    value === 'apartment' ||
    value === 'villa' ||
    value === 'chalet' ||
    value === 'land' ||
    value === 'office'
  ) {
    return value;
  }

  if (value === 'commercial') {
    return 'shop';
  }

  return undefined;
}

function ProBadge() {
  return (
    <span className="ms-1 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold text-white bg-accent-500">
      {uiLabels.proBadge}
    </span>
  );
}

export function AdvancedSearchDrawer({
  onClose,
  locations,
  initialTransactionType = 'sale',
  initialLocation = null,
  resultCount,
}: AdvancedSearchDrawerProps) {
  const router = useRouter();
  const titleId = useId();
  const [state, setState] = useState<DrawerState>(() =>
    createDefaultState(initialTransactionType, initialLocation),
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const submitLabel = useMemo(() => {
    if (typeof resultCount === 'number' && Number.isFinite(resultCount)) {
      return `${uiLabels.searchSubmit} (${resultCount.toLocaleString('en-US')})`;
    }

    return uiLabels.searchSubmit;
  }, [resultCount]);

  function resetFilters() {
    setState(createDefaultState(state.transactionType, null));
  }

  function togglePropertyType(value: string) {
    setState((current) => {
      if (value === 'all') {
        return { ...current, propertyTypes: ['all'] };
      }

      const withoutAll = current.propertyTypes.filter((item) => item !== 'all');
      const exists = withoutAll.includes(value);
      const next = exists
        ? withoutAll.filter((item) => item !== value)
        : [...withoutAll, value];

      return {
        ...current,
        propertyTypes: next.length > 0 ? next : ['all'],
      };
    });
  }

  function togglePayment(value: FilterPaymentType) {
    setState((current) => {
      const exists = current.paymentTypes.includes(value);
      return {
        ...current,
        paymentTypes: exists
          ? current.paymentTypes.filter((item) => item !== value)
          : [...current.paymentTypes, value],
      };
    });
  }

  function toggleView(value: string) {
    setState((current) => {
      if (value === 'all') {
        return { ...current, views: ['all'] };
      }

      const withoutAll = current.views.filter((item) => item !== 'all');
      const exists = withoutAll.includes(value);
      const next = exists
        ? withoutAll.filter((item) => item !== value)
        : [...withoutAll, value];

      return {
        ...current,
        views: next.length > 0 ? next : ['all'],
      };
    });
  }

  function handleSubmit() {
    const propertyType = resolveDomainPropertyType(state.propertyTypes);
    const propertyTypes = state.propertyTypes.includes('all')
      ? undefined
      : state.propertyTypes;
    const views = state.views.includes('all') ? undefined : state.views;

    const href = buildPropertySearchPath({
      transactionType: state.transactionType,
      propertyType,
      propertyTypes,
      locationSlugs: state.location?.pathSlugs,
      paymentTypes: state.paymentTypes.length ? state.paymentTypes : undefined,
      downPayment: state.downPayment ? Number(state.downPayment) : undefined,
      installmentYears: state.installmentYears
        ? Number(state.installmentYears)
        : undefined,
      minPrice:
        state.minPrice > FILTER_PRICE_BOUNDS.min ? state.minPrice : undefined,
      maxPrice:
        state.maxPrice < FILTER_PRICE_BOUNDS.max ? state.maxPrice : undefined,
      minArea:
        state.minArea > FILTER_AREA_BOUNDS.min ? state.minArea : undefined,
      maxArea:
        state.maxArea < FILTER_AREA_BOUNDS.max ? state.maxArea : undefined,
      views,
      insideCompound: state.insideCompound || undefined,
      directOwner: state.directOwner || undefined,
      hasVideo: state.hasVideo || undefined,
      aiRecommended: state.aiRecommended || undefined,
      keyword: state.keyword.trim() || undefined,
    });

    onClose();
    router.push(href);
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label={uiLabels.closeMenu}
        className="absolute inset-0 bg-ink-950/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-y-0 left-0 flex w-[min(100%,34rem)] max-w-[550px] flex-col bg-white shadow-lg"
      >
        <div className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-border bg-white px-4 py-3">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <ResetIcon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
            {uiLabels.resetFilters}
          </button>

          <h2
            id={titleId}
            className="text-center text-sm font-bold text-ink-900"
          >
            {uiLabels.advancedFiltersTitle}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center justify-self-end rounded-md text-ink-700 hover:bg-surface-50"
            aria-label={uiLabels.closeMenu}
          >
            <CloseIcon size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <section className="space-y-3 border-b border-border pb-5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-800">
              <SectionIcon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
              {uiLabels.filterSection}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: 'sale' as const, label: uiLabels.buy, Icon: SaleIcon },
                  { value: 'rent' as const, label: uiLabels.rent, Icon: RentIcon },
                ] as const
              ).map((option) => {
                const selected = state.transactionType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setState((current) => ({
                        ...current,
                        transactionType: option.value,
                      }))
                    }
                    className={cn(
                      'inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-semibold transition-colors',
                      selected
                        ? 'border-brand-200 bg-brand-50 text-brand-600'
                        : 'border-border bg-white text-ink-700',
                    )}
                  >
                    <option.Icon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3 border-b border-border py-5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-800">
              <LocationIcon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
              {uiLabels.filterArea}
            </div>
            <LocationField
              locations={locations}
              value={state.location}
              onChange={(location) =>
                setState((current) => ({ ...current, location }))
              }
              variant="drawer"
              placeholder={uiLabels.filterAreaPlaceholder}
            />
          </section>

          <section className="space-y-3 border-b border-border py-5">
            <p className="text-sm font-semibold text-ink-800">
              {uiLabels.filterPropertyType}
            </p>
            <div className="flex flex-wrap gap-2">
              {filterPropertyTypeOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={state.propertyTypes.includes(option.value)}
                  onClick={() => togglePropertyType(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3 border-b border-border py-5">
            <p className="text-sm font-semibold text-ink-800">
              {uiLabels.filterPayment}
            </p>
            <div className="flex flex-wrap gap-2">
              {filterPaymentOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={state.paymentTypes.includes(
                    option.value as FilterPaymentType,
                  )}
                  onClick={() =>
                    togglePayment(option.value as FilterPaymentType)
                  }
                />
              ))}
            </div>
          </section>

          <section className="space-y-2 border-b border-border py-5">
            <p className="text-sm font-semibold text-ink-800">
              {uiLabels.filterDownPayment}
            </p>
            <div className="flex h-11 items-center overflow-hidden rounded-lg border border-border bg-white">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={state.downPayment}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    downPayment: event.target.value,
                  }))
                }
                placeholder={uiLabels.filterDownPaymentPlaceholder}
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
              />
              <span className="shrink-0 border-s border-border px-3 text-xs text-ink-500">
                {uiLabels.currencyFull}
              </span>
            </div>
          </section>

          <section className="space-y-2 border-b border-border py-5">
            <p className="text-sm font-semibold text-ink-800">
              {uiLabels.filterInstallmentYears}
            </p>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={state.installmentYears}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  installmentYears: event.target.value,
                }))
              }
              placeholder={uiLabels.filterInstallmentYearsPlaceholder}
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none"
            />
          </section>

          <section className="space-y-3 border-b border-border py-5">
            <p className="text-sm font-semibold text-ink-800">
              {uiLabels.filterPrice}
            </p>
            <RangeHistogram
              bars={PRICE_HISTOGRAM_BARS}
              min={FILTER_PRICE_BOUNDS.min}
              max={FILTER_PRICE_BOUNDS.max}
              valueMin={state.minPrice}
              valueMax={state.maxPrice}
              onChange={({ min, max }) =>
                setState((current) => ({
                  ...current,
                  minPrice: min,
                  maxPrice: max,
                }))
              }
              formatLabel={formatPriceLabel}
              ariaLabelMin={uiLabels.minPrice}
              ariaLabelMax={uiLabels.maxPrice}
            />
          </section>

          <section className="space-y-3 border-b border-border py-5">
            <p className="text-sm font-semibold text-ink-800">
              {uiLabels.filterAreaRange}
            </p>
            <RangeHistogram
              bars={AREA_HISTOGRAM_BARS}
              min={FILTER_AREA_BOUNDS.min}
              max={FILTER_AREA_BOUNDS.max}
              valueMin={state.minArea}
              valueMax={state.maxArea}
              onChange={({ min, max }) =>
                setState((current) => ({
                  ...current,
                  minArea: min,
                  maxArea: max,
                }))
              }
              formatLabel={formatAreaLabel}
              ariaLabelMin="الحد الأدنى للمساحة"
              ariaLabelMax="الحد الأقصى للمساحة"
            />
          </section>

          <section className="space-y-3 border-b border-border py-5">
            <p className="flex items-center text-sm font-semibold text-ink-800">
              {uiLabels.filterView}
              <ProBadge />
            </p>
            <div className="flex flex-wrap gap-2">
              {filterViewOptions.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  selected={state.views.includes(option.value)}
                  onClick={() => toggleView(option.value)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3 border-b border-border py-5">
            {(
              [
                {
                  key: 'insideCompound' as const,
                  label: uiLabels.insideCompoundOnly,
                  pro: false,
                },
                {
                  key: 'directOwner' as const,
                  label: uiLabels.directOwnerOnly,
                  pro: true,
                },
                {
                  key: 'hasVideo' as const,
                  label: uiLabels.hasVideoOnly,
                  pro: true,
                },
                {
                  key: 'aiRecommended' as const,
                  label: uiLabels.aiRecommended,
                  pro: true,
                },
              ] as const
            ).map((option) => (
              <label
                key={option.key}
                className="flex cursor-pointer items-center justify-between gap-3 text-sm text-ink-800"
              >
                <span className="inline-flex items-center">
                  {option.label}
                  {option.pro ? <ProBadge /> : null}
                </span>
                <input
                  type="checkbox"
                  checked={state[option.key]}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      [option.key]: event.target.checked,
                    }))
                  }
                  className="size-4 accent-brand-600"
                />
              </label>
            ))}
          </section>

          <section className="space-y-2 py-5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-800">
              <SearchIcon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
              {uiLabels.filterKeyword}
            </div>
            <textarea
              value={state.keyword}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  keyword: event.target.value,
                }))
              }
              placeholder={uiLabels.filterKeywordPlaceholder}
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none"
            />
          </section>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-white p-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white transition-colors hover:bg-brand-700"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
