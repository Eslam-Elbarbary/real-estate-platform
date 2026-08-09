import { uiLabels } from '@/config/labels';
import { getButtonClassName } from '@/components/ui/button';

export function PriceInsightStrip() {
  return (
    <aside className="mb-4 flex flex-col gap-3 rounded-lg border border-accent-100 bg-[#FFF8E7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5 sm:py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink-900">{uiLabels.priceInsightTitle}</p>
        <p className="mt-0.5 text-[13px] leading-6 text-ink-700">
          {uiLabels.priceInsightBody}
        </p>
      </div>
      <button
        type="button"
        className={getButtonClassName({
          variant: 'accent',
          size: 'small',
          className: 'h-9 shrink-0 px-4 text-xs font-bold',
        })}
      >
        {uiLabels.priceInsightCta}
      </button>
    </aside>
  );
}
