import { MapPinned } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';

interface MapSearchButtonProps {
  className?: string;
}

/** Visual/navigation-prepared control — map search page is out of scope. */
export function MapSearchButton({ className }: MapSearchButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex h-[42px] items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-sm font-semibold text-ink-800',
        'hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        className,
      )}
      aria-label={uiLabels.mapSearch}
    >
      <MapPinned className="size-4 text-brand-600" aria-hidden />
      {uiLabels.mapSearch}
      <span className="absolute -top-2 start-2 rounded bg-accent-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
        {uiLabels.newBadgeShort}
      </span>
    </button>
  );
}
