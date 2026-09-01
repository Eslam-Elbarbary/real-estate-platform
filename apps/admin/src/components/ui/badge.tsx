import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

const variantClasses = {
  default: 'bg-surface-100 text-ink-700 ring-1 ring-border',
  brand: 'bg-accent-50 text-accent-700 ring-1 ring-accent-500/20',
  success: 'bg-success-50 text-success-700 ring-1 ring-success-700/15',
  warning: 'bg-warning-50 text-warning-800 ring-1 ring-warning-800/15',
  danger: 'bg-danger-50 text-danger-700 ring-1 ring-danger-600/15',
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantClasses;
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
