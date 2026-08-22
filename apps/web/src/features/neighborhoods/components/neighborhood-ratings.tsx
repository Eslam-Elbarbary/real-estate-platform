import {
  HeartPulse,
  MapPin,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Star,
  Volume2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  neighborhoodCopy,
  neighborhoodRatingCategories,
  type NeighborhoodRatingCategoryKey,
} from '../config';
import { formatRatingScore } from '../lib/format';
import type { NeighborhoodRatings } from '../types';

const ICONS: Record<NeighborhoodRatingCategoryKey, LucideIcon> = {
  safety: Shield,
  services: HeartPulse,
  quietness: Volume2,
  transportation: MapPin,
  shopping: ShoppingBag,
  lifestyle: ShoppingCart,
};

interface NeighborhoodRatingsSectionProps {
  name: string;
  ratings: NeighborhoodRatings;
}

export function NeighborhoodRatingsSection({
  name,
  ratings,
}: NeighborhoodRatingsSectionProps) {
  const categories = neighborhoodRatingCategories.filter(
    (cat) => typeof ratings[cat.key] === 'number',
  );
  if (ratings.overall == null && !categories.length) return null;

  return (
    <section>
      <h2 className="border-s-4 border-accent-500 ps-3 text-xl font-extrabold text-ink-950">
        {neighborhoodCopy.ratingPrefix} {name}
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ratings.overall != null ? (
          <div className="flex items-center gap-3 rounded-lg bg-accent-500 px-5 py-4 text-white sm:col-span-2 lg:col-span-1">
            <Star className="size-8 fill-white" aria-hidden />
            <div>
              <p className="text-3xl font-extrabold">
                {formatRatingScore(ratings.overall)}
              </p>
              <p className="text-xs font-semibold opacity-90">
                {neighborhoodCopy.ratingScaleHint}
              </p>
            </div>
          </div>
        ) : null}
        {categories.map((cat) => {
          const Icon = ICONS[cat.key];
          const value = ratings[cat.key]!;
          return (
            <div
              key={cat.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#e8e8e8] bg-[#f7f7f7] px-4 py-3"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="size-5 text-ink-600" aria-hidden />
                <span className="text-sm font-bold text-ink-800">{cat.label}</span>
              </div>
              <span className="text-lg font-extrabold text-ink-950">
                {formatRatingScore(value)}
                <span className="sr-only"> من 10</span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
