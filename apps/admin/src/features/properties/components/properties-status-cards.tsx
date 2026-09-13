'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import type { AdminPropertyStatusCounts } from '../types';
import type { PropertyStatus } from '@/types';

const STATUS_CARDS: Array<{
  key: 'ALL' | PropertyStatus;
  label: string;
  status?: PropertyStatus;
}> = [
  { key: 'ALL', label: 'الكل' },
  { key: 'PUBLISHED', label: 'منشور', status: 'PUBLISHED' },
  { key: 'PENDING_REVIEW', label: 'في انتظار المراجعة', status: 'PENDING_REVIEW' },
  { key: 'PENDING_PAYMENT', label: 'بانتظار الدفع', status: 'PENDING_PAYMENT' },
  { key: 'DRAFT', label: 'مسودة', status: 'DRAFT' },
  { key: 'REJECTED', label: 'مرفوض', status: 'REJECTED' },
  { key: 'ARCHIVED', label: 'مؤرشف', status: 'ARCHIVED' },
  { key: 'EXPIRED', label: 'منتهي', status: 'EXPIRED' },
];

interface PropertiesStatusCardsProps {
  counts: AdminPropertyStatusCounts;
  activeStatus?: PropertyStatus;
}

export function PropertiesStatusCards({
  counts,
  activeStatus,
}: PropertiesStatusCardsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(status?: PropertyStatus): string {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
      {STATUS_CARDS.map((card) => {
        const isActive =
          card.key === 'ALL' ? !activeStatus : activeStatus === card.status;
        const count = counts[card.key] ?? 0;

        return (
          <Link
            key={card.key}
            href={hrefFor(card.status)}
            className={cn(
              'rounded-xl border px-3 py-3 transition-colors',
              isActive
                ? 'border-brand-500 bg-brand-50 shadow-sm'
                : 'border-border bg-white hover:border-brand-200 hover:bg-surface-50',
            )}
          >
            <p className="text-xs font-medium text-ink-500">{card.label}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-ink-900">
              {count.toLocaleString('ar-EG')}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
