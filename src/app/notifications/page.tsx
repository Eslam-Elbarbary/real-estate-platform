import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import {
  NotificationsPage,
  activityCopy,
  getNotificationsService,
} from '@/features/activity';

export const metadata = createPageMetadata({
  title: activityCopy.notifications.title,
  description: activityCopy.notifications.seoDescription,
  path: routes.notifications,
  noIndex: true,
});

export default async function NotificationsRoutePage() {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.notifications)}`,
    );
  }

  const notifications = await getNotificationsService().list(session.user.id);
  return <NotificationsPage notifications={notifications} />;
}
