import { AdminSectionPlaceholder } from '@/components/layout/admin-section-placeholder';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الخطط',
  description: 'إدارة خطط الاشتراك Basic و Premium و Featured.',
  path: '/plans',
});

export default function PlansPage() {
  return (
    <AdminSectionPlaceholder
      title="الخطط"
      description="إدارة خطط الاشتراك وحدود الإعلانات والميزات المرتبطة بكل خطة."
    />
  );
}
