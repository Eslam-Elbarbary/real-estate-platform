'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  id?: string;
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 20,
  label,
  id,
}: NumberStepperProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-ink-800">
        {label}
      </label>
      <div className="inline-flex items-center overflow-hidden rounded-lg border border-border">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center text-ink-700 hover:bg-surface-50 disabled:opacity-40"
          onClick={decrease}
          disabled={value <= min}
          aria-label={`إنقاص ${label}`}
        >
          <Minus size={16} aria-hidden />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isNaN(next)) return;
            onChange(Math.min(max, Math.max(min, next)));
          }}
          className={cn(
            'h-10 w-14 border-x border-border bg-white text-center text-sm font-semibold outline-none',
            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          )}
        />
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center text-ink-700 hover:bg-surface-50 disabled:opacity-40"
          onClick={increase}
          disabled={value >= max}
          aria-label={`زيادة ${label}`}
        >
          <Plus size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
