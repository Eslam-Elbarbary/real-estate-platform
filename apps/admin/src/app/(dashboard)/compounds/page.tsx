import { AdminSectionPlaceholder } from '@/components/layout/admin-section-placeholder';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المشاريع',
  description: 'إدارة الكمبوندات والمشاريع.',
  path: '/compounds',
});

export default function CompoundsPage() {
  return (
    <AdminSectionPlaceholder
      title="المشاريع"
      description="إدارة الكمبوندات والوحدات المرتبطة بها."
    />
  );
}
