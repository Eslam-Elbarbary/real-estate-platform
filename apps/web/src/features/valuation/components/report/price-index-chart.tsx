import { valuationCopy } from '../../config';
import {
  formatCompactMillions,
  formatPercent,
} from '../../lib/format';
import type { ValuationMarketAnalysis } from '../../types';

interface PriceIndexChartProps {
  analysis: ValuationMarketAnalysis;
}

export function PriceIndexChart({ analysis }: PriceIndexChartProps) {
  const values = analysis.priceHistory.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const width = 560;
  const height = 220;
  const padX = 8;
  const padY = 16;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = analysis.priceHistory.map((point, index) => {
    const x =
      padX +
      (analysis.priceHistory.length === 1
        ? innerW / 2
        : (index / (analysis.priceHistory.length - 1)) * innerW);
    const y = padY + innerH - ((point.value - min) / range) * innerH;
    return { x, y, label: point.month, value: point.value };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');
  const yTicks = [max, (max + min) / 2, min];

  return (
    <div
      className="rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5"
      data-testid="price-index-chart"
    >
      <h3 className="text-base font-extrabold text-ink-950">
        {valuationCopy.priceIndexTitle}
      </h3>
      <p className="mt-1 text-xs leading-6 text-ink-500">
        {valuationCopy.priceIndexSubtitle}
      </p>

      <div className="mt-4 flex gap-2">
        <div
          className="flex h-[220px] w-12 shrink-0 flex-col justify-between text-[10px] font-semibold text-ink-400"
          aria-hidden
        >
          {yTicks.map((tick) => (
            <span key={tick}>{formatCompactMillions(tick)}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1 overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[220px] w-full min-w-[280px]"
            role="img"
            aria-label={valuationCopy.priceIndexTitle}
          >
            {yTicks.map((tick) => {
              const y = padY + innerH - ((tick - min) / range) * innerH;
              return (
                <line
                  key={tick}
                  x1={padX}
                  x2={width - padX}
                  y1={y}
                  y2={y}
                  stroke="#ececec"
                  strokeDasharray="4 4"
                />
              );
            })}
            <polyline
              fill="none"
              stroke="var(--color-brand-600, #1565c0)"
              strokeWidth="2.5"
              points={polyline}
            />
            {points.map((point) => (
              <circle
                key={`${point.label}-${point.x}`}
                cx={point.x}
                cy={point.y}
                r="3.5"
                fill="var(--color-brand-600, #1565c0)"
              />
            ))}
          </svg>
          <div className="mt-1 flex justify-between gap-1 text-[10px] font-semibold text-ink-400">
            {analysis.priceHistory.map((point) => (
              <span key={point.month} className="min-w-0 truncate text-center">
                {point.month.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#f0f0f0] pt-3 text-sm">
        <span className="font-semibold text-ink-600">
          {valuationCopy.annualPriceChange}
        </span>
        <span
          className="rounded-md bg-danger-50 px-2 py-0.5 text-xs font-extrabold text-danger-700"
          aria-label={`${valuationCopy.annualPriceChange} ${formatPercent(analysis.annualChangePercent)}`}
        >
          {formatPercent(analysis.annualChangePercent)}
        </span>
      </div>
    </div>
  );
}
