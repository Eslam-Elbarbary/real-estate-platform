import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'تسجيل الدخول',
  description: 'دخول لوحة تحكم الإدارة.',
  path: '/login',
});

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-sm font-medium text-brand-700">
            {siteConfig.productName}
          </p>
          <h1 className="text-xl font-bold text-ink-950">تسجيل الدخول</h1>
          <p className="text-sm text-ink-600">
            واجهة الدخول جاهزة للربط لاحقًا مع نظام المصادقة (JWT). لا يوجد تنفيذ
            خلفي في هذه المرحلة.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 rounded-md border border-dashed border-border bg-surface-50 p-4 text-sm text-ink-600">
            <p>البريد الإلكتروني وكلمة المرور — قريبًا</p>
            <p>التحقق من صلاحيات ADMIN / MODERATOR — قريبًا</p>
          </div>
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
