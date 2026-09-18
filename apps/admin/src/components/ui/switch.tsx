'use client';

import { cn } from '@/lib/utils/cn';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  id?: string;
  name?: string;
}

/** Accessible boolean switch matching admin design tokens. */
export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  description,
  id,
  name,
}: SwitchProps) {
  const switchId = id ?? name;

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-white px-3 py-2.5">
      {label || description ? (
        <div className="min-w-0 flex-1">
          {label ? (
            <label
              htmlFor={switchId}
              className="text-sm font-medium text-ink-800"
            >
              {label}
            </label>
          ) : null}
          {description ? (
            <p className="mt-0.5 text-xs text-ink-500">{description}</p>
          ) : null}
        </div>
      ) : null}

      <button
        id={switchId}
        type="button"
        role="switch"
        name={name}
        aria-checked={checked}
        disabled={disabled}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
          checked
            ? 'border-brand-600 bg-brand-600'
            : 'border-border bg-surface-100',
          disabled && 'cursor-not-allowed opacity-60',
        )}
        onClick={() => {
          if (!disabled) {
            onCheckedChange(!checked);
          }
        }}
      >
        <span
          className={cn(
            'pointer-events-none absolute top-0.5 size-5 rounded-full bg-white shadow transition-[inset-inline-start]',
            checked ? 'start-[1.35rem]' : 'start-0.5',
          )}
          aria-hidden
        />
      </button>
    </div>
  );
}
