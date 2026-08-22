'use client';

import type { MouseEvent } from 'react';
import { MapPin } from 'lucide-react';
import { listingCopy } from '../config';

const DEFAULT_LAT = 30.0444;
const DEFAULT_LNG = 31.2357;
const DELTA = 0.018;
/** Max lat/lng nudge from a single click at the map edge. */
const CLICK_NUDGE = 0.012;

export interface ListingMapPickerProps {
  latitude?: number;
  longitude?: number;
  onChange: (coords: { latitude: number; longitude: number }) => void;
}

export function ListingMapPicker({
  latitude = DEFAULT_LAT,
  longitude = DEFAULT_LNG,
  onChange,
}: ListingMapPickerProps) {
  const bbox = [
    longitude - DELTA,
    latitude - DELTA,
    longitude + DELTA,
    latitude + DELTA,
  ].join('%2C');
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

  function handleOverlayClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    // Click right of center → increase longitude; below center → decrease latitude.
    onChange({
      latitude: Number((latitude - offsetY * CLICK_NUDGE * 2).toFixed(6)),
      longitude: Number((longitude + offsetX * CLICK_NUDGE * 2).toFixed(6)),
    });
  }

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink-800">
        {listingCopy.mapTitle}
      </p>
      <div className="relative overflow-hidden rounded-xl border border-border">
        <iframe
          title={listingCopy.mapTitle}
          src={embedSrc}
          className="h-[260px] w-full border-0 sm:h-[320px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <button
          type="button"
          aria-label="ضبط موقع العقار على الخريطة"
          onClick={handleOverlayClick}
          className="absolute inset-0 cursor-crosshair bg-transparent"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <MapPin
            className="size-10 fill-accent-500 text-accent-600 drop-shadow-md"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-500" dir="ltr">
        {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </p>
    </div>
  );
}
