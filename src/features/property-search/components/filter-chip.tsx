'use client';

import { cn } from '@/lib/utils/cn';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
}

export function FilterChip({
  label,
  selected = false,
  onClick,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 items-center rounded-full border px-3 text-[13px] font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        selected
          ? 'border-brand-200 bg-brand-50 text-brand-600'
          : 'border-border bg-white text-ink-700 hover:bg-surface-50',
        className,
      )}
    >
      {label}
    </button>
  );
}
