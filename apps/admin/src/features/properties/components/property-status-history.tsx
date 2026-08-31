import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDate } from '../format';
import type { AdminPropertyStatusHistoryEntry } from '../types';
import { PropertyStatusBadge } from './property-status-badge';

interface PropertyStatusHistoryProps {
  entries: AdminPropertyStatusHistoryEntry[];
}

export function PropertyStatusHistory({ entries }: PropertyStatusHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-ink-900">سجل الحالة</h2>
        <p className="text-sm text-ink-500">تتبع تغييرات حالة العقار</p>
      </CardHeader>
      <CardContent className="space-y-0 divide-y divide-border p-0">
        {entries.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-500">
            لا يوجد سجل حالات لهذا العقار.
          </p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="px-4 py-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {entry.fromStatus ? (
                      <>
                        <PropertyStatusBadge status={entry.fromStatus} />
                        <span className="text-xs text-ink-400">إلى</span>
                      </>
                    ) : null}
                    <PropertyStatusBadge status={entry.toStatus} />
                  </div>
                  <p className="text-sm text-ink-600">
                    {entry.changedByName
                      ? `بواسطة ${entry.changedByName}`
                      : 'تغيير تلقائي أو غير منسوب'}
                  </p>
                  {entry.reason ? (
                    <p className="text-sm text-ink-700">{entry.reason}</p>
                  ) : null}
                </div>
                <time
                  dateTime={entry.createdAt}
                  className="shrink-0 text-xs text-ink-500"
                >
                  {formatDate(entry.createdAt)}
                </time>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
