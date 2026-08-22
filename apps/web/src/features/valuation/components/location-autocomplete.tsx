'use client';

import { useMemo, useState } from 'react';
import type { LocationOption } from '@/features/locations';
import { cn } from '@/lib/utils/cn';

interface LocationAutocompleteProps {
  locations: LocationOption[];
  valueSlug?: string;
  onSelect: (location: LocationOption) => void;
}

export function LocationAutocomplete({
  locations,
  valueSlug,
  onSelect,
}: LocationAutocompleteProps) {
  const selected = locations.find((item) => item.slug === valueSlug);
  const [query, setQuery] = useState(selected?.breadcrumb ?? selected?.name ?? '');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations.slice(0, 8);
    return locations
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.breadcrumb.toLowerCase().includes(q) ||
          item.slug.includes(q),
      )
      .slice(0, 8);
  }, [locations, query]);

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        placeholder="ابحث عن المدينة أو الحي أو المنطقة"
        className="h-12 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        aria-autocomplete="list"
      />
      {open && filtered.length > 0 ? (
        <ul className="absolute inset-x-0 top-[calc(100%+0.35rem)] z-20 max-h-64 overflow-auto rounded-lg border border-border bg-white py-1 shadow-lg">
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={cn(
                  'flex w-full flex-col items-start px-3 py-2 text-start text-sm hover:bg-surface-50',
                  item.slug === valueSlug && 'bg-brand-50',
                )}
                onClick={() => {
                  onSelect(item);
                  setQuery(item.breadcrumb || item.name);
                  setOpen(false);
                }}
              >
                <span className="font-semibold text-ink-900">{item.name}</span>
                <span className="text-xs text-ink-500">{item.breadcrumb}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
