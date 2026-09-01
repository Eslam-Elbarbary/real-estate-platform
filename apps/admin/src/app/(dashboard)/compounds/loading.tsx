import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TableSkeleton } from '@/components/data';
import { PageHeader } from '@/components/layout/page-header';

export default function CompoundsLoading() {
  return (
    <div>
      <PageHeader
        title="المشاريع"
        description="إدارة الكمبوندات والوحدات المرتبطة بها."
      />

      <Card>
        <CardHeader>
          <div className="h-4 w-32 animate-pulse rounded bg-surface-100" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-surface-100" />
        </CardHeader>
        <CardContent className="p-0 pb-4">
          <TableSkeleton rows={8} columns={8} />
        </CardContent>
      </Card>
    </div>
  );
}
