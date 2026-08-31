import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { routes } from '@/config/routes';
import {
  formatAmount,
  formatDate,
  formatOwnerName,
  formatProvider,
} from '../format';
import type { AdminPayment } from '../types';
import { PaymentStatusBadge } from './payment-status-badge';

interface PaymentDetailsProps {
  payment: AdminPayment;
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

export function PaymentDetails({ payment }: PaymentDetailsProps) {
  const { subscription } = payment;
  const ownerName = formatOwnerName(subscription.owner);

  return (
    <div>
      <PageHeader
        title="تفاصيل الدفع"
        description={formatAmount(payment.amount, payment.currency)}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <PaymentStatusBadge status={payment.status} />
            <Link href={routes.payments.root}>
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
            <h2 className="text-base font-semibold text-ink-900">معلومات الدفع</h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="المبلغ" value={formatAmount(payment.amount, payment.currency)} />
            <InfoRow label="مزود الدفع" value={formatProvider(payment.provider)} />
            <InfoRow label="مرجع الدفع" value={payment.providerRef ?? '—'} />
            <InfoRow label="تاريخ الدفع" value={formatDate(payment.paidAt)} />
            <InfoRow label="تاريخ الإنشاء" value={formatDate(payment.createdAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">معلومات الاشتراك</h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="معرّف الاشتراك" value={subscription.id} />
            <InfoRow label="الخطة" value={subscription.plan.name} />
            <InfoRow
              label="العقار"
              value={subscription.property.title ?? '—'}
            />
            <InfoRow label="المالك" value={ownerName} />
            <InfoRow label="بريد المالك" value={subscription.owner.email} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">الخطة</h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="الاسم" value={subscription.plan.name} />
            <InfoRow label="المعرّف" value={subscription.plan.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">العقار والمالك</h2>
          </CardHeader>
          <CardContent>
            <InfoRow
              label="عنوان العقار"
              value={subscription.property.title ?? '—'}
            />
            <InfoRow label="معرّف العقار" value={subscription.property.id} />
            <InfoRow label="اسم المالك" value={ownerName} />
            <InfoRow label="بريد المالك" value={subscription.owner.email} />
            <InfoRow label="معرّف المالك" value={subscription.owner.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
