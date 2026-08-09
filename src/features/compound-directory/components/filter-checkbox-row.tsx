'use client';

import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FilterCheckboxRowProps {
  label: string;
  count?: number;
  checked: boolean;
  href: string;
  hasChildren?: boolean;
}

export function FilterCheckboxRow({
  label,
  count,
  checked,
  href,
  hasChildren = false,
}: FilterCheckboxRowProps) {
  const router = useRouter();

  return (
    <label className="flex cursor-pointer items-center gap-2 py-[3px] text-[13px] leading-[1.45]">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          router.push(href);
        }}
        className={cn(
          'size-[14px] shrink-0 rounded-[2px] border-border text-brand-600 focus:ring-brand-500',
        )}
      />
      <span className="min-w-0 flex-1 truncate font-medium text-ink-800">
        {label}
      </span>
      {count !== undefined ? (
        <span className="shrink-0 text-[12px] tabular-nums text-ink-400">
          ({count})
        </span>
      ) : null}
      {hasChildren ? (
        <ChevronDown className="size-3.5 shrink-0 text-ink-400" aria-hidden />
      ) : (
        <span className="size-3.5 shrink-0" aria-hidden />
      )}
    </label>
  );
}
