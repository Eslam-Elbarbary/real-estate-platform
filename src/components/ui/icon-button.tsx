import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const variantClasses = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-surface-100 text-ink-900 hover:bg-surface-200',
  outline: 'border border-border bg-transparent text-ink-900 hover:bg-surface-50',
  ghost: 'bg-transparent text-ink-800 hover:bg-surface-100',
  danger: 'bg-danger-600 text-white hover:bg-danger-700',
} as const;

const sizeClasses = {
  small: 'size-9',
  medium: 'size-11',
  large: 'size-12',
} as const;

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  label: string;
  children: ReactNode;
}

export function IconButton({
  className,
  variant = 'ghost',
  size = 'medium',
  label,
  type = 'button',
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
