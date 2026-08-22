import Link from 'next/link';
import type { ManagedListingStatus, ManagedListingStatusCounts } from '../types';
import type { MyPropertiesQuery } from '../schemas';
import { buildMyPropertiesHref } from '../search-params';
import { STATUS_TAB_ORDER, myPropertiesCopy } from '../config/copy';
import { cn } from '@/lib/utils/cn';

interface ListingStatusTabsProps {
  filters: MyPropertiesQuery;
  counts: ManagedListingStatusCounts;
}

export function ListingStatusTabs({ filters, counts }: ListingStatusTabsProps) {
  return (
    <nav aria-label="حالة الإعلانات" className="-mx-1 overflow-x-auto px-1">
      <ul className="flex min-w-max items-end gap-5 border-b border-[#e5e5e5]">
        {STATUS_TAB_ORDER.map((status) => {
          const active = filters.status === status;
          const count = counts[status];
          return (
            <li key={status}>
              <Link
                href={buildMyPropertiesHref({
                  status,
                  q: filters.q,
                  sort: filters.sort,
                })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 border-b-2 pb-3 text-sm font-semibold transition-colors',
                  active
                    ? 'border-accent-600 text-accent-700'
                    : 'border-transparent text-ink-600 hover:text-ink-900',
                )}
              >
                <span>{myPropertiesCopy.statusLabels[status]}</span>
                <span className="text-xs text-ink-400">({count})</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export type { ManagedListingStatus };
