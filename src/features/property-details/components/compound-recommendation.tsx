import Link from 'next/link';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { getButtonClassName } from '@/components/ui/button';
import type { Property } from '@/types';

interface CompoundRecommendationProps {
  property: Property;
}

export function CompoundRecommendation({ property }: CompoundRecommendationProps) {
  if (!property.compoundName || !property.compoundSlug) {
    return null;
  }

  const score = property.compoundRatings?.overall ?? 3.5;
  const markerPercent = Math.min(96, Math.max(4, (score / 5) * 100));

  return (
    <section className="mt-10 rounded-xl border border-brand-200 bg-brand-50 px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
              {uiLabels.proBadge}
            </span>
            <p className="text-sm font-semibold text-brand-700">
              {uiLabels.compoundRecommendTitle}
            </p>
          </div>
          <h3 className="mt-2 text-lg font-bold text-ink-900">
            {property.compoundName}
          </h3>
          <p className="mt-1.5 max-w-3xl text-sm leading-7 text-ink-700">
            {property.compoundDescription ??
              `تعرّف على وحدات ومزايا مشروع ${property.compoundName} في ${property.location.areaName}.`}
          </p>

          <div className="mt-4 max-w-md">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-ink-600">
              <span>أقل توصية</span>
              <span className="font-bold text-brand-700">
                {score.toFixed(1)} من 5
              </span>
              <span>أعلى توصية</span>
            </div>
            <div className="relative h-2.5 overflow-visible rounded-full bg-[linear-gradient(to_left,#d64545,#f9a825,#2e7d32)]">
              <span
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink-900 shadow"
                style={{ left: `${markerPercent}%` }}
                aria-hidden
              />
            </div>
          </div>
        </div>

        <Link
          href={routes.compounds.details(property.compoundSlug)}
          className={getButtonClassName({
            variant: 'primary',
            className: 'shrink-0 font-bold',
          })}
        >
          {uiLabels.viewMore}
        </Link>
      </div>
    </section>
  );
}
