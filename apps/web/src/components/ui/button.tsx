import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

const variantClasses = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary:
    'bg-surface-100 text-ink-900 hover:bg-surface-200 focus-visible:ring-brand-500',
  outline:
    'border border-border bg-transparent text-ink-900 hover:bg-surface-50 focus-visible:ring-brand-500',
  ghost: 'bg-transparent text-ink-800 hover:bg-surface-100 focus-visible:ring-brand-500',
  accent:
    'bg-accent-500 text-ink-950 hover:bg-accent-600 focus-visible:ring-accent-500',
  danger:
    'bg-danger-600 text-white hover:bg-danger-700 focus-visible:ring-danger-500',
} as const;

const sizeClasses = {
  small: 'h-8 px-3 text-xs',
  medium: 'h-10 px-4 text-sm',
  large: 'h-11 px-5 text-sm',
} as const;

export type ButtonVariant = keyof typeof variantClasses;
export type ButtonSize = keyof typeof sizeClasses;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function getButtonClassName({
  variant = 'primary',
  size = 'medium',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    'inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  className,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={getButtonClassName({ variant, size, className })}
      {...props}
    />
  );
}
