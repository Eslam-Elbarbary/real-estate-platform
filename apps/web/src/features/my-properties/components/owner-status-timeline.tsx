import { formatDate } from '@/lib/formatting/date';
import type {
  ApiPropertyStatus,
  OwnerPropertyStatusHistoryDto,
} from '@/types/api/my-property';
import { myPropertiesCopy } from '../config/copy';
import { timelineEventLabel } from '../lib/status-copy';

interface OwnerStatusTimelineProps {
  createdAt: string;
  entries: OwnerPropertyStatusHistoryDto[];
}

export function OwnerStatusTimeline({
  createdAt,
  entries,
}: OwnerStatusTimelineProps) {
  const milestones: Array<{
    id: string;
    title: string;
    date: string;
    reason?: string | null;
  }> = [
    {
      id: 'created',
      title: 'تم الإنشاء',
      date: createdAt,
    },
  ];

  for (const entry of entries) {
    milestones.push({
      id: entry.id,
      title: timelineEventLabel(
        entry.toStatus,
        entry.fromStatus as ApiPropertyStatus | null,
      ),
      date: entry.createdAt,
      reason: entry.reason,
    });
  }

  return (
    <section className="rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
      <h2 className="text-sm font-extrabold text-ink-900">
        {myPropertiesCopy.timelineTitle}
      </h2>
      <ol className="relative mt-4 space-y-0">
        {milestones.map((item, index) => {
          const isLast = index === milestones.length - 1;
          return (
            <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute start-[11px] top-6 bottom-0 w-0.5 bg-ink-200"
                  aria-hidden
                />
              ) : null}
              <span
                className="relative z-[1] mt-1 size-6 shrink-0 rounded-full border-2 border-brand-600 bg-white"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-ink-500">
                  {formatDate(item.date)}
                </p>
                {item.reason ? (
                  <p className="mt-2 rounded-md bg-danger-50 px-3 py-2 text-xs leading-6 text-danger-700">
                    {item.reason}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
