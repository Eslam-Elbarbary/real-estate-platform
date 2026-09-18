import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import {
  AlertsPage,
  activityCopy,
  getAlertsService,
} from '@/features/activity';
import { fetchPropertyTypes } from '@/features/properties/api/catalogs';
import { toCatalogPropertyTypeOptions } from '@/features/properties/lib/property-type-options';

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
  const [alerts, locations, propertyTypes] = await Promise.all([
    service.list(session.user.id),
    service.listLocationOptions(),
    fetchPropertyTypes().catch(() => []),
  ]);

  return (
    <AlertsPage
      alerts={alerts}
      locations={locations}
      propertyTypeOptions={toCatalogPropertyTypeOptions(propertyTypes)}
    />
  );
}
