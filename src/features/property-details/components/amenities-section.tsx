'use client';

import { useState } from 'react';
import { uiLabels } from '@/config/labels';
import { getAmenityIcon } from '../lib/amenity-icons';

interface AmenitiesSectionProps {
  amenities: string[];
}

const INITIAL_COUNT = 6;

export function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!amenities.length) {
    return null;
  }

  const visible = expanded ? amenities : amenities.slice(0, INITIAL_COUNT);
  const canExpand = amenities.length > INITIAL_COUNT;

  return (
    <section id="amenities" className="scroll-mt-28 pt-10">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.amenitiesSectionTitle}
      </h2>

      <ul className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((amenity) => {
          const Icon = getAmenityIcon(amenity);
          return (
            <li
              key={amenity}
              className="inline-flex items-center gap-3.5 text-[15px] font-medium text-ink-800"
            >
              <Icon className="size-5 shrink-0 text-ink-500" strokeWidth={1.75} aria-hidden />
              {amenity}
            </li>
          );
        })}
      </ul>

      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-6 text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          {expanded ? uiLabels.showLess : uiLabels.showMore}
        </button>
      ) : null}
    </section>
  );
}
