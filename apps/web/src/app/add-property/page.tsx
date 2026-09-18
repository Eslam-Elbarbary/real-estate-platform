import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { StartListingClient } from '@/features/add-property/components/start-listing-client';
import { getListingDraftService } from '@/features/add-property/service';
import { ApiRequestError } from '@/lib/api/errors';

export const metadata = createPageMetadata({
  title: 'إضافة إعلان',
  description: 'أنشئ إعلان عقار جديد خطوة بخطوة.',
  path: routes.addProperty.root,
  noIndex: true,
});

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AddPropertyPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
    );
  }

  const params = await searchParams;
  const rawError = params.error;
  const error =
    typeof rawError === 'string'
      ? rawError
      : Array.isArray(rawError)
        ? rawError[0]
        : undefined;

  let drafts: Awaited<
    ReturnType<ReturnType<typeof getListingDraftService>['listApiDraftSummaries']>
  > = [];

  try {
    drafts = await getListingDraftService().listApiDraftSummaries(
      session.user.id,
    );
  } catch (err) {
    if (
      err instanceof ApiRequestError &&
      (err.code === 'UNAUTHORIZED' || err.status === 401)
    ) {
      redirect(
        `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
      );
    }
    const message =
      err instanceof Error ? err.message : 'تعذر تحميل المسودات';
    return (
      <StartListingClient
        drafts={[]}
        initialError={error ?? message}
      />
    );
  }

  return <StartListingClient drafts={drafts} initialError={error} />;
}
