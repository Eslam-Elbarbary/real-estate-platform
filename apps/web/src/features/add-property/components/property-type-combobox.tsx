'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  propertyTypeOptions,
  type PropertyTypeOption,
} from '@/config/property-types';
import type { PropertyType } from '@/types';
import { cn } from '@/lib/utils/cn';
import { listingCopy } from '../config';

interface PropertyTypeComboboxProps {
  value: PropertyType | null;
  onChange: (value: PropertyType) => void;
  id?: string;
  className?: string;
}

export function PropertyTypeCombobox({
  value,
  onChange,
  id,
  className,
}: PropertyTypeComboboxProps) {
  const listboxId = useId();
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = propertyTypeOptions.find((o) => o.value === value) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return propertyTypeOptions;
    return propertyTypeOptions.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }, [query]);

  const safeActiveIndex =
    filtered.length === 0 ? 0 : Math.min(activeIndex, filtered.length - 1);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  function selectOption(option: PropertyTypeOption) {
    onChange(option.value);
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div className="relative">
        <input
          id={inputId}
          role="combobox"
          type="text"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && filtered[safeActiveIndex]
              ? `${listboxId}-${filtered[safeActiveIndex].value}`
              : undefined
          }
          placeholder={listingCopy.propertyTypePlaceholder}
          value={open ? query : (selected?.label ?? '')}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((i) =>
                filtered.length ? Math.min(i + 1, filtered.length - 1) : 0,
              );
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (event.key === 'Enter' && open && filtered[safeActiveIndex]) {
              event.preventDefault();
              selectOption(filtered[safeActiveIndex]);
            } else if (event.key === 'Escape') {
              setOpen(false);
              setQuery('');
            }
          }}
          className="h-12 w-full rounded-lg border border-[#d9d9d9] bg-white pe-10 ps-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          data-testid="property-type-combobox"
        />
        <ChevronDown
          className="pointer-events-none absolute top-1/2 end-3 size-4 -translate-y-1/2 text-ink-400"
          aria-hidden
        />
      </div>

      {open ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute inset-x-0 top-[calc(100%+0.35rem)] z-30 max-h-64 overflow-auto rounded-lg border border-border bg-white py-1 shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-ink-500">لا نتائج</li>
          ) : (
            filtered.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === safeActiveIndex;
              return (
                <li
                  key={option.value}
                  id={`${listboxId}-${option.value}`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-3 py-2.5 text-start text-sm',
                      isActive && 'bg-surface-50',
                      isSelected && 'bg-brand-50 font-semibold text-brand-800',
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option)}
                  >
                    <span>{option.label}</span>
                    {isSelected ? (
                      <Check size={14} className="text-brand-600" aria-hidden />
                    ) : null}
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
