import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'غير مصرح',
  description: 'لا تملك صلاحية الوصول إلى هذه الصفحة.',
  path: '/forbidden',
});

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-sm font-medium text-brand-700">
            {siteConfig.productName}
          </p>
          <h1 className="text-xl font-bold text-ink-950">
            ليس لديك صلاحية للوصول
          </h1>
          <p className="text-sm text-ink-600">
            حسابك مسجّل الدخول، لكنه لا يملك أحد الأدوار المطلوبة للوصول إلى
            لوحة التحكم (Super Admin، Admin، أو Moderator). تواصل مع مسؤول
            المنصة إذا كنت تعتقد أن هذا خطأ.
          </p>
        </CardHeader>
        <CardContent>
          <Link
            href={routes.home}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-brand-600 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            العودة إلى لوحة التحكم
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
