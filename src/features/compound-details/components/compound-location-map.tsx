'use client';

import { MapPin } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';

interface CompoundLocationMapProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export function CompoundLocationMap({
  latitude,
  longitude,
  className,
}: CompoundLocationMapProps) {
  const delta = 0.016;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join('%2C');

  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
  const externalHref = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <section id="location" className={cn('scroll-mt-24', className)}>
      <h2 className="text-lg font-bold text-ink-900 sm:text-xl">
        {uiLabels.compoundDetailsMapTitle}
      </h2>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-border">
        <iframe
          title={uiLabels.compoundDetailsMapTitle}
          src={embedSrc}
          className="h-[200px] w-full border-0 lg:h-[220px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            <MapPin
              className="size-9 fill-danger-600 text-danger-600 drop-shadow-md"
              strokeWidth={1.5}
              aria-hidden
            />
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto mt-2 inline-flex items-center rounded-md bg-brand-600 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-brand-700"
            >
              {uiLabels.compoundDetailsShowLocation}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
