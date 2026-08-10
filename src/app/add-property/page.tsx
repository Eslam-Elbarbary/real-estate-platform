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

export default async function AddPropertyPage() {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
    );
  }

  return <StartListingClient />;
}
