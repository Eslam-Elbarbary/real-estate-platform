import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { StartListingClient } from '@/features/add-property/components/start-listing-client';

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

  return <StartListingClient initialError={error} />;
}
