'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { PropertyStatus } from '@/types';
import type {
  AdminPropertySort,
  CatalogPropertyType,
  CatalogTransactionType,
} from '../types';
import { PROPERTY_STATUS_CONFIG } from './property-status-badge';

const SORT_OPTIONS: Array<{ value: AdminPropertySort; label: string }> = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'oldest', label: 'الأقدم' },
  { value: 'price_asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price_desc', label: 'السعر: من الأعلى للأقل' },
];

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'كل الحالات' },
  ...(
    Object.entries(PROPERTY_STATUS_CONFIG) as Array<
      [PropertyStatus, { label: string }]
    >
  ).map(([value, config]) => ({
    value,
    label: config.label,
  })),
];

export interface PropertiesListFilters {
  status?: PropertyStatus;
  search: string;
  sort: AdminPropertySort;
  propertyTypeId: string;
  transactionTypeId: string;
  location: string;
  owner: string;
  dateFrom: string;
  dateTo: string;
}

interface PropertiesFiltersProps {
  filters: PropertiesListFilters;
  propertyTypes: CatalogPropertyType[];
  transactionTypes: CatalogTransactionType[];
}

type FilterKey =
  | 'status'
  | 'search'
  | 'sort'
  | 'propertyTypeId'
  | 'transactionTypeId'
  | 'location'
  | 'owner'
  | 'dateFrom'
  | 'dateTo';

function catalogLabel(item: { nameAr: string | null; nameEn: string }) {
  return item.nameAr ?? item.nameEn;
}

