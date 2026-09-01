import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TableSkeleton } from '@/components/data';
import { PageHeader } from '@/components/layout/page-header';

export default function DevelopersLoading() {
  return (
    <div>
      <PageHeader
        title="المطورون"
        description="إدارة ملفات المطورين والتحقق من بياناتهم قبل الظهور في المنصة."
      />

      <Card>
        <CardHeader>
          <div className="h-4 w-32 animate-pulse rounded bg-surface-100" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-surface-100" />
        </CardHeader>
        <CardContent className="p-0 pb-4">
          <TableSkeleton rows={8} columns={7} />
        </CardContent>
      </Card>
    </div>
  );
}
