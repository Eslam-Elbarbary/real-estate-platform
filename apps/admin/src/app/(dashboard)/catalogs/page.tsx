import Link from 'next/link';
import {
  PagePermissionDenied,
  hasPagePermission,
} from '@/components/layout/page-permission-gate';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { getAdminSession } from '@/features/auth/service';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'الكتالوجات',
  description: 'إدارة أنواع العقارات والمعاملات والمميزات.',
  path: '/catalogs',
});

const SECTIONS = [
  {
    href: routes.catalogs.propertyTypes,
    title: 'أنواع العقارات',
    description: 'شقق، فلل، مكاتب، أراضي…',
  },
  {
    href: routes.catalogs.transactionTypes,
    title: 'أنواع المعاملات',
    description: 'بيع وإيجار وغيرها',
  },
  {
    href: routes.catalogs.features,
    title: 'المميزات والمرافق',
    description: 'مسبح، جيم، مصعد…',
  },
  {
    href: routes.catalogs.views,
    title: 'الإطلالات',
    description: 'شارع رئيسي، نيل، بحر، حديقة…',
  },
  {
    href: routes.catalogs.legalStatuses,
    title: 'الحالات القانونية',
    description: 'مسجل بالشهر العقاري، عقد ابتدائي، توكيل…',
  },
  {
    href: routes.catalogs.finishingTypes,
    title: 'أنواع التشطيب',
    description: 'قيم النظام (للقراءة فقط حالياً)',
  },
  {
    href: routes.catalogs.locations,
    title: 'المواقع',
    description: 'الدول والمدن والمناطق والأحياء',
  },
] as const;

export default async function CatalogsHubPage() {
  const session = await getAdminSession();
  const permissions = session?.user.permissions ?? [];

  if (!hasPagePermission(permissions, 'catalogs.view')) {
    return <PagePermissionDenied />;
  }

  return (
    <div>
      <PageHeader
        title="كتالوجات العقارات"
        description="إدارة الإعدادات الديناميكية المستخدمة في نماذج الإنشاء والنشر."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="space-y-1 p-5">
                <h2 className="text-base font-semibold text-ink-900">
                  {section.title}
                </h2>
                <p className="text-sm text-ink-500">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
