import {
  formatMarketIndexChange,
  formatMarketIndexValue,
  marketIndexChangeDirection,
} from '../format';
import type { MarketIndexEntry } from '../types';

interface MarketIndexChartProps {
  entry: MarketIndexEntry;
  compact?: boolean;
}

export function MarketIndexChart({ entry, compact = false }: MarketIndexChartProps) {
  const points = entry.chartPoints;
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const width = 640;
  const height = compact ? 210 : 260;
  const padLeft = 44;
  const padRight = 18;
  const padTop = 16;
  const padBottom = 28;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const mapped = points.map((point, index) => {
    const x =
      padLeft +
      (points.length === 1 ? innerW / 2 : (index / (points.length - 1)) * innerW);
    const y = padTop + innerH - ((point.value - min) / range) * innerH;
    return { ...point, x, y };
  });

  const polyline = mapped.map((p) => `${p.x},${p.y}`).join(' ');
  const last = mapped[mapped.length - 1];
  const yTicks = [max, Math.round((max + min) / 2), min];
  const xLabels = mapped.filter(
    (_, index) =>
      index === 0 ||
      index === mapped.length - 1 ||
      index === Math.floor(mapped.length / 2),
  );
  const direction = marketIndexChangeDirection(entry.percentageChange);
  const ariaLabel = `المؤشر العقاري لشهر ${entry.title.replace('مؤشر عقارات مصر — ', '')}، القيمة الحالية ${formatMarketIndexValue(entry.currentValue)}، ${
    direction === 'down'
      ? `بانخفاض ${formatMarketIndexChange(entry.percentageChange).replace('-', '')} بالمائة`
      : direction === 'up'
        ? `بارتفاع ${formatMarketIndexChange(entry.percentageChange).replace('+', '')} بالمائة`
        : 'بدون تغير يذكر'
  }`;

  return (
    <div className="min-w-0" data-testid="market-index-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full max-w-full overflow-visible"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{entry.title}</title>
        <desc>{ariaLabel}</desc>
        {yTicks.map((tick) => {
          const y = padTop + innerH - ((tick - min) / range) * innerH;
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y}
                y2={y}
                stroke="var(--color-surface-200)"
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 3}
                textAnchor="end"
                fill="var(--color-ink-400)"
                fontSize="11"
                fontFamily="inherit"
              >
                {formatMarketIndexValue(tick)}
              </text>
            </g>
          );
        })}
        <polyline
          fill="none"
          stroke="var(--color-brand-600)"
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={polyline}
        />
        {last ? (
          <circle
            cx={last.x}
            cy={last.y}
            r="5"
            fill="var(--color-brand-600)"
            stroke="white"
            strokeWidth="2"
          />
        ) : null}
        {xLabels.map((label) => (
          <text
            key={`${label.label}-${label.x}`}
            x={label.x}
            y={height - 6}
            textAnchor="middle"
            fill="var(--color-ink-400)"
            fontSize="11"
            fontFamily="inherit"
          >
            {label.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

interface MarketIndexValueProps {
  entry: MarketIndexEntry;
}

export function MarketIndexValue({ entry }: MarketIndexValueProps) {
  const direction = marketIndexChangeDirection(entry.percentageChange);
  const changeClass =
    direction === 'up'
      ? 'text-success-700'
      : direction === 'down'
        ? 'text-danger-700'
        : 'text-ink-500';
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→';

  return (
    <div className="shrink-0 text-start">
      <p className="text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
        {formatMarketIndexValue(entry.currentValue)}
      </p>
      <p className={`mt-1 text-sm font-bold ${changeClass}`}>
        <span aria-hidden>{arrow} </span>
        {formatMarketIndexChange(entry.percentageChange)}
      </p>
    </div>
  );
}
