'use client';

import { MapPin } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import type { PropertyLocation } from '@/types';

interface LocationMapProps {
  location: PropertyLocation;
}

export function LocationMap({ location }: LocationMapProps) {
  const { latitude, longitude } = location;
  const delta = 0.018;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join('%2C');

  // Omit OSM marker param — custom red pin overlay replaces the default marker.
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
  const externalHref = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <section id="location" className="scroll-mt-28 pt-10">
      <h2 className="text-xl font-bold text-ink-900 sm:text-[1.65rem]">
        {uiLabels.mapSectionTitle}
      </h2>

      <div className="relative mt-5 overflow-hidden rounded-xl border border-border">
        <iframe
          title={uiLabels.mapSectionTitle}
          src={embedSrc}
          className="h-[320px] w-full border-0 lg:h-[350px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <MapPin
              className="size-10 fill-danger-600 text-danger-600 drop-shadow-md"
              strokeWidth={1.5}
              aria-hidden
            />
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto mt-2 inline-flex items-center rounded-md bg-brand-600 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-brand-700"
            >
              {uiLabels.showPropertyLocation}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <a
          href={externalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-brand-700 hover:text-brand-600"
        >
          {uiLabels.openFullMap}
        </a>
      </div>
    </section>
  );
}
