import type { DashboardStat } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  stat: DashboardStat;
}

export function StatCard({ stat }: StatCardProps) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <p className="text-sm font-medium text-ink-600">{stat.label}</p>
        <p className="text-3xl font-bold tracking-tight text-ink-950">
          {stat.value.toLocaleString('ar-EG')}
        </p>
        {stat.hint ? (
          <p className="text-xs text-ink-500">{stat.hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