export function PropertiesFilters({
  filters,
  propertyTypes,
  transactionTypes,
}: PropertiesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search);
  const [ownerValue, setOwnerValue] = useState(filters.owner);
  const [locationValue, setLocationValue] = useState(filters.location);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    setOwnerValue(filters.owner);
  }, [filters.owner]);

  useEffect(() => {
    setLocationValue(filters.location);
  }, [filters.location]);

  function pushParams(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);
    params.delete('page');
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname);
    });
  }

  useEffect(() => {
    const trimmed = searchValue.trim();
    if (trimmed === filters.search) {
      return;
    }

    const timer = window.setTimeout(() => {
      pushParams((params) => {
        if (trimmed) {
          params.set('search', trimmed);
        } else {
          params.delete('search');
        }
      });
    }, 400);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce search only
  }, [searchValue]);

  useEffect(() => {
    const trimmed = ownerValue.trim();
    if (trimmed === filters.owner) {
      return;
    }

    const timer = window.setTimeout(() => {
      pushParams((params) => {
        if (trimmed) {
          params.set('owner', trimmed);
        } else {
          params.delete('owner');
        }
      });
    }, 400);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce owner only
  }, [ownerValue]);

  useEffect(() => {
    const trimmed = locationValue.trim();
    if (trimmed === filters.location) {
      return;
    }

    const timer = window.setTimeout(() => {
      pushParams((params) => {
        if (trimmed) {
          params.set('location', trimmed);
        } else {
          params.delete('location');
        }
      });
    }, 400);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce location only
  }, [locationValue]);

  function setParam(key: FilterKey, value: string, defaultValue = '') {
    pushParams((params) => {
      if (value && value !== defaultValue) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  function removeChip(key: FilterKey) {
    pushParams((params) => {
      params.delete(key);
      if (key === 'sort') {
        params.delete('sort');
      }
    });
  }

  const propertyTypeOptions = useMemo(
    () => [
      { value: '', label: 'كل أنواع العقارات' },
      ...propertyTypes.map((item) => ({
        value: item.id,
        label: catalogLabel(item),
      })),
    ],
    [propertyTypes],
  );

  const transactionTypeOptions = useMemo(
    () => [
      { value: '', label: 'كل أنواع المعاملات' },
      ...transactionTypes.map((item) => ({
        value: item.id,
        label: catalogLabel(item),
      })),
    ],
    [transactionTypes],
  );

  const chips = useMemo(() => {
    const list: Array<{ key: FilterKey; label: string }> = [];

    if (filters.status) {
      list.push({
        key: 'status',
        label: `الحالة: ${PROPERTY_STATUS_CONFIG[filters.status]?.label ?? filters.status}`,
      });
    }
    if (filters.search) {
      list.push({ key: 'search', label: `بحث: ${filters.search}` });
    }
    if (filters.propertyTypeId) {
      const match = propertyTypes.find((item) => item.id === filters.propertyTypeId);
      list.push({
        key: 'propertyTypeId',
        label: `نوع العقار: ${match ? catalogLabel(match) : filters.propertyTypeId}`,
      });
    }
    if (filters.transactionTypeId) {
      const match = transactionTypes.find(
        (item) => item.id === filters.transactionTypeId,
      );
      list.push({
        key: 'transactionTypeId',
        label: `المعاملة: ${match ? catalogLabel(match) : filters.transactionTypeId}`,
      });
    }
    if (filters.location) {
      list.push({ key: 'location', label: `الموقع: ${filters.location}` });
    }
    if (filters.owner) {
      list.push({ key: 'owner', label: `المالك: ${filters.owner}` });
    }
    if (filters.dateFrom) {
      list.push({ key: 'dateFrom', label: `من: ${filters.dateFrom}` });
    }
    if (filters.dateTo) {
      list.push({ key: 'dateTo', label: `إلى: ${filters.dateTo}` });
    }
    if (filters.sort !== 'newest') {
      const sortLabel =
        SORT_OPTIONS.find((option) => option.value === filters.sort)?.label ??
        filters.sort;
      list.push({ key: 'sort', label: `ترتيب: ${sortLabel}` });
    }

    return list;
  }, [filters, propertyTypes, transactionTypes]);

  const hasClientOnlyFilters = Boolean(
    filters.propertyTypeId ||
      filters.transactionTypeId ||
      filters.location ||
      filters.owner ||
      filters.dateFrom ||
      filters.dateTo,
  );

  return (
    <div className="mb-6 space-y-3">
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input
            name="search"
            label="بحث"
            placeholder="العنوان أو الرقم المرجعي..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            disabled={isPending}
          />
          <Select
            name="status"
            label="الحالة"
            options={STATUS_OPTIONS}
            value={filters.status ?? ''}
            disabled={isPending}
            onChange={(event) => setParam('status', event.target.value)}
          />
          <Select
            name="transactionTypeId"
            label="نوع المعاملة"
            options={transactionTypeOptions}
            value={filters.transactionTypeId}
            disabled={isPending}
            onChange={(event) =>
              setParam('transactionTypeId', event.target.value)
            }
          />
          <Select
            name="propertyTypeId"
            label="نوع العقار"
            options={propertyTypeOptions}
            value={filters.propertyTypeId}
            disabled={isPending}
            onChange={(event) => setParam('propertyTypeId', event.target.value)}
          />
          <Input
            name="location"
            label="الموقع"
            placeholder="مدينة، منطقة، حي..."
            value={locationValue}
            onChange={(event) => setLocationValue(event.target.value)}
            disabled={isPending}
          />
          <Input
            name="owner"
            label="المالك"
            placeholder="اسم أو بريد المالك..."
            value={ownerValue}
            onChange={(event) => setOwnerValue(event.target.value)}
            disabled={isPending}
          />
          <Input
            name="dateFrom"
            label="من تاريخ"
            type="date"
            value={filters.dateFrom}
            disabled={isPending}
            onChange={(event) => setParam('dateFrom', event.target.value)}
          />
          <Input
            name="dateTo"
            label="إلى تاريخ"
            type="date"
            value={filters.dateTo}
            disabled={isPending}
            onChange={(event) => setParam('dateTo', event.target.value)}
          />
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <Select
              name="sort"
              label="الترتيب"
              options={SORT_OPTIONS}
              value={filters.sort}
              disabled={isPending}
              onChange={(event) =>
                setParam('sort', event.target.value, 'newest')
              }
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={isPending || chips.length === 0}
            onClick={clearFilters}
          >
            مسح الفلاتر
          </Button>
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800 transition-colors hover:bg-brand-100"
              onClick={() => removeChip(chip.key)}
            >
              <span>{chip.label}</span>
              <X className="size-3.5" aria-hidden />
              <span className="sr-only">إزالة الفلتر</span>
            </button>
          ))}
        </div>
      ) : null}

      {hasClientOnlyFilters ? (
        <p className="text-xs text-ink-500">
          فلاتر النوع والموقع والمالك والتاريخ تُطبَّق على نتائج الصفحة الحالية
          حتى يتوفر دعمها في واجهة البرمجة.
        </p>
      ) : null}
    </div>
  );
}
