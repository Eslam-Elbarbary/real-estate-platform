'use client';

import { cn } from '@/lib/utils/cn';

interface RangeHistogramProps {
  bars: readonly number[];
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (next: { min: number; max: number }) => void;
  formatLabel: (value: number) => string;
  ariaLabelMin: string;
  ariaLabelMax: string;
  className?: string;
}

export function RangeHistogram({
  bars,
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  formatLabel,
  ariaLabelMin,
  ariaLabelMax,
  className,
}: RangeHistogramProps) {
  const peak = Math.max(...bars, 1);
  const span = Math.max(max - min, 1);
  const step = Math.max(1, Math.floor(span / 200));

  function clamp(value: number) {
    return Math.min(max, Math.max(min, value));
  }

  function handleMinChange(raw: number) {
    const nextMin = clamp(raw);
    onChange({
      min: Math.min(nextMin, valueMax),
      max: valueMax,
    });
  }

  function handleMaxChange(raw: number) {
    const nextMax = clamp(raw);
    onChange({
      min: valueMin,
      max: Math.max(nextMax, valueMin),
    });
  }

  const minPercent = ((valueMin - min) / span) * 100;
  const maxPercent = ((valueMax - min) / span) * 100;

  return (
    <div className={cn('space-y-3', className)}>
      <div
        className="flex h-16 items-end gap-px px-0.5"
        aria-hidden
      >
        {bars.map((height, index) => {
          const ratio = height / peak;
          const barPosition = (index / Math.max(bars.length - 1, 1)) * 100;
          const inRange = barPosition >= minPercent && barPosition <= maxPercent;

          return (
            <div
              key={index}
              className={cn(
                'min-w-0 flex-1 rounded-t-[1px] transition-colors',
                inRange ? 'bg-brand-200' : 'bg-surface-200',
              )}
              style={{ height: `${Math.max(ratio * 100, 8)}%` }}
            />
          );
        })}
      </div>

      <div className="relative h-6">
        <div className="absolute start-0 end-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-surface-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-500"
          style={{
            left: `${Math.min(minPercent, maxPercent)}%`,
            width: `${Math.abs(maxPercent - minPercent)}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          aria-label={ariaLabelMin}
          onChange={(event) => handleMinChange(Number(event.target.value))}
          className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-6 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-600"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          aria-label={ariaLabelMax}
          onChange={(event) => handleMaxChange(Number(event.target.value))}
          className="pointer-events-none absolute inset-x-0 top-1/2 z-30 h-6 w-full -translate-y-1/2 appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand-600"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-ink-500">
        <span>{formatLabel(valueMin)}</span>
        <span>{formatLabel(valueMax)}</span>
      </div>
    </div>
  );
}
