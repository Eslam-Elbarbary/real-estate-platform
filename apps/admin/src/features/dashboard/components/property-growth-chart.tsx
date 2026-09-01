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
import type { AdminDashboardPropertyGrowth } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';

interface PropertyGrowthChartProps {
  propertyGrowth: AdminDashboardPropertyGrowth;
}

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) {
    return monthKey;
  }

  return new Intl.DateTimeFormat('ar-EG', { month: 'short' }).format(
    new Date(year, month - 1, 1),
  );
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

export function PropertyGrowthChart({ propertyGrowth }: PropertyGrowthChartProps) {
  const chartData = propertyGrowth.monthly.map((item) => ({
    month: formatMonthLabel(item.month),
    count: item.count,
  }));

  const hasData = chartData.some((item) => item.count > 0);

  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          نمو المحفظة
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          نمو العقارات
        </h2>
        <p className="text-sm text-ink-500">العقارات المضافة شهرياً</p>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-5">
        {hasData ? (
          <div className="h-[240px] w-full" dir="ltr">
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
                  allowDecimals={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [formatCount(Number(value ?? 0)), 'عقارات جديدة']}
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
                  dataKey="count"
                  stroke={luxuryMutedColors.navy}
                  strokeWidth={2.5}
                  dot={{ fill: luxuryMutedColors.navy, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: luxuryMutedColors.gold }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[240px] items-center justify-center rounded-2xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات نمو كافية
          </div>
        )}
      </CardContent>
    </Card>
  );
}
