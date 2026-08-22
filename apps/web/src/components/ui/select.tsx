import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  className,
  id,
  label,
  error,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor={selectId}>
      {label ? <span className="font-medium text-ink-800">{label}</span> : null}
      <select
        id={selectId}
        className={cn(
          'h-11 w-full rounded-md border border-border bg-white px-3 text-ink-900',
          'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
          'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
          error && 'border-danger-500 focus-visible:ring-danger-200',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-danger-600">{error}</span> : null}
    </label>
  );
}
