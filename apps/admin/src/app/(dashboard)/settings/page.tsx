import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { getAdminSession } from '@/features/auth/service';
import { SettingsForm, getAdminPlatformSettings } from '@/features/settings';
import { createPageMetadata } from '@/lib/seo/metadata';
import { getUserFacingErrorMessage } from '@/lib/errors';

export const metadata = createPageMetadata({
  title: 'إعدادات الموقع',
  description: 'إدارة هوية المنصة وبيانات التواصل وإعدادات SEO.',
  path: '/settings',
});

export default async function SettingsPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'settings.view')) {
    return <PagePermissionDenied />;
  }

  let settings;
  try {
    settings = await getAdminPlatformSettings();
  } catch (error) {
    return (
      <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">
        {getUserFacingErrorMessage(error)}
      </div>
    );
  }

  return <SettingsForm initial={settings} permissions={permissions} />;
}
