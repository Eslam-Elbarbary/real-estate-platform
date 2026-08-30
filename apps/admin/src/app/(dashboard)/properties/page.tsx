import { AdminSectionPlaceholder } from '@/components/layout/admin-section-placeholder';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'العقارات',
  description: 'إدارة العقارات ومراجعات النشر.',
  path: '/properties',
});

export default function PropertiesPage() {
  return (
    <AdminSectionPlaceholder
      title="العقارات"
      description="مراجعة واعتماد الإعلانات وفق مسار المسودة → الاشتراك → الدفع → المراجعة → النشر."
    />
  );
}
