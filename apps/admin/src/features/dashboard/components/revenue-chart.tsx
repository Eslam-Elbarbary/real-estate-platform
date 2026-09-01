'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardRevenueAnalytics } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';

interface RevenueChartProps {
  revenue: AdminDashboardRevenueAnalytics;
}

function formatRevenue(value: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) {
    return monthKey;
  }

  return new Intl.DateTimeFormat('ar-EG', { month: 'long' }).format(
    new Date(year, month - 1, 1),
  );
}

export function RevenueChart({ revenue }: RevenueChartProps) {
  const chartData = revenue.monthly.map((item) => ({
    month: formatMonthLabel(item.month),
    revenue: item.revenue,
  }));

  const hasData = chartData.some((item) => item.revenue > 0);

  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-4 px-6 pt-6 pb-0">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
            تحليلات الإيرادات
          </p>
          <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
            اتجاه الإيرادات
          </h2>
        </div>
        <div className="rounded-xl border border-border/80 bg-surface-50/60 px-5 py-4">
          <p className="text-sm font-medium text-ink-500">إجمالي الإيرادات</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ink-900">
            {formatRevenue(revenue.totalRevenue)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {hasData ? (
          <div className="h-[280px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                    Number(value).toLocaleString('ar-EG', { notation: 'compact' })
                  }
                />
                <Tooltip
                  formatter={(value) => [formatRevenue(Number(value ?? 0)), 'الإيرادات']}
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
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={luxuryMutedColors.gold}
                  strokeWidth={2.5}
                  dot={{ fill: luxuryMutedColors.gold, strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: luxuryMutedColors.navy }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات للعرض
          </div>
        )}
      </CardContent>
    </Card>
  );
}
