import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import {
  AlertsPage,
  activityCopy,
  getAlertsService,
} from '@/features/activity';

export const metadata = createPageMetadata({
  title: activityCopy.alerts.title,
  description: activityCopy.alerts.seoDescription,
  path: routes.alerts,
  noIndex: true,
});

export default async function AlertsRoutePage() {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.alerts)}`,
    );
  }

  const service = getAlertsService();
  const [alerts, locations] = await Promise.all([
    service.list(session.user.id),
    service.listLocationOptions(),
  ]);

  return <AlertsPage alerts={alerts} locations={locations} />;
}
