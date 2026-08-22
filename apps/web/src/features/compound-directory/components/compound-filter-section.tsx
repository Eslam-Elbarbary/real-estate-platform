'use client';

import { useState, type ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CompoundFilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function CompoundFilterSection({
  title,
  defaultOpen = false,
  children,
  className,
}: CompoundFilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('border-b border-border py-2.5', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-start"
        aria-expanded={open}
      >
        <span className="text-[13px] font-bold leading-5 text-ink-900">
          {title}
        </span>
        <span
          className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-[3px] border border-border bg-white text-ink-600"
          aria-hidden
        >
          {open ? (
            <Minus className="size-3" strokeWidth={2.5} />
          ) : (
            <Plus className="size-3" strokeWidth={2.5} />
          )}
        </span>
      </button>
      {open ? <div className="mt-2.5 space-y-1">{children}</div> : null}
    </div>
  );
}
