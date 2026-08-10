import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { NeighborhoodBreadcrumbItem } from '../types';

interface NeighborhoodBreadcrumbProps {
  items: NeighborhoodBreadcrumbItem[];
  className?: string;
}

export function NeighborhoodBreadcrumb({
  items,
  className,
}: NeighborhoodBreadcrumbProps) {
  return (
    <nav aria-label="مسار التنقل" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-ink-500">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.label}`} className="inline-flex items-center gap-1">
              {index > 0 ? (
                <ChevronLeft className="size-3.5 shrink-0 text-ink-400" aria-hidden />
              ) : null}
              {last ? (
                <span className="font-semibold text-ink-800">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
