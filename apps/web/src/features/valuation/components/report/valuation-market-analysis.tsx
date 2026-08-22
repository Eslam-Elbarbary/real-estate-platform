import { cn } from '@/lib/utils/cn';
import { valuationCopy } from '../../config';
import { formatPercent } from '../../lib/format';
import type { ValuationMarketAnalysis } from '../../types';
import { PriceIndexChart } from './price-index-chart';

interface ValuationMarketAnalysisSectionProps {
  analysis: ValuationMarketAnalysis;
}

export function ValuationMarketAnalysisSection({
  analysis,
}: ValuationMarketAnalysisSectionProps) {
  const sampleTone =
    analysis.sampleSize >= 120
      ? 'high'
      : analysis.sampleSize >= 90
        ? 'medium'
        : 'low';

  return (
    <section className="mt-10" data-testid="market-analysis">
      <h2 className="text-xl font-extrabold text-ink-950">
        {valuationCopy.marketAnalysisTitle}
      </h2>
      <p className="mt-2 text-xs text-ink-400">
        {valuationCopy.marketDemoDisclaimer}
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)]">
        <div className="space-y-3">
          <MarketStatCard
            title={valuationCopy.sampleSizeTitle}
            subtitle={valuationCopy.sampleSizeSubtitle}
            value={String(analysis.sampleSize)}
            badge={
              sampleTone === 'high'
                ? valuationCopy.sampleHigh
                : sampleTone === 'medium'
                  ? valuationCopy.sampleMedium
                  : valuationCopy.sampleLow
            }
            badgeClassName={
              sampleTone === 'high'
                ? 'bg-success-50 text-success-700'
                : sampleTone === 'medium'
                  ? 'bg-accent-50 text-accent-600'
                  : 'bg-surface-100 text-ink-600'
            }
            testId="market-sample-card"
          />
          <MarketStatCard
            title={valuationCopy.demandTitle}
            subtitle={valuationCopy.demandSubtitle}
            value={formatPercent(analysis.demand.percentage, 0)}
            badge={analysis.demand.label}
            badgeClassName={
              analysis.demand.label === 'مرتفع'
                ? 'bg-success-50 text-success-700'
                : analysis.demand.label === 'منخفض'
                  ? 'bg-danger-50 text-danger-700'
                  : 'bg-accent-50 text-accent-600'
            }
            testId="market-demand-card"
          />
        </div>
        <PriceIndexChart analysis={analysis} />
      </div>
    </section>
  );
}

function MarketStatCard({
  title,
  subtitle,
  value,
  badge,
  badgeClassName,
  testId,
}: {
  title: string;
  subtitle: string;
  value: string;
  badge: string;
  badgeClassName: string;
  testId: string;
}) {
  return (
    <div
      className="rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5"
      data-testid={testId}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-ink-950">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-ink-500">{subtitle}</p>
        </div>
        <span
          className={cn(
            'rounded-md px-2 py-1 text-xs font-extrabold',
            badgeClassName,
          )}
        >
          {badge}
        </span>
      </div>
      <p className="mt-4 text-3xl font-extrabold text-ink-950">{value}</p>
    </div>
  );
}
