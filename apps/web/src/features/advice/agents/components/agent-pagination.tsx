import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';

interface AgentPaginationProps {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}

export function AgentPagination({
  page,
  totalPages,
  hrefFor,
}: AgentPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 6) }, (_, index) => index + 1);

  return (
    <nav
      aria-label="ترقيم الصفحات"
      className="flex items-center justify-center gap-1 pt-8"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          aria-label={uiLabels.paginationPrev}
          className="inline-flex size-8 items-center justify-center text-ink-700 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      ) : null}
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
        <Link
          href={hrefFor(page + 1)}
          aria-label={uiLabels.paginationNext}
          className="inline-flex size-8 items-center justify-center text-ink-700 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <ChevronLeft className="size-3.5" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
