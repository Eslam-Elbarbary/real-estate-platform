import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { AdminSectionMeta } from '@/types';

interface AdminSectionPlaceholderProps extends AdminSectionMeta {
  badge?: string;
}

export function AdminSectionPlaceholder({
  title,
  description,
  badge = 'قريبًا',
}: AdminSectionPlaceholderProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="flex flex-col items-start gap-3 py-10">
          <Badge variant="brand">{badge}</Badge>
          <p className="max-w-xl text-sm leading-relaxed text-ink-600">
            هذه الصفحة جزء من أساس لوحة التحكم. سيتم ربطها لاحقًا بواجهات البرمجة
            والمستودعات دون تغيير هيكل الواجهة.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
