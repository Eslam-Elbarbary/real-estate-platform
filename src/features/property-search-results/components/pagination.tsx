import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { buildPropertySearchPath } from '@/features/property-search/search-params';
import type { PropertySearchFilters } from '@/types';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  filters: PropertySearchFilters;
  page: number;
  totalPages: number;
  className?: string;
}

function pageWindow(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  if (page <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (page >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort(
    (a, b) => a - b,
  );
  const result: Array<number | 'ellipsis'> = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const current = sorted[index];
    const previous = sorted[index - 1];
    if (previous && current - previous > 1) {
      result.push('ellipsis');
    }
    result.push(current);
  }

  return result;
}

export function Pagination({
  filters,
  page,
  totalPages,
  className,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (nextPage: number) =>
    buildPropertySearchPath({
      ...filters,
      page: nextPage,
    });

  return (
    <nav
      aria-label="ترقيم الصفحات"
      className={cn('flex flex-wrap items-center justify-center gap-1.5', className)}
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-white px-3 text-sm font-medium text-ink-800 hover:bg-surface-50"
        >
          <ChevronRight className="size-4" aria-hidden />
          {uiLabels.paginationPrev}
        </Link>
      ) : null}

      {pageWindow(page, totalPages).map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="inline-flex h-9 min-w-9 items-center justify-center text-sm text-ink-400"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm font-semibold',
              item === page
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-border bg-white text-ink-800 hover:bg-surface-50',
            )}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-white px-3 text-sm font-medium text-ink-800 hover:bg-surface-50"
        >
          {uiLabels.paginationNext}
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
