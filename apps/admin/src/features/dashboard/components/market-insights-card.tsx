import { Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type {
  AdminDashboardLeadsStats,
  AdminDashboardPropertiesStats,
} from '@/types';
import { cn } from '@/lib/utils/cn';
import { luxuryCardClassName } from './luxury-styles';

interface MarketInsightsCardProps {
  properties: AdminDashboardPropertiesStats;
  leads: AdminDashboardLeadsStats;
}

function formatCount(value: number) {
  return value.toLocaleString('ar-EG');
}

function formatPercent(value: number, total: number): string | null {
  if (total <= 0) {
    return null;
  }

  return `${((value / total) * 100).toLocaleString('ar-EG', { maximumFractionDigits: 1 })}%`;
}

const STATUS_LABELS: Record<
  keyof Omit<AdminDashboardPropertiesStats, 'total'>,
  string
> = {
  published: 'منشور',
  pendingReview: 'بانتظار المراجعة',
  rejected: 'مرفوض',
  draft: 'مسودة',
  archived: 'مؤرشف',
  expired: 'منتهي',
  recent: 'حديث',
};

function getDominantPropertyStatus(
  properties: AdminDashboardPropertiesStats,
): { label: string; count: number } | null {
  const entries = (
    Object.entries(STATUS_LABELS) as Array<
      [keyof Omit<AdminDashboardPropertiesStats, 'total'>, string]
    >
  )
    .map(([key, label]) => ({
      label,
      count: properties[key],
    }))
    .sort((a, b) => b.count - a.count);

  const top = entries[0];
  if (!top || top.count <= 0) {
    return null;
  }

  return top;
}

export function MarketInsightsCard({ properties, leads }: MarketInsightsCardProps) {
  const dominantStatus = getDominantPropertyStatus(properties);
  const leadCloseRate = formatPercent(leads.closed, leads.total);

  const insights: Array<{ id: string; text: string }> = [];

  if (dominantStatus) {
    insights.push({
      id: 'dominant-status',
      text: `أكثر حالة انتشاراً: ${dominantStatus.label} (${formatCount(dominantStatus.count)} عقار)`,
    });
  }

  if (properties.pendingReview > 0) {
    insights.push({
      id: 'pending-review',
      text: `${formatCount(properties.pendingReview)} عقار تحت المراجعة حالياً`,
    });
  }

  if (leadCloseRate) {
    insights.push({
      id: 'lead-close-rate',
      text: `معدل إغلاق العملاء المحتملين: ${leadCloseRate} (${formatCount(leads.closed)} من ${formatCount(leads.total)})`,
    });
  }

  if (properties.published > 0 && properties.total > 0) {
    const publishRate = formatPercent(properties.published, properties.total);
    if (publishRate) {
      insights.push({
        id: 'publish-rate',
        text: `نسبة العقارات المنشورة: ${publishRate}`,
      });
    }
  }

  return (
    <Card className={cn(luxuryCardClassName, 'border-0 shadow-none')}>
      <CardHeader className="space-y-1.5 px-6 pt-6 pb-0">
        <p className="text-xs font-semibold tracking-[0.14em] text-ink-400 uppercase">
          ذكاء الأعمال
        </p>
        <h2 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
          رؤى السوق
        </h2>
        <p className="text-sm text-ink-500">ملخص مستمد من بيانات المنصة الحالية</p>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-6 pt-5">
        {insights.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface-50/80 px-6 py-10 text-center text-sm text-ink-500">
            لا تتوفر رؤى كافية من البيانات الحالية
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className="flex items-start gap-3 rounded-xl border border-border/80 bg-surface-50/50 px-4 py-3.5"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-500/10 text-accent-700">
                {insight.id.includes('lead') ? (
                  <TrendingUp className="size-4" aria-hidden />
                ) : (
                  <Lightbulb className="size-4" aria-hidden />
                )}
              </div>
              <p className="pt-1.5 text-sm leading-relaxed text-ink-700">{insight.text}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
