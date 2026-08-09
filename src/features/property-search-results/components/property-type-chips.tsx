import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import type { SubtypeChip } from '../lib/subtype-chips';

interface PropertyTypeChipsProps {
  chips: SubtypeChip[];
  className?: string;
}

export function PropertyTypeChips({ chips, className }: PropertyTypeChipsProps) {
  if (!chips.length) {
    return null;
  }

  const formatter = new Intl.NumberFormat(siteConfig.locale);

  return (
    <div
      className={cn(
        'flex justify-start gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
    >
      {chips.map((chip) => (
        <Link
          key={chip.id}
          href={chip.href}
          className={cn(
            'inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
            chip.selected
              ? 'border-brand-200 bg-brand-50 text-brand-700'
              : 'border-border bg-white text-ink-700 hover:border-brand-200 hover:text-brand-700',
          )}
        >
          {chip.label}
          <span className="ms-1 text-[11px] font-medium opacity-80">
            ({formatter.format(chip.count)})
          </span>
        </Link>
      ))}
    </div>
  );
}
