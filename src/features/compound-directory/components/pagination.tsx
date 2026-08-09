import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import type { CompoundSearchFilters } from '@/types';
import { cn } from '@/lib/utils/cn';
import { buildCompoundSearchPath } from '../search-params';

interface CompoundPaginationProps {
  filters: CompoundSearchFilters;
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

  const sorted = [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
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

export function CompoundPagination({
  filters,
  page,
  totalPages,
  className,
}: CompoundPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (nextPage: number) =>
    buildCompoundSearchPath({
      ...filters,
      page: nextPage,
    });

  return (
    <nav
      aria-label="ترقيم الصفحات"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <Link
        href={hrefFor(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-md border border-border text-ink-700',
          page <= 1 && 'pointer-events-none opacity-40',
        )}
        aria-label={uiLabels.paginationPrev}
      >
        <ChevronRight className="size-3.5" aria-hidden />
      </Link>

      {pageWindow(page, totalPages).map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`e-${index}`} className="px-1 text-ink-400">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            className={cn(
              'inline-flex size-8 items-center justify-center rounded-md text-[13px] font-semibold',
              item === page
                ? 'bg-brand-600 text-white'
                : 'border border-border text-ink-700 hover:bg-surface-50',
            )}
          >
            {item}
          </Link>
        ),
      )}

      <Link
        href={hrefFor(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={cn(
          'inline-flex size-8 items-center justify-center rounded-md border border-border text-ink-700',
          page >= totalPages && 'pointer-events-none opacity-40',
        )}
        aria-label={uiLabels.paginationNext}
      >
        <ChevronLeft className="size-3.5" aria-hidden />
      </Link>
    </nav>
  );
}
