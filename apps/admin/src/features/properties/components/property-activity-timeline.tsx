import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { PropertyStatus } from '@/types';
import { formatDate } from '../format';
import type { AdminPropertyStatusHistoryEntry } from '../types';
import { PropertyStatusBadge } from './property-status-badge';

interface PropertyActivityTimelineProps {
  entries: AdminPropertyStatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  archivedAt?: string | null;
}

function actionLabel(toStatus: PropertyStatus, fromStatus: PropertyStatus | null): string {
  switch (toStatus) {
    case 'PUBLISHED':
      return fromStatus === 'PENDING_REVIEW' ? 'تم القبول والنشر' : 'تم النشر';
    case 'REJECTED':
      return 'تم الرفض';
    case 'ARCHIVED':
      return 'تمت الأرشفة';
    case 'DRAFT':
      return fromStatus === 'PUBLISHED' ? 'تم إلغاء النشر' : 'مسودة';
    case 'PENDING_REVIEW':
      return 'أُرسل للمراجعة';
    case 'PENDING_PAYMENT':
      return 'بانتظار الدفع';
    case 'EXPIRED':
      return 'انتهت الصلاحية';
    default:
      return 'تغيير الحالة';
  }
}

export function PropertyActivityTimeline({
  entries,
  createdAt,
  updatedAt,
  publishedAt,
  archivedAt,
}: PropertyActivityTimelineProps) {
  const milestones: Array<{
    id: string;
    title: string;
    actor: string;
    date: string;
    reason?: string | null;
    fromStatus?: PropertyStatus | null;
    toStatus?: PropertyStatus;
  }> = [
    {
      id: 'created',
      title: 'تم الإنشاء',
      actor: 'النظام / المالك',
      date: createdAt,
    },
  ];

  for (const entry of entries) {
    milestones.push({
      id: entry.id,
      title: actionLabel(entry.toStatus, entry.fromStatus),
      actor: entry.changedByName ?? 'تلقائي / غير منسوب',
      date: entry.createdAt,
      reason: entry.reason,
      fromStatus: entry.fromStatus,
      toStatus: entry.toStatus,
    });
  }

  if (publishedAt && !entries.some((entry) => entry.toStatus === 'PUBLISHED')) {
    milestones.push({
      id: 'published-meta',
      title: 'تم النشر',
      actor: '—',
      date: publishedAt,
    });
  }

  if (archivedAt && !entries.some((entry) => entry.toStatus === 'ARCHIVED')) {
    milestones.push({
      id: 'archived-meta',
      title: 'تمت الأرشفة',
      actor: '—',
      date: archivedAt,
    });
  }

  const latestHistoryAt = entries[0]?.createdAt ?? createdAt;
  if (updatedAt && updatedAt !== latestHistoryAt && updatedAt !== createdAt) {
    milestones.push({
      id: 'updated',
      title: 'آخر تحديث للبيانات',
      actor: '—',
      date: updatedAt,
    });
  }

  milestones.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-ink-900">سجل النشاط</h2>
        <p className="text-sm text-ink-500">
          التسلسل الزمني لإنشاء العقار وتغييرات الحالة
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {milestones.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-500">
            لا يوجد نشاط مسجّل لهذا العقار.
          </p>
        ) : (
          <ol className="relative space-y-0 border-s border-border ms-6 me-4">
            {milestones.map((item) => (
              <li key={item.id} className="relative pb-6 ps-6 last:pb-4">
                <span
                  className="absolute -start-[5px] top-1.5 size-2.5 rounded-full bg-accent-500 ring-4 ring-white"
                  aria-hidden
                />
                <div className="rounded-lg border border-border bg-surface-50/60 px-3 py-2.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold text-ink-900">
                        {item.title}
                      </p>
                      {item.fromStatus || item.toStatus ? (
                        <div className="flex flex-wrap items-center gap-2">
                          {item.fromStatus ? (
                            <>
                              <PropertyStatusBadge status={item.fromStatus} />
                              <span className="text-xs text-ink-400">→</span>
                            </>
                          ) : null}
                          {item.toStatus ? (
                            <PropertyStatusBadge status={item.toStatus} />
                          ) : null}
                        </div>
                      ) : null}
                      <p className="text-xs text-ink-600">بواسطة {item.actor}</p>
                      {item.reason ? (
                        <p className="text-sm text-ink-700">{item.reason}</p>
                      ) : null}
                    </div>
                    <time
                      dateTime={item.date}
                      className="shrink-0 text-xs text-ink-500"
                    >
                      {formatDate(item.date)}
                    </time>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
