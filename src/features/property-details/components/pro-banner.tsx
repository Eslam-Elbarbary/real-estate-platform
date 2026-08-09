import { uiLabels } from '@/config/labels';
import { getButtonClassName } from '@/components/ui/button';

export function ProBanner() {
  return (
    <aside className="mt-8 flex flex-col gap-3 rounded-lg border border-accent-100 bg-[#FFF8E7] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 inline-flex shrink-0 items-center rounded bg-accent-500 px-2 py-0.5 text-xs font-extrabold text-ink-950">
          {uiLabels.proBadge}
        </span>
        <div>
          <p className="text-sm font-bold text-ink-900">{uiLabels.proBannerTitle}</p>
          <p className="mt-1 max-w-3xl text-sm leading-7 text-ink-700">
            {uiLabels.proBannerBody}
          </p>
        </div>
      </div>
      <button
        type="button"
        className={getButtonClassName({
          variant: 'accent',
          className: 'shrink-0 font-bold',
        })}
      >
        {uiLabels.proBannerCta}
      </button>
    </aside>
  );
}
