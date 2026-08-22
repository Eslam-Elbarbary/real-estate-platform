import { uiLabels } from '@/config/labels';
import type { CompoundRecommendation } from '@/types';
import { cn } from '@/lib/utils/cn';

interface CompoundRecommendationCardProps {
  projectName: string;
  recommendation: CompoundRecommendation;
  className?: string;
}

function markerPercent(score: number) {
  return Math.min(100, Math.max(0, score));
}

export function CompoundRecommendationCard({
  projectName,
  recommendation,
  className,
}: CompoundRecommendationCardProps) {
  const marker = markerPercent(recommendation.score);

  return (
    <aside
      className={cn(
        'rounded-xl border border-brand-200 bg-[#eef6fc] p-4',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-bold text-ink-900">
            {projectName}
          </p>
          <p className="mt-1 text-[12px] leading-5 text-ink-600">
            {recommendation.summary}
          </p>
        </div>
        {recommendation.pro ? (
          <span className="shrink-0 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
            {uiLabels.compoundDetailsProBadge}
          </span>
        ) : null}
      </div>

      {recommendation.benefits?.length ? (
        <ul className="mt-3 space-y-1.5">
          {recommendation.benefits.map((item) => (
            <li
              key={item}
              className="text-[12px] leading-5 text-ink-700 before:me-1.5 before:content-['•']"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4">
        <p className="text-[13px] font-bold text-ink-900">
          {uiLabels.compoundDetailsRecommendation}
        </p>
        <p className="mt-1 text-[12px] font-semibold text-ink-700">
          {recommendation.label}
        </p>

        <div className="relative mt-4 pt-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between text-[10px] text-ink-400">
            <span>أقل تفضيلاً</span>
            <span>متوسط</span>
            <span>موصى به</span>
          </div>
          <div
            className="relative h-2.5 overflow-hidden rounded-full"
            style={{
              background:
                'linear-gradient(to left, #e53935 0%, #fbc02d 45%, #43a047 100%)',
            }}
          >
            <span
              className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-ink-900 shadow"
              style={{ insetInlineStart: `calc(${marker}% - 7px)` }}
              aria-hidden
            />
          </div>
          <span className="sr-only">
            درجة التوصية {recommendation.score} من 100
          </span>
        </div>

        {recommendation.ctaLabel ? (
          <button
            type="button"
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-accent-500 text-[13px] font-bold text-ink-950 transition hover:bg-accent-600"
          >
            {recommendation.ctaLabel}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
