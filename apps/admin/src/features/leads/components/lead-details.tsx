import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { routes } from '@/config/routes';
import { formatDate, formatLeadStatus, formatLeadType, formatUserName } from '../format';
import type { AdminLead } from '../types';
import type { UserRole } from '@/types';
import { LeadActions } from './lead-actions';
import { LeadStatusBadge } from './lead-status-badge';

interface LeadDetailsProps {
  lead: AdminLead;
  permissions: string[];
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

export function LeadDetails({ lead, permissions }: LeadDetailsProps) {
  const buyerName = formatUserName(lead.buyer);
  const sellerName = formatUserName(lead.seller);

  return (
    <div>
      <PageHeader
        title="تفاصيل الطلب"
        description={lead.property.title ?? lead.property.slug}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <LeadStatusBadge status={lead.status} />
            <Link href={routes.leads.root}>
              <Button variant="outline" size="small">
                العودة للقائمة
              </Button>
            </Link>
          </div>
        }
      />

      <LeadActions leadId={lead.id} status={lead.status} permissions={permissions} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">معلومات الطلب</h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="نوع الطلب" value={formatLeadType(lead.type)} />
            <InfoRow label="الحالة" value={formatLeadStatus(lead.status)} />
            <InfoRow label="الرسالة" value={lead.message ?? '—'} />
            <InfoRow label="تاريخ الإنشاء" value={formatDate(lead.createdAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">العميل</h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="الاسم" value={buyerName} />
            <InfoRow label="البريد" value={lead.buyer.email} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">البائع</h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="الاسم" value={sellerName} />
            <InfoRow label="البريد" value={lead.seller.email} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">العقار</h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="العنوان" value={lead.property.title ?? '—'} />
            <InfoRow label="الرابط" value={lead.property.slug} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
