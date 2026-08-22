'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  ChevronDown,
  Home,
  Hospital,
  Hotel,
  LandPlot,
  Store,
  Trees,
} from 'lucide-react';
import {
  AREA_HISTOGRAM_BARS,
  FILTER_AREA_BOUNDS,
  FILTER_PRICE_BOUNDS,
  PRICE_HISTOGRAM_BARS,
  filterPropertyTypeOptions,
} from '@/config/filter-options';
import { appIcons, ICON_SIZE_UI } from '@/config/icons';
import { uiLabels } from '@/config/labels';
import type { LocationOption } from '@/features/locations';
import {
  AdvancedSearchDrawer,
  RangeHistogram,
} from '@/features/property-search';
import { buildPropertySearchPath } from '@/features/property-search/search-params';
import { formatArea } from '@/lib/formatting/area';
import { formatCompactCurrency } from '@/lib/formatting/currency';
import type { PropertySearchFilters, PropertyType, TransactionType } from '@/types';
import { cn } from '@/lib/utils/cn';

type OpenMenu = 'transaction' | 'propertyType' | 'price' | 'area' | null;

const SaleIcon = appIcons.sale;
const RentIcon = appIcons.rent;
const FilterIcon = appIcons.filter;

const DOMAIN_PROPERTY_TYPES = new Set<string>([
  'apartment',
  'villa',
  'townhouse',
  'duplex',
  'penthouse',
  'studio',
  'chalet',
  'office',
  'shop',
  'land',
]);

const typeIcons: Record<string, typeof Home> = {
  apartment: Building2,
  furnished_apartment: Hotel,
  chalet: Trees,
  villa: Home,
  land: LandPlot,
  building: Building2,
  commercial: Store,
  office: Building2,
  medical: Hospital,
  other: Home,
};

function resolveDomainPropertyType(value: string): PropertyType | undefined {
  if (value === 'commercial') {
    return 'shop';
  }

  if (DOMAIN_PROPERTY_TYPES.has(value)) {
    return value as PropertyType;
  }

  return undefined;
}

interface QuickFilterBarProps {
  filters: PropertySearchFilters;
  locations: LocationOption[];
  selectedLocation: LocationOption | null;
  resultCount: number;
}

