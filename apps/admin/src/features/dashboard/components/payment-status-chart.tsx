'use client';

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardPaymentsStats } from '@/types';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';
import { cn } from '@/lib/utils/cn';

interface PaymentStatusChartProps {
  payments: AdminDashboardPaymentsStats;
}

const SLICES = [
  { key: 'successful' as const, label: 'ناجحة', color: luxuryMutedColors.green },
  { key: 'pending' as const, label: 'معلقة', color: luxuryMutedColors.gold },
  { key: 'failed' as const, label: 'فاشلة', color: luxuryMutedColors.red },
];

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function formatRevenue(value: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function PaymentStatusChart({ payments }: PaymentStatusChartProps) {
  const chartData = SLICES.map((slice) => ({
    name: slice.label,
    value: payments[slice.key],
    color: slice.color,
  })).filter((item) => item.value > 0);

  const hasData = chartData.length > 0;

  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-4 px-6 pt-6 pb-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
              تحليلات المدفوعات
            </p>
            <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
              حالة المدفوعات
            </h2>
          </div>
        </div>
        <div className="rounded-xl border border-accent-500/20 bg-accent-500/5 px-5 py-4">
          <p className="text-sm font-medium text-accent-700">إجمالي الإيرادات</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            {formatRevenue(payments.totalRevenue)}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            {formatCount(payments.total)} عملية · {formatCount(payments.successful)} ناجحة
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-5">
        {hasData ? (
          <div className="relative mx-auto h-[260px] w-full max-w-[300px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={74}
                  outerRadius={104}
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
                <p className="text-xs font-medium text-ink-400">العمليات</p>
                <p className="mt-1 text-3xl font-bold text-ink-900">
                  {formatCount(payments.total)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات للعرض
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {SLICES.map((slice) => (
            <div
              key={slice.key}
              className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-white px-4 py-4"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="size-2.5 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: slice.color }}
                  aria-hidden
                />
                <span className="text-sm font-medium text-ink-600">{slice.label}</span>
              </div>
              <span className="text-xl font-bold tabular-nums text-ink-900">
                {formatCount(payments[slice.key])}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
