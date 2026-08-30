import { AdminSectionPlaceholder } from '@/components/layout/admin-section-placeholder';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المستخدمون',
  description: 'إدارة حسابات المستخدمين والأدوار.',
  path: '/users',
});

export default function UsersPage() {
  return (
    <AdminSectionPlaceholder
      title="المستخدمون"
      description="عرض وإدارة المستخدمين والأدوار (USER، BROKER، DEVELOPER، ADMIN، MODERATOR)."
    />
  );
}
