import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <p className="text-sm font-medium text-brand-700">
            {siteConfig.productName}
          </p>
          <h1 className="text-xl font-bold text-ink-950">الصفحة غير موجودة</h1>
          <p className="text-sm text-ink-600">
            الرابط الذي طلبته غير متاح أو تم نقله.
          </p>
        </CardHeader>
        <CardContent>
          <Link href={routes.home} className="block w-full">
            <Button type="button" className="w-full">
              العودة للوحة التحكم
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
