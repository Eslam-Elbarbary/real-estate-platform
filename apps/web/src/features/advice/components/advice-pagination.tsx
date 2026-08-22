import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import { buildAdviceAskPath } from '../search-params';
import type { AdviceQuestionFilters } from '../types';

interface AdvicePaginationProps {
  filters: AdviceQuestionFilters;
  page: number;
  totalPages: number;
}

export function AdvicePagination({
  filters,
  page,
  totalPages,
}: AdvicePaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (nextPage: number) =>
    buildAdviceAskPath({ ...filters, page: nextPage });

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

  return (
    <nav
      aria-label="ترقيم الصفحات"
      className="flex items-center justify-center gap-1 pt-8"
    >
      {pages.map((item) => (
        <Link
          key={item}
          href={hrefFor(item)}
          aria-current={item === page ? 'page' : undefined}
          className={cn(
            'inline-flex size-8 items-center justify-center text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            item === page
              ? 'bg-brand-600 text-white'
              : 'text-ink-700 hover:bg-surface-50',
          )}
        >
          {item}
        </Link>
      ))}
      {page < totalPages ? (
        <>
          <Link
            href={hrefFor(page + 1)}
            aria-label={uiLabels.paginationNext}
            className="inline-flex size-8 items-center justify-center text-ink-700 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <ChevronLeft className="size-3.5" aria-hidden />
          </Link>
          <Link
            href={hrefFor(totalPages)}
            aria-label="الصفحة الأخيرة"
            className="inline-flex size-8 items-center justify-center text-ink-700 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <ChevronLeft className="size-3.5" aria-hidden />
            <ChevronLeft className="-ms-2 size-3.5" aria-hidden />
          </Link>
        </>
      ) : null}
      {page > 1 ? (
        <Link
          href={hrefFor(Math.max(1, page - 1))}
          aria-label={uiLabels.paginationPrev}
          className="order-first inline-flex size-8 items-center justify-center text-ink-700 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
