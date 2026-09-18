'use client';

import type { MouseEvent } from 'react';
import { MapPin } from 'lucide-react';

const DEFAULT_LAT = 30.0444;
const DEFAULT_LNG = 31.2357;
const DELTA = 0.018;
const CLICK_NUDGE = 0.012;

export interface PropertyLocationMapPickerProps {
  latitude?: number;
  longitude?: number;
  onChange: (coords: { latitude: number; longitude: number }) => void;
  disabled?: boolean;
}

export function PropertyLocationMapPicker({
  latitude = DEFAULT_LAT,
  longitude = DEFAULT_LNG,
  onChange,
  disabled = false,
}: PropertyLocationMapPickerProps) {
  const bbox = [
    longitude - DELTA,
    latitude - DELTA,
    longitude + DELTA,
    latitude + DELTA,
  ].join('%2C');
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

  function handleOverlayClick(event: MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    onChange({
      latitude: Number((latitude - offsetY * CLICK_NUDGE * 2).toFixed(6)),
      longitude: Number((longitude + offsetX * CLICK_NUDGE * 2).toFixed(6)),
    });
  }

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink-900">
        الموقع على الخريطة
      </p>
      <div className="relative overflow-hidden rounded-xl border border-border">
        <iframe
          title="خريطة الموقع"
          src={embedSrc}
          className="h-[240px] w-full border-0 sm:h-[300px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <button
          type="button"
          disabled={disabled}
          aria-label="ضبط موقع العقار على الخريطة"
          onClick={handleOverlayClick}
          className="absolute inset-0 cursor-crosshair bg-transparent disabled:cursor-not-allowed"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <MapPin
            className="size-10 fill-brand-600 text-brand-700 drop-shadow-md"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-500" dir="ltr">
        {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </p>
      <p className="mt-1 text-xs text-ink-500">
        انقر على الخريطة لضبط الإحداثيات (اختياري).
      </p>
    </div>
  );
}
