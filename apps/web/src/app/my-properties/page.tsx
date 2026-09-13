import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { ApiRequestError } from '@/lib/api/errors';
import { getPropertyManagementService } from '@/features/my-properties/service';
import { parseMyPropertiesSearchParams } from '@/features/my-properties/search-params';
import { MyPropertiesPage } from '@/features/my-properties/components/my-properties-page';
import type {
  EngagementSummary,
  ManagedListingSearchResult,
  ManagedListingStatusCounts,
} from '@/features/my-properties/types';

export const metadata = createPageMetadata({
  title: 'عقاراتي',
  description: 'إدارة إعلاناتك العقارية ومتابعة مستوى التفاعل.',
  path: routes.myProperties,
  noIndex: true,
});

interface MyPropertiesRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const EMPTY_COUNTS: ManagedListingStatusCounts = {
  published: 0,
  rejected: 0,
  expired: 0,
  pending: 0,
  deleted: 0,
  draft: 0,
  all: 0,
};

const EMPTY_ENGAGEMENT: EngagementSummary = {
  totalSearchAppearances: null,
  totalViews: null,
  totalContacts: null,
  averageViewRate: null,
  averageContactRate: null,
  averageContactCost: null,
};

function emptyResult(
  page: number,
  pageSize: number,
): ManagedListingSearchResult {
  return {
    items: [],
    total: 0,
    page,
    pageSize,
    totalPages: 0,
  };
}

export default async function MyPropertiesRoutePage({
  searchParams,
}: MyPropertiesRouteProps) {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.myProperties)}`,
    );
  }

  const params = await searchParams;
  const filters = parseMyPropertiesSearchParams(params);
  const service = getPropertyManagementService();

  try {
    const [result, counts, engagement] = await Promise.all([
      service.searchListings({
        userId: session.user.id,
        status: filters.status,
        query: filters.q,
        sort: filters.sort,
        page: filters.page,
        pageSize: filters.pageSize,
      }),
      service.getStatusCounts(session.user.id),
      service.getEngagementSummary(session.user.id),
    ]);

    return (
      <MyPropertiesPage
        user={session.user}
        filters={filters}
        result={result}
        counts={counts}
        engagement={engagement}
      />
    );
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.code === 'UNAUTHORIZED' || error.status === 401)
    ) {
      redirect(
        `${routes.auth.login}?returnTo=${encodeURIComponent(routes.myProperties)}`,
      );
    }

    const message =
      error instanceof ApiRequestError && error.code === 'NETWORK'
        ? error.userMessage
        : 'تعذر تحميل عقاراتك حاليًا';

    return (
      <MyPropertiesPage
        user={session.user}
        filters={filters}
        result={emptyResult(filters.page, filters.pageSize)}
        counts={EMPTY_COUNTS}
        engagement={EMPTY_ENGAGEMENT}
        errorMessage={message}
      />
    );
  }
}
