import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { routes } from '@/config/routes';
import {
  formatDate,
  formatDuration,
  formatPrice,
  getListingLimit,
} from '../format';
import type { AdminPlan } from '../types';
import { PlanStatusBadge } from './plan-status-badge';

interface PlanDetailsProps {
  plan: AdminPlan;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-medium text-ink-900 sm:max-w-[70%] sm:text-end">
        {value}
      </span>
    </div>
  );
}

export function PlanDetails({ plan }: PlanDetailsProps) {
  const listingLimit = getListingLimit(plan.features);

  return (
    <div>
      <PageHeader
        title={plan.name}
        description={plan.code}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <PlanStatusBadge status={plan.status} />
            <Link href={routes.plans.root}>
              <Button variant="outline" size="small">
                العودة للقائمة
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">معلومات الخطة</h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="الرمز" value={plan.code} />
            <InfoRow label="الاسم" value={plan.name} />
            <InfoRow label="السعر" value={formatPrice(plan.price)} />
            <InfoRow label="المدة" value={formatDuration(plan.durationDays)} />
            <InfoRow
              label="حد الإعلانات"
              value={
                listingLimit != null ? listingLimit.toLocaleString('ar-EG') : '—'
              }
            />
            <InfoRow
              label="عدد الاشتراكات"
              value={plan.subscriptionCount.toLocaleString('ar-EG')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">التواريخ</h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="تاريخ الإنشاء" value={formatDate(plan.createdAt)} />
            <InfoRow label="آخر تحديث" value={formatDate(plan.updatedAt)} />
            <InfoRow
              label="الحالة"
              value={plan.status === 'ACTIVE' ? 'نشط' : 'غير نشط'}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
