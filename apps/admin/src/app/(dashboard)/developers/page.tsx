import { AdminSectionPlaceholder } from '@/components/layout/admin-section-placeholder';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المطورون',
  description: 'إدارة ملفات المطورين.',
  path: '/developers',
});

export default function DevelopersPage() {
  return (
    <AdminSectionPlaceholder
      title="المطورون"
      description="إدارة ملفات المطورين والتحقق من بياناتهم قبل الظهور في المنصة."
    />
  );
}
