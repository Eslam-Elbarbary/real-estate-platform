import { AdminSectionPlaceholder } from '@/components/layout/admin-section-placeholder';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المدفوعات',
  description: 'متابعة المدفوعات والفواتير.',
  path: '/payments',
});

export default function PaymentsPage() {
  return (
    <AdminSectionPlaceholder
      title="المدفوعات"
      description="متابعة المدفوعات والفواتير عبر مزود الدفع الحالي (تجريبي) مع جاهزية لبوابات مستقبلية."
    />
  );
}
