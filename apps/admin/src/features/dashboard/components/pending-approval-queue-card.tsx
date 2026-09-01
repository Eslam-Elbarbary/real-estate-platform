import Link from 'next/link';
import { ArrowUpLeft, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface PendingApprovalQueueCardProps {
  pendingReview: number;
  canReview?: boolean;
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

export function PendingApprovalQueueCard({
  pendingReview,
  canReview = true,
}: PendingApprovalQueueCardProps) {
  const hasPending = pendingReview > 0;

  return (
    <Card className={cn(luxuryCardClassName, 'border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          الموافقات
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          قائمة انتظار الموافقة
        </h2>
        <p className="text-sm text-ink-500">العقارات التي تنتظر مراجعة فريق الإدارة</p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        <div
          className={cn(
            'flex flex-col gap-5 rounded-xl border px-5 py-5 sm:flex-row sm:items-center sm:justify-between',
            hasPending
              ? 'border-accent-500/25 bg-accent-50/40'
              : 'border-border bg-surface-50/60',
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex size-12 shrink-0 items-center justify-center rounded-xl ring-1',
                hasPending
                  ? 'bg-accent-500/15 text-accent-700 ring-accent-500/20'
                  : 'bg-white text-ink-500 ring-border',
              )}
            >
              <ClipboardCheck className="size-5" aria-hidden />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold tabular-nums leading-none text-ink-900">
                {formatCount(pendingReview)}
              </p>
              <p className="text-sm text-ink-600">
                {hasPending
                  ? 'عقار بانتظار المراجعة والاعتماد'
                  : 'لا توجد عقارات بانتظار المراجعة حالياً'}
              </p>
            </div>
          </div>

          {canReview && hasPending ? (
            <Link href={routes.properties.pending} className="shrink-0">
              <Button type="button" size="small" className="w-full gap-2 sm:w-auto">
                مراجعة الآن
                <ArrowUpLeft className="size-4" aria-hidden />
              </Button>
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
