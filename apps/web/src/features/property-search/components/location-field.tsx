'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, MapPin, X } from 'lucide-react';
import { uiLabels } from '@/config/labels';
import type { LocationOption } from '@/features/locations';
import { cn } from '@/lib/utils/cn';

const levelLabels: Record<LocationOption['level'], string> = {
  governorate: 'محافظة',
  city: 'مدينة',
  area: 'منطقة',
  neighborhood: 'حي',
};

interface LocationFieldProps {
  locations: LocationOption[];
  value?: LocationOption | null;
  onChange: (value: LocationOption | null) => void;
  className?: string;
  variant?: 'default' | 'hero' | 'drawer' | 'results';
  placeholder?: string;
}

export function LocationField({
  locations,
  value,
  onChange,
  className,
  variant = 'default',
  placeholder,
}: LocationFieldProps) {
  const listboxId = useId();
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const isHero = variant === 'hero';
  const isDrawer = variant === 'drawer';
  const isResults = variant === 'results';
  const inputPlaceholder = placeholder ?? uiLabels.locationPlaceholder;

  const filtered = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) {
      return locations;
    }

    return locations.filter((location) =>
      `${location.name} ${location.breadcrumb}`
        .toLowerCase()
        .includes(normalized.toLowerCase()),
    );
  }, [locations, query]);

  const safeActiveIndex =
    filtered.length === 0 ? 0 : Math.min(activeIndex, filtered.length - 1);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  function selectLocation(location: LocationOption) {
    onChange(location);
    setQuery('');
    setOpen(false);
  }

  function clearLocation() {
    onChange(null);
    setQuery('');
    setOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative flex min-w-0 flex-col',
        !isHero && 'flex-[1.4] gap-1.5',
        isHero && 'flex-1',
        className,
      )}
    >
      {isHero || isDrawer || isResults ? (
        <label htmlFor={inputId} className="sr-only">
          {uiLabels.location}
        </label>
      ) : (
        <label htmlFor={inputId} className="text-xs font-medium text-ink-500">
          {uiLabels.location}
        </label>
      )}

      <div className="relative">
        <MapPin
          className={cn(
            'pointer-events-none absolute top-1/2 start-3 -translate-y-1/2 text-ink-400',
            isHero || isResults ? 'size-5' : 'size-4',
          )}
          aria-hidden
        />
        <input
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && filtered[safeActiveIndex]
              ? `${listboxId}-${filtered[safeActiveIndex].id}`
              : undefined
          }
          autoComplete="off"
          placeholder={inputPlaceholder}
          value={open ? query : (value?.name ?? query)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setOpen(true);
            if (value) {
              onChange(null);
            }
          }}
          onFocus={() => {
            setActiveIndex(0);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((index) =>
                Math.min(index + 1, Math.max(filtered.length - 1, 0)),
              );
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((index) => Math.max(index - 1, 0));
            }

            if (event.key === 'Enter' && open && filtered[safeActiveIndex]) {
              event.preventDefault();
              selectLocation(filtered[safeActiveIndex]);
            }

            if (event.key === 'Escape') {
              setOpen(false);
            }
          }}
          className={cn(
            'w-full border border-border bg-white text-sm text-ink-900',
            'placeholder:text-ink-400',
            'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
            isHero
              ? 'h-12 rounded-[12px] pe-16 ps-11 text-[15px] lg:h-[50px] lg:rounded-lg'
              : isResults
                ? 'h-11 rounded-xl pe-12 ps-11 text-sm'
                : 'h-11 rounded-md pe-16 ps-10',
            isDrawer && 'rounded-lg',
          )}
        />

        <div className="absolute inset-y-0 end-1 flex items-center gap-0.5">
          {value ? (
            <button
              type="button"
              onClick={clearLocation}
              className="inline-flex size-8 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-surface-100 hover:text-ink-800"
              aria-label={uiLabels.locationClear}
            >
              <X className="size-4" />
            </button>
          ) : null}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="inline-flex size-8 items-center justify-center rounded-md text-ink-400"
            onClick={() => setOpen((current) => !current)}
          >
            <ChevronDown
              className={cn('size-4 transition-transform', open && 'rotate-180')}
            />
          </button>
        </div>
      </div>

      {!isHero && !isResults && value ? (
        <p className="truncate text-xs text-ink-500">{value.breadcrumb}</p>
      ) : null}

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute inset-inline-0 top-[calc(100%+0.25rem)] z-50 max-h-64 overflow-auto rounded-lg border border-border bg-white py-1 shadow-md"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-ink-500">{uiLabels.noLocations}</li>
          ) : (
            filtered.map((location, index) => {
              const active = index === safeActiveIndex;
              const selected = value?.id === location.id;

              return (
                <li key={location.id} role="option" aria-selected={selected}>
                  <button
                    id={`${listboxId}-${location.id}`}
                    type="button"
                    className={cn(
                      'flex w-full items-start gap-3 px-3 py-2.5 text-start transition-colors',
                      active ? 'bg-brand-50' : 'hover:bg-surface-50',
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectLocation(location)}
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
                      {selected ? <Check className="size-4 text-brand-700" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-900">
                        {location.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-ink-500">
                        {levelLabels[location.level]} · {location.breadcrumb}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
