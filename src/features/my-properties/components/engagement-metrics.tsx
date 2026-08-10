import type { EngagementSummary } from '../types';
import { myPropertiesCopy } from '../config/copy';

interface EngagementMetricsProps {
  summary: EngagementSummary;
}

function formatMetric(value: number | null, suffix = ''): string {
  if (value == null) return '—';
  return `${value.toLocaleString('en-US')}${suffix}`;
}

export function EngagementMetrics({ summary }: EngagementMetricsProps) {
  const items = [
    {
      label: myPropertiesCopy.metrics.totalSearchAppearances,
      value: formatMetric(summary.totalSearchAppearances),
    },
    {
      label: myPropertiesCopy.metrics.totalViews,
      value: formatMetric(summary.totalViews),
    },
    {
      label: myPropertiesCopy.metrics.totalContacts,
      value: formatMetric(summary.totalContacts),
    },
    {
      label: myPropertiesCopy.metrics.averageViewRate,
      value: formatMetric(summary.averageViewRate, '%'),
    },
    {
      label: myPropertiesCopy.metrics.averageContactRate,
      value: formatMetric(summary.averageContactRate, '%'),
    },
    {
      label: myPropertiesCopy.metrics.averageContactCost,
      value: formatMetric(summary.averageContactCost),
    },
  ];

  return (
    <section className="rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-extrabold text-ink-950">
          {myPropertiesCopy.engagementTitle}
        </h2>
        <label className="inline-flex items-center gap-2 text-xs text-ink-600">
          <span>{myPropertiesCopy.resultsBy}</span>
          <select
            className="h-9 rounded-md border border-[#e5e5e5] bg-white px-2 text-sm text-ink-800"
            defaultValue="all"
            aria-label={myPropertiesCopy.resultsBy}
          >
            <option value="all">{myPropertiesCopy.allYourAds}</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-md bg-[#f5f5f5] px-4 py-6 text-center"
          >
            <p className="text-xs font-semibold text-ink-600">{item.label}</p>
            <p className="mt-3 text-[1.65rem] font-extrabold leading-none text-accent-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
