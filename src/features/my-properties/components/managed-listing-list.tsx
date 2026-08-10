import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import type { ManagedListing, ManagedListingStatus } from '../types';
import type { MyPropertiesQuery } from '../schemas';
import { buildMyPropertiesHref } from '../search-params';
import { myPropertiesCopy } from '../config/copy';
import { ManagedListingRow } from './managed-listing-row';
import { cn } from '@/lib/utils/cn';

interface MyPropertiesEmptyStateProps {
  status: ManagedListingStatus;
  hasQuery: boolean;
}

export function MyPropertiesEmptyState({
  status,
  hasQuery,
}: MyPropertiesEmptyStateProps) {
  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white px-6 py-16 text-center">
      <p className="text-sm leading-7 text-ink-600">
        {hasQuery
          ? myPropertiesCopy.emptySearch
          : myPropertiesCopy.empty[status]}
      </p>
      <Link
        href={routes.addListing}
        className={getButtonClassName({
          className: 'mt-6 h-10 rounded-lg px-6 font-bold',
        })}
      >
        {myPropertiesCopy.advertiseCta}
      </Link>
    </div>
  );
}

interface MyPropertiesPaginationProps {
  filters: MyPropertiesQuery;
  page: number;
  totalPages: number;
}

export function MyPropertiesPagination({
  filters,
  page,
  totalPages,
}: MyPropertiesPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="ترقيم الصفحات"
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
    >
      {pages.map((pageNumber) => (
        <Link
          key={pageNumber}
          href={buildMyPropertiesHref({
            status: filters.status,
            q: filters.q,
            sort: filters.sort,
            page: pageNumber,
          })}
          aria-current={pageNumber === page ? 'page' : undefined}
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-md text-sm font-semibold',
            pageNumber === page
              ? 'bg-brand-600 text-white'
              : 'border border-[#e5e5e5] text-ink-700 hover:bg-surface-50',
          )}
        >
          {pageNumber}
        </Link>
      ))}
    </nav>
  );
}

interface ManagedListingListProps {
  items: ManagedListing[];
  status: ManagedListingStatus;
  hasQuery: boolean;
}

export function ManagedListingList({
  items,
  status,
  hasQuery,
}: ManagedListingListProps) {
  if (items.length === 0) {
    return <MyPropertiesEmptyState status={status} hasQuery={hasQuery} />;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ManagedListingRow key={item.id} listing={item} />
      ))}
    </div>
  );
}
