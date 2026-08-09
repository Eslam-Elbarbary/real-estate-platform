import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ className, id, label, error, hint, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor={inputId}>
      {label ? <span className="font-medium text-ink-800">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-md border border-border bg-white px-3 text-ink-900',
          'placeholder:text-ink-400',
          'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
          'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
          error && 'border-danger-500 focus-visible:ring-danger-200',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />
      {error ? (
        <span id={`${inputId}-error`} className="text-danger-600">
          {error}
        </span>
      ) : null}
      {!error && hint ? (
        <span id={`${inputId}-hint`} className="text-ink-500">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
