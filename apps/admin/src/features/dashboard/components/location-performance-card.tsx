import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

/** Ready for future API integration when location analytics are available on the dashboard. */
export interface LocationPerformanceItem {
  location: string;
  count: number;
  percentage: number;
}

interface LocationPerformanceCardProps {
  items?: LocationPerformanceItem[];
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function formatPercent(value: number): string {
  return `${value.toLocaleString('ar-EG', { maximumFractionDigits: 1 })}%`;
}

export function LocationPerformanceCard({ items = [] }: LocationPerformanceCardProps) {
  const hasItems = items.length > 0;

  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          التوزيع الجغرافي
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          أداء المواقع
        </h2>
        <p className="text-sm text-ink-500">تركيز العقارات حسب المناطق والمدن</p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-50/80 px-6 py-12 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-white ring-1 ring-border">
              <MapPin className="size-5 text-ink-400" aria-hidden />
            </div>
            <p className="text-sm font-medium text-ink-700">
              تحليلات المواقع قيد التجهيز
            </p>
            <p className="mt-1 max-w-sm text-xs leading-relaxed text-ink-500">
              سيتم عرض أبرز المناطق ونسب التوزيع عند توفر بيانات الموقع في لوحة التحكم.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.location}
                className="rounded-xl border border-border/80 bg-surface-50/50 px-4 py-3"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="font-medium text-ink-900">{item.location}</p>
                  <p className="text-sm tabular-nums text-ink-600">
                    {formatCount(item.count)} · {formatPercent(item.percentage)}
                  </p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
