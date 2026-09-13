import type { AuthUser } from '@/features/auth/types';
import type {
  EngagementSummary,
  ManagedListingSearchResult,
  ManagedListingStatusCounts,
} from '../types';
import type { MyPropertiesQuery } from '../schemas';
import { myPropertiesCopy } from '../config/copy';
import { buildMyPropertiesHref } from '../search-params';
import { Container } from '@/components/ui/container';
import { ProfileCompletionAlert } from './profile-completion-alert';
import { MyPropertiesPromoBanner } from './promo-banner';
import { ListingOwnerSummary } from './owner-summary';
import { EngagementMetrics } from './engagement-metrics';
import { MyPropertiesSearch } from './my-properties-search';
import { ListingStatusTabs } from './listing-status-tabs';
import { ListingSortControl } from './listing-sort-control';
import {
  ManagedListingList,
  MyPropertiesPagination,
} from './managed-listing-list';

interface MyPropertiesPageProps {
  user: AuthUser;
  filters: MyPropertiesQuery;
  result: ManagedListingSearchResult;
  counts: ManagedListingStatusCounts;
  engagement: EngagementSummary;
  errorMessage?: string;
}

export function MyPropertiesPage({
  user,
  filters,
  result,
  counts,
  engagement,
  errorMessage,
}: MyPropertiesPageProps) {
  return (
    <div className="bg-surface-50 pb-16">
      <ProfileCompletionAlert />
      <MyPropertiesPromoBanner />

      <Container dashboard className="space-y-5 py-2 sm:space-y-6 sm:py-4">
        <h1 className="text-3xl font-extrabold text-ink-950">
          {myPropertiesCopy.title}
        </h1>

        <ListingOwnerSummary name={user.name} />
        <EngagementMetrics summary={engagement} />
        <MyPropertiesSearch filters={filters} />

        <div className="space-y-4">
          <ListingStatusTabs filters={filters} counts={counts} />

          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="max-w-2xl text-xs leading-6 text-ink-500">
              {filters.status === 'published'
                ? myPropertiesCopy.publishedHint
                : myPropertiesCopy.statusLabels[filters.status]}
            </p>
            <ListingSortControl filters={filters} />
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-danger-200 bg-danger-50 px-6 py-10 text-center">
              <p className="text-sm font-semibold text-danger-700">
                {errorMessage || myPropertiesCopy.loadError}
              </p>
              <a
                href={buildMyPropertiesHref({
                  status: filters.status,
                  q: filters.q,
                  sort: filters.sort,
                  page: filters.page,
                })}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-5 text-sm font-bold text-white hover:bg-brand-700"
              >
                {myPropertiesCopy.retry}
              </a>
            </div>
          ) : (
            <>
              <ManagedListingList
                items={result.items}
                status={filters.status}
                hasQuery={Boolean(filters.q.trim())}
              />

              <MyPropertiesPagination
                filters={filters}
                page={result.page}
                totalPages={result.totalPages}
              />
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
