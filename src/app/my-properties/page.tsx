import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { getPropertyManagementService } from '@/features/my-properties/service';
import { parseMyPropertiesSearchParams } from '@/features/my-properties/search-params';
import { MyPropertiesPage } from '@/features/my-properties/components/my-properties-page';
import { getListingDraftService } from '@/features/add-property/service';
import { listingDraftToManagedListing } from '@/features/my-properties/lib/draft-bridge';

export const metadata = createPageMetadata({
  title: 'عقاراتي',
  description: 'إدارة إعلاناتك العقارية ومتابعة مستوى التفاعل.',
  path: routes.myProperties,
  noIndex: true,
});

interface MyPropertiesRouteProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
  const draftService = getListingDraftService();

  const [result, counts, engagement, drafts] = await Promise.all([
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
    draftService.listDrafts(session.user.id),
  ]);

  const draftManaged = drafts.map(listingDraftToManagedListing);
  const mergedCounts = {
    ...counts,
    draft: counts.draft + draftManaged.length,
    all: counts.all + draftManaged.length,
  };

  let mergedResult = result;
  if (filters.status === 'draft') {
    const combined = [...draftManaged, ...result.items];
    const total = combined.length;
    const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
    const page = Math.min(filters.page, totalPages);
    const start = (page - 1) * filters.pageSize;
    mergedResult = {
      items: combined.slice(start, start + filters.pageSize),
      total,
      page,
      pageSize: filters.pageSize,
      totalPages,
    };
  }

  return (
    <MyPropertiesPage
      user={session.user}
      filters={filters}
      result={mergedResult}
      counts={mergedCounts}
      engagement={engagement}
    />
  );
}
