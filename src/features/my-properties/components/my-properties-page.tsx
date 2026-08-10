import type { AuthUser } from '@/features/auth/types';
import type {
  EngagementSummary,
  ManagedListingSearchResult,
  ManagedListingStatusCounts,
} from '../types';
import type { MyPropertiesQuery } from '../schemas';
import { myPropertiesCopy } from '../config/copy';
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
}

export function MyPropertiesPage({
  user,
  filters,
  result,
  counts,
  engagement,
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
        </div>
      </Container>
    </div>
  );
}
