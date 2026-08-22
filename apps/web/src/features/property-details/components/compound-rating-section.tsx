import type { LucideIcon } from 'lucide-react';
import {
  Bus,
  GraduationCap,
  Hospital,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  VolumeX,
} from 'lucide-react';
import { uiLabels } from '@/config/labels';
import type { Property } from '@/types';

interface CompoundRatingSectionProps {
  property: Property;
}

const categoryIcons: Record<string, LucideIcon> = {
  overall: Star,
  cleanliness: Sparkles,
  location: MapPin,
  quiet: VolumeX,
  transport: Bus,
  schools: GraduationCap,
  shopping: Store,
  health: Hospital,
};

export function CompoundRatingSection({ property }: CompoundRatingSectionProps) {
  const ratings = property.compoundRatings;
  if (!property.compoundName || !ratings) {
    return null;
  }

  return (
    <section className="pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
          {uiLabels.compoundRatingTitlePrefix} {property.compoundName}
        </h2>
        <p className="inline-flex items-center gap-1.5 text-lg font-extrabold text-ink-900">
          <ShieldCheck className="size-5 text-brand-600" aria-hidden />
          <Star className="size-5 fill-accent-500 text-accent-500" aria-hidden />
          {ratings.overall.toFixed(1)}
          <span className="text-sm font-medium text-ink-500">/5</span>
        </p>
      </div>

      <ul className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
        {ratings.categories.map((category) => {
          const Icon = categoryIcons[category.key] ?? Star;
          const percent = Math.min(100, (category.score / 5) * 100);
          return (
            <li key={category.key}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 font-medium text-ink-700">
                  <Icon className="size-4 text-ink-500" strokeWidth={1.75} aria-hidden />
                  {category.label}
                </span>
                <span className="font-bold text-ink-900">
                  {category.score.toFixed(1)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-100">
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
