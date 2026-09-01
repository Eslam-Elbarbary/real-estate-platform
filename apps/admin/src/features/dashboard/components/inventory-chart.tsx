'use client';

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminDashboardInventoryItem } from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName, luxuryMutedColors } from './luxury-styles';

interface InventoryChartProps {
  inventory: AdminDashboardInventoryItem[];
}

const CHART_COLORS = [
  luxuryMutedColors.navy,
  luxuryMutedColors.gold,
  luxuryMutedColors.green,
  luxuryMutedColors.amber,
  luxuryMutedColors.gray,
  luxuryMutedColors.red,
];

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function formatPercent(value: number) {
  return `${value.toLocaleString('ar-EG', { maximumFractionDigits: 1 })}%`;
}

export function InventoryChart({ inventory }: InventoryChartProps) {
  const chartData = inventory.map((item, index) => ({
    name: item.nameAr ?? item.nameEn,
    value: item.count,
    percentage: item.percentage,
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  const total = inventory.reduce((sum, item) => sum + item.count, 0);
  const hasData = chartData.length > 0 && total > 0;

  return (
    <Card className={cn(luxuryCardClassName, 'h-full border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          تحليلات المخزون
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          توزيع العقارات
        </h2>
        <p className="text-sm text-ink-500">حسب نوع العقار</p>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6 pt-5">
        {hasData ? (
          <>
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
                    formatter={(value, _name, props) => {
                      const payload = props.payload as { percentage: number };
                      return [
                        `${formatCount(Number(value ?? 0))} (${formatPercent(payload.percentage)})`,
                        props.name,
                      ];
                    }}
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
                    {formatCount(total)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-border/70 bg-white px-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="size-2.5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: item.color }}
                      aria-hidden
                    />
                    <span className="text-sm font-medium text-ink-600">{item.name}</span>
                  </div>
                  <div className="text-end">
                    <span className="text-base font-bold tabular-nums text-ink-900">
                      {formatCount(item.value)}
                    </span>
                    <span className="ms-2 text-xs font-medium text-accent-700">
                      {formatPercent(item.percentage)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-border bg-surface-50 text-sm text-ink-500">
            لا توجد بيانات للعرض
          </div>
        )}
      </CardContent>
    </Card>
  );
}
