import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { listAdminFinishingTypes } from '@/features/catalogs';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'أنواع التشطيب',
  description: 'قيم التشطيب المعرفة على مستوى النظام.',
  path: '/catalogs/finishing-types',
});

export default async function FinishingTypesCatalogPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'catalogs.view')) {
    return <PagePermissionDenied />;
  }

  const items = await listAdminFinishingTypes();

  return (
    <div className="space-y-4">
      <PageHeader
        title="أنواع التشطيب"
        description="هذه القيم معرفة كـ enum في قاعدة البيانات حالياً (قراءة فقط). إدارة CRUD الكاملة تتطلب ترحيل مخطط لاحقاً."
      />

      {items.length === 0 ? (
        <EmptyState title="لا توجد قيم" description="لم يُرجع الخادم أنواع تشطيب." />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {items.map((item) => (
              <div
                key={item.code}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-ink-900">{item.nameAr}</p>
                  <p className="text-xs text-ink-500" dir="ltr">
                    {item.code} · {item.nameEn}
                  </p>
                </div>
                <Badge variant="default">نظام</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
