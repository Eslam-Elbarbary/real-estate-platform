import { Eye, Heart, Lock, Search } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import type { Property } from '@/types';

interface StatisticsSectionProps {
  property: Property;
}

export function StatisticsSection({ property }: StatisticsSectionProps) {
  const stats = [
    {
      key: 'search',
      label: uiLabels.statSearchAppearances,
      value: property.searchAppearances,
      icon: Search,
      locked: true,
    },
    {
      key: 'views',
      label: uiLabels.statViews,
      value: property.views,
      icon: Eye,
      locked: false,
    },
    {
      key: 'favorites',
      label: uiLabels.statFavorites,
      value: property.favoritesCount,
      icon: Heart,
      locked: false,
    },
  ] as const;

  return (
    <section id="statistics" className="scroll-mt-28 pt-10">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.statisticsSectionTitle}
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className="flex min-h-[112px] flex-col justify-between rounded-xl border border-border bg-white px-4 py-4"
            >
              <div className="flex items-center gap-2 text-ink-600">
                <Icon className="size-4 shrink-0" aria-hidden />
                <p className="text-sm">{stat.label}</p>
              </div>
              {stat.locked || stat.value === undefined ? (
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink-500">
                  <Lock className="size-4" aria-hidden />
                  {uiLabels.proLockedHint}
                </div>
              ) : (
                <p className="mt-3 text-2xl font-extrabold text-ink-900">
                  {stat.value.toLocaleString('ar-EG')}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
