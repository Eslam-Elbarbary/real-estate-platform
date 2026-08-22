import { formatCurrency } from '@/lib/formatting/currency';
import { cn } from '@/lib/utils/cn';
import { valuationCopy } from '../../config';
import {
  calculateRoiPercent,
  formatPercent,
} from '../../lib/format';
import type { ValuationResult } from '../../types';

interface InvestmentReturnSectionProps {
  result: ValuationResult;
}

export function InvestmentReturnSection({ result }: InvestmentReturnSectionProps) {
  const purchasePrice = result.request.purchasePrice;
  if (purchasePrice == null) return null;

  const currentValue = result.estimatedPrice;
  const roi = calculateRoiPercent(currentValue, purchasePrice);
  const isNegative = roi != null && roi < 0;
  const isPositive = roi != null && roi > 0;
  const arrow = isNegative ? '↓' : isPositive ? '↑' : '→';
  const roiLabel =
    roi == null
      ? '—'
      : `${arrow} ${formatPercent(roi)}`;

  return (
    <section className="mt-10" data-testid="investment-return">
      <h2 className="text-xl font-extrabold text-ink-950">
        {valuationCopy.investmentReturnTitle}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <KpiCard
          label={valuationCopy.purchasePriceKpi}
          value={formatCurrency(purchasePrice)}
        />
        <KpiCard
          label={valuationCopy.currentValueKpi}
          value={formatCurrency(currentValue)}
        />
        <KpiCard
          label={valuationCopy.roiKpi}
          value={roiLabel}
          valueClassName={cn(
            isNegative && 'text-danger-700',
            isPositive && 'text-success-700',
          )}
          badgeClassName={cn(
            isNegative && 'bg-danger-50',
            isPositive && 'bg-success-50',
          )}
          ariaLabel={
            roi == null
              ? valuationCopy.roiKpi
              : `${valuationCopy.roiKpi}: ${formatPercent(roi)} ${
                  isNegative ? 'انخفاض' : isPositive ? 'ارتفاع' : 'ثابت'
                }`
          }
        />
      </div>
    </section>
  );
}

function KpiCard({
  label,
  value,
  valueClassName,
  badgeClassName,
  ariaLabel,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  badgeClassName?: string;
  ariaLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-5 shadow-sm">
      <p className="text-sm font-semibold text-ink-600">{label}</p>
      <p
        className={cn(
          'mt-3 inline-flex rounded-lg px-2 py-1 text-xl font-extrabold text-ink-950 sm:text-2xl',
          badgeClassName,
          valueClassName,
        )}
        aria-label={ariaLabel}
      >
        {value}
      </p>
    </div>
  );
}
