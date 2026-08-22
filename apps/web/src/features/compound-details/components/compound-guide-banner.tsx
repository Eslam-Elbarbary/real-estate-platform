import { AppStoreBadges } from '@/components/ui/app-store-badges';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';

interface CompoundGuideBannerProps {
  className?: string;
}

export function CompoundGuideBanner({ className }: CompoundGuideBannerProps) {
  return (
    <aside
      className={cn(
        'overflow-hidden rounded-xl bg-brand-700 px-5 py-5 text-white sm:px-7 sm:py-6',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="text-lg font-bold sm:text-xl">
            {uiLabels.compoundDetailsGuideTitle}
          </p>
          <p className="mt-1.5 text-[13px] leading-6 text-white/90">
            {uiLabels.compoundDetailsGuideBody}
          </p>
          <AppStoreBadges className="mt-4" size="sm" />
        </div>
        <div
          className="mx-auto flex h-28 w-20 shrink-0 items-end justify-center rounded-[1.25rem] border-2 border-white/30 bg-brand-600 shadow-lg sm:mx-0"
          aria-hidden
        >
          <div className="mb-2 h-[78%] w-[78%] rounded-md bg-white/95 p-1.5">
            <div className="h-2 w-10 rounded bg-brand-200" />
            <div className="mt-2 space-y-1.5">
              <div className="h-8 rounded bg-brand-50" />
              <div className="h-8 rounded bg-brand-50" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
