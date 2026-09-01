'use client';

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardPropertiesStats } from '@/types';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';
import { cn } from '@/lib/utils/cn';

interface PropertyStatusChartProps {
  properties: AdminDashboardPropertiesStats;
}

const SLICES = [
  { key: 'published' as const, label: 'منشور', color: luxuryMutedColors.green },
  { key: 'pendingReview' as const, label: 'بانتظار المراجعة', color: luxuryMutedColors.gold },
  { key: 'rejected' as const, label: 'مرفوض', color: luxuryMutedColors.red },
  { key: 'draft' as const, label: 'مسودة', color: luxuryMutedColors.gray },
  { key: 'archived' as const, label: 'مؤرشف', color: luxuryMutedColors.grayLight },
];

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

export function PropertyStatusChart({ properties }: PropertyStatusChartProps) {
  const chartData = SLICES.map((slice) => ({
    name: slice.label,
    value: properties[slice.key],
    color: slice.color,
  })).filter((item) => item.value > 0);

  const hasData = chartData.length > 0;

  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-4 px-6 pt-6 pb-0">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
            تحليلات العقارات
          </p>
          <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
            حالة العقارات
          </h2>
        </div>
        <div className="rounded-xl border border-border/80 bg-surface-50/60 px-5 py-4">
          <p className="text-sm font-medium text-ink-500">إجمالي العقارات</p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-ink-900">
            {formatCount(properties.total)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-5">
        {hasData ? (
          <div className="relative mx-auto h-[260px] w-full max-w-[340px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={78}
                  outerRadius={108}
                  paddingAngle={4}
                  stroke="#FFFFFF"
                  strokeWidth={3}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCount(Number(value ?? 0))}
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 8px 24px rgb(15 23 42 / 0.08)',
                    direction: 'rtl',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    padding: '10px 14px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs font-medium text-ink-400">الإجمالي</p>
                <p className="mt-1 text-3xl font-bold text-ink-900">
                  {formatCount(properties.total)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات للعرض
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {SLICES.map((slice) => (
            <div
              key={slice.key}
              className="flex items-center justify-between rounded-2xl border border-border/70 bg-white px-4 py-3.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-2.5 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden
                />
                <span className="text-sm font-medium text-ink-600">{slice.label}</span>
              </div>
              <span className="text-base font-bold tabular-nums text-ink-900">
                {formatCount(properties[slice.key])}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