export function QuickFilterBar({
  filters,
  locations,
  selectedLocation,
  resultCount,
}: QuickFilterBarProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const [minPrice, setMinPrice] = useState(
    filters.minPrice ?? FILTER_PRICE_BOUNDS.min,
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice ?? FILTER_PRICE_BOUNDS.max,
  );
  const [downPayment, setDownPayment] = useState(
    filters.downPayment?.toString() ?? '',
  );
  const [installmentYears, setInstallmentYears] = useState(
    filters.installmentYears?.toString() ?? '',
  );
  const [minArea, setMinArea] = useState(filters.minArea ?? FILTER_AREA_BOUNDS.min);
  const [maxArea, setMaxArea] = useState(filters.maxArea ?? FILTER_AREA_BOUNDS.max);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenMenu(null);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const transaction = filters.transactionType ?? 'sale';
  const selectedTypeValue =
    filters.propertyType ??
    filters.propertyTypes?.find((value) => value !== 'all') ??
    null;
  const selectedTypeLabel =
    filterPropertyTypeOptions.find((option) => option.value === selectedTypeValue)
      ?.label ?? uiLabels.filterPropertyType;

  function navigate(next: PropertySearchFilters) {
    setOpenMenu(null);
    router.push(buildPropertySearchPath({ ...next, page: 1 }));
  }

  function toggle(menu: OpenMenu) {
    setOpenMenu((current) => (current === menu ? null : menu));
  }

  return (
    <>
      <div
        ref={rootRef}
        className="relative flex flex-wrap gap-2 lg:flex-nowrap"
      >
        <FilterTrigger
          label={transaction === 'sale' ? uiLabels.buy : uiLabels.rent}
          active={openMenu === 'transaction' || Boolean(filters.transactionType)}
          open={openMenu === 'transaction'}
          onClick={() => toggle('transaction')}
          dataTestId="filter-transaction"
        />
        <FilterTrigger
          label={selectedTypeLabel}
          active={
            openMenu === 'propertyType' ||
            Boolean(filters.propertyType || filters.propertyTypes?.length)
          }
          open={openMenu === 'propertyType'}
          onClick={() => toggle('propertyType')}
          dataTestId="filter-property-type"
        />
        <FilterTrigger
          label={uiLabels.filterPrice}
          active={
            openMenu === 'price' ||
            filters.minPrice !== undefined ||
            filters.maxPrice !== undefined
          }
          open={openMenu === 'price'}
          onClick={() => toggle('price')}
          dataTestId="filter-price"
        />
        <FilterTrigger
          label={uiLabels.filterAreaRange}
          active={
            openMenu === 'area' ||
            filters.minArea !== undefined ||
            filters.maxArea !== undefined
          }
          open={openMenu === 'area'}
          onClick={() => toggle('area')}
          dataTestId="filter-area"
        />
        <button
          type="button"
          data-testid="filter-advanced"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex h-[44px] min-w-[9.5rem] flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-white px-3 text-sm font-semibold text-ink-800 transition-colors hover:bg-surface-50"
        >
          <FilterIcon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
          {uiLabels.advancedFilters}
        </button>

        {openMenu === 'transaction' ? (
          <PopoverPanel className="start-0">
            <button
              type="button"
              className={optionClass(transaction === 'sale')}
              onClick={() =>
                navigate({ ...filters, transactionType: 'sale' as TransactionType })
              }
            >
              <SaleIcon className="size-4" aria-hidden />
              {uiLabels.buy}
            </button>
            <button
              type="button"
              className={optionClass(transaction === 'rent')}
              onClick={() =>
                navigate({ ...filters, transactionType: 'rent' as TransactionType })
              }
            >
              <RentIcon className="size-4" aria-hidden />
              {uiLabels.rent}
            </button>
          </PopoverPanel>
        ) : null}

        {openMenu === 'propertyType' ? (
          <PopoverPanel className="start-0 max-h-72 overflow-y-auto sm:start-[20%]">
            <p className="px-3 py-2 text-xs font-semibold text-ink-500">
              {uiLabels.filterPropertyType}
            </p>
            {filterPropertyTypeOptions
              .filter((option) => option.value !== 'all')
              .map((option) => {
                const Icon = typeIcons[option.value] ?? Building2;
                const selected = selectedTypeValue === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={optionClass(selected)}
                    onClick={() => {
                      const domainType = resolveDomainPropertyType(option.value);
                      navigate({
                        ...filters,
                        propertyType: domainType,
                        propertyTypes: domainType ? undefined : [option.value],
                      });
                    }}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {option.label}
                  </button>
                );
              })}
          </PopoverPanel>
        ) : null}

        {openMenu === 'price' ? (
          <PopoverPanel className="start-0 w-[min(100vw-2rem,22rem)] p-4 sm:start-[40%]">
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-ink-600">
                {uiLabels.filterDownPayment}
                <input
                  type="number"
                  inputMode="numeric"
                  value={downPayment}
                  onChange={(event) => setDownPayment(event.target.value)}
                  placeholder={uiLabels.currencyFull}
                  className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-brand-500"
                />
              </label>
              <label className="block text-xs font-semibold text-ink-600">
                {uiLabels.filterInstallmentYears}
                <input
                  type="number"
                  inputMode="numeric"
                  value={installmentYears}
                  onChange={(event) => setInstallmentYears(event.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-brand-500"
                />
              </label>
              <div>
                <p className="mb-2 text-xs font-semibold text-ink-600">
                  {uiLabels.filterPrice}
                </p>
                <RangeHistogram
                  bars={PRICE_HISTOGRAM_BARS}
                  min={FILTER_PRICE_BOUNDS.min}
                  max={FILTER_PRICE_BOUNDS.max}
                  valueMin={minPrice}
                  valueMax={maxPrice}
                  onChange={({ min, max }) => {
                    setMinPrice(min);
                    setMaxPrice(max);
                  }}
                  formatLabel={(value) => formatCompactCurrency(value)}
                  ariaLabelMin={uiLabels.minPrice}
                  ariaLabelMax={uiLabels.maxPrice}
                />
              </div>
              <button
                type="button"
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white hover:bg-brand-700"
                onClick={() =>
                  navigate({
                    ...filters,
                    minPrice:
                      minPrice > FILTER_PRICE_BOUNDS.min ? minPrice : undefined,
                    maxPrice:
                      maxPrice < FILTER_PRICE_BOUNDS.max ? maxPrice : undefined,
                    downPayment: downPayment ? Number(downPayment) : undefined,
                    installmentYears: installmentYears
                      ? Number(installmentYears)
                      : undefined,
                  })
                }
              >
                {uiLabels.searchSubmit} ({resultCount.toLocaleString('ar-EG')})
              </button>
            </div>
          </PopoverPanel>
        ) : null}

        {openMenu === 'area' ? (
          <PopoverPanel className="start-0 w-[min(100vw-2rem,20rem)] p-4 sm:start-[60%]">
            <p className="mb-2 text-xs font-semibold text-ink-600">
              {uiLabels.filterAreaRange}
            </p>
            <RangeHistogram
              bars={AREA_HISTOGRAM_BARS}
              min={FILTER_AREA_BOUNDS.min}
              max={FILTER_AREA_BOUNDS.max}
              valueMin={minArea}
              valueMax={maxArea}
              onChange={({ min, max }) => {
                setMinArea(min);
                setMaxArea(max);
              }}
              formatLabel={(value) => formatArea(value)}
              ariaLabelMin="المساحة من"
              ariaLabelMax="المساحة إلى"
            />
            <button
              type="button"
              className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white hover:bg-brand-700"
              onClick={() =>
                navigate({
                  ...filters,
                  minArea: minArea > FILTER_AREA_BOUNDS.min ? minArea : undefined,
                  maxArea: maxArea < FILTER_AREA_BOUNDS.max ? maxArea : undefined,
                })
              }
            >
              {uiLabels.searchSubmit} ({resultCount.toLocaleString('ar-EG')})
            </button>
          </PopoverPanel>
        ) : null}
      </div>

      {drawerOpen ? (
        <AdvancedSearchDrawer
          onClose={() => setDrawerOpen(false)}
          locations={locations}
          initialTransactionType={transaction}
          initialLocation={selectedLocation}
          resultCount={resultCount}
        />
      ) : null}
    </>
  );
}

function FilterTrigger({
  label,
  active,
  open,
  onClick,
  dataTestId,
}: {
  label: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
  dataTestId: string;
}) {
  return (
    <button
      type="button"
      data-testid={dataTestId}
      onClick={onClick}
      className={cn(
        'relative inline-flex h-[44px] min-w-[9.5rem] flex-1 items-center justify-between gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors',
        active
          ? 'border-brand-200 bg-brand-50 text-brand-700'
          : 'border-border bg-white text-ink-800 hover:bg-surface-50',
      )}
    >

      <span className="truncate">{label}</span>
      <ChevronDown
        className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')}
        aria-hidden
      />
    </button>
  );
}

function PopoverPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div
      id={id}
      className={cn(
        'absolute top-[calc(100%+0.5rem)] z-30 min-w-[14rem] rounded-xl border border-border bg-white py-1 shadow-lg',
        className,
      )}
    >
      {children}
    </div>
  );
}

function optionClass(selected: boolean) {
  return cn(
    'flex w-full items-center gap-2.5 px-3 py-2.5 text-start text-sm font-medium transition-colors',
    selected
      ? 'bg-brand-50 text-brand-700'
      : 'text-ink-800 hover:bg-surface-50',
  );
}
