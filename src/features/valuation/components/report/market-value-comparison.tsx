import { valuationCopy } from '../../config';
import { formatCompactMillions } from '../../lib/format';

interface MarketValueComparisonProps {
  purchasePrice: number;
  currentValue: number;
}

export function MarketValueComparison({
  purchasePrice,
  currentValue,
}: MarketValueComparisonProps) {
  const max = Math.max(purchasePrice, currentValue, 1);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ratio * max);

  return (
    <section className="mt-10" data-testid="market-comparison">
      <h2 className="text-xl font-extrabold text-ink-950">
        {valuationCopy.marketComparisonTitle}
      </h2>
      <div className="mt-4 rounded-xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <div className="flex gap-4">
          <div
            className="flex h-56 w-12 shrink-0 flex-col justify-between text-[10px] font-semibold text-ink-400"
            aria-hidden
          >
            {[...ticks].reverse().map((tick) => (
              <span key={tick}>{formatCompactMillions(tick)}</span>
            ))}
          </div>
          <div className="relative flex min-w-0 flex-1 items-end justify-center gap-10 sm:gap-16">
            <div
              className="pointer-events-none absolute inset-0 flex flex-col justify-between"
              aria-hidden
            >
              {ticks.map((tick) => (
                <div key={tick} className="border-t border-dashed border-[#ececec]" />
              ))}
            </div>
            <Bar
              label={valuationCopy.purchasePriceKpi}
              value={purchasePrice}
              max={max}
              className="bg-brand-200"
            />
            <Bar
              label={valuationCopy.currentValueKpi}
              value={currentValue}
              max={max}
              className="bg-brand-600"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Bar({
  label,
  value,
  max,
  className,
}: {
  label: string;
  value: number;
  max: number;
  className: string;
}) {
  const heightPct = Math.max(4, Math.round((value / max) * 100));
  return (
    <div className="relative z-[1] flex w-20 flex-col items-center sm:w-24">
      <div className="flex h-48 w-full items-end">
        <div
          className={`w-full rounded-t-md ${className}`}
          style={{ height: `${heightPct}%` }}
          title={`${label}: ${value}`}
          role="img"
          aria-label={`${label} ${formatCompactMillions(value)}`}
        />
      </div>
      <p className="mt-3 text-center text-xs font-bold text-ink-700">{label}</p>
    </div>
  );
}
