'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { AdminPropertySort } from '../types';
import type { PropertyStatus } from '@/types';

const SORT_OPTIONS: Array<{ value: AdminPropertySort; label: string }> = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'oldest', label: 'الأقدم' },
  { value: 'price_asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price_desc', label: 'السعر: من الأعلى للأقل' },
];

interface PropertiesFiltersProps {
  status?: PropertyStatus;
  search: string;
  sort: AdminPropertySort;
}

export function PropertiesFilters({
  search,
  sort,
}: PropertiesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(search);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

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
    if (trimmed === search) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce only on searchValue
  }, [searchValue]);

  function handleSortChange(nextSort: string) {
    pushParams((params) => {
      if (nextSort && nextSort !== 'newest') {
        params.set('sort', nextSort);
      } else {
        params.delete('sort');
      }
    });
  }

  return (
    <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end">
      <div className="min-w-0 flex-1">
        <Input
          name="search"
          label="بحث"
          placeholder="ابحث بالعنوان أو الرقم المرجعي أو المالك..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          disabled={isPending}
        />
      </div>
      <div className="w-full lg:w-72">
        <Select
          name="sort"
          label="الترتيب"
          options={SORT_OPTIONS}
          value={sort}
          disabled={isPending}
          onChange={(event) => handleSortChange(event.target.value)}
        />
      </div>
    </div>
  );
}
