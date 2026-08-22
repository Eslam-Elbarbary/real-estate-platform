import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { FavoritesPage, activityCopy } from '@/features/activity';

export const metadata = createPageMetadata({
  title: activityCopy.favorites.title,
  description: activityCopy.favorites.seoDescription,
  path: routes.favorites,
  noIndex: true,
});

export default async function FavoritesRoutePage() {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.favorites)}`,
    );
  }

  return <FavoritesPage />;
}
