'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** When set, pagination is controlled in-memory instead of via URL query params. */
  onPageChange?: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const safeTotalPages = Math.max(totalPages, 1);
  const hasPrev = page > 1;
  const hasNext = page < safeTotalPages;

  function goToPage(nextPage: number) {
    if (onPageChange) {
      onPageChange(nextPage);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4">
      <p className="text-sm text-ink-600">
        صفحة {page.toLocaleString('ar-EG')} من{' '}
        {safeTotalPages.toLocaleString('ar-EG')}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="small"
          disabled={!hasPrev}
          onClick={() => goToPage(page - 1)}
        >
          السابق
        </Button>
        <Button
          type="button"
          variant="outline"
          size="small"
          disabled={!hasNext}
          onClick={() => goToPage(page + 1)}
        >
          التالي
        </Button>
      </div>
    </div>
  );
}
