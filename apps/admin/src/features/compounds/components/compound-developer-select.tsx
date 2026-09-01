'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Building2, ChevronDown, Loader2, Search, X } from 'lucide-react';
import { searchDevelopersAction } from '@/features/developers/actions';
import type { Developer } from '@/features/developers/types';
import { cn } from '@/lib/utils/cn';

interface CompoundDeveloperSelectProps {
  value: string;
  onChange: (developerId: string) => void;
  initialDeveloper?: Developer | null;
  disabled?: boolean;
}

function formatDeveloperLabel(developer: Developer): string {
  return developer.nameAr ?? developer.nameEn;
}

export function CompoundDeveloperSelect({
  value,
  onChange,
  initialDeveloper,
  disabled = false,
}: CompoundDeveloperSelectProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Developer[]>([]);
  const [selected, setSelected] = useState<Developer | null>(initialDeveloper ?? null);

  useEffect(() => {
    if (initialDeveloper && initialDeveloper.id === value) {
      setSelected(initialDeveloper);
    }
  }, [initialDeveloper, value]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadDevelopers() {
      setLoading(true);
      const result = await searchDevelopersAction(debouncedSearch || undefined, 20);
      if (cancelled) {
        return;
      }

      if (result.ok) {
        setResults(result.items);
      } else {
        setResults([]);
      }
      setLoading(false);
    }

    void loadDevelopers();

    return () => {
      cancelled = true;
    };
  }, [open, debouncedSearch]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  function handleSelect(developer: Developer) {
    setSelected(developer);
    onChange(developer.id);
    setOpen(false);
    setSearch('');
  }

  function handleClear() {
    setSelected(null);
    onChange('');
    setOpen(false);
    setSearch('');
  }

  const showEmpty = open && !loading && results.length === 0;

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-800">المطور</span>

      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-white px-3 text-start text-sm text-ink-900',
          'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
          'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
        )}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
      >
        {selected ? (
          <span className="min-w-0 truncate font-medium">{formatDeveloperLabel(selected)}</span>
        ) : (
          <span className="text-ink-400">بدون مطور (اختياري)</span>
        )}
        <ChevronDown className="size-4 shrink-0 text-ink-400" aria-hidden />
      </button>

      {selected && !disabled ? (
        <button
          type="button"
          className="inline-flex items-center gap-1 self-start text-xs text-ink-500 hover:text-ink-700"
          onClick={handleClear}
        >
          <X className="size-3" aria-hidden />
          إزالة المطور
        </button>
      ) : null}

      {open ? (
        <div
          id={listId}
          className="absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-white shadow-lg"
        >
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                placeholder="ابحث عن مطور..."
                autoFocus
                className={cn(
                  'h-9 w-full rounded-md border border-border bg-surface-50 pe-3 ps-9 text-sm text-ink-900',
                  'placeholder:text-ink-400',
                  'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
                )}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto p-1">
            <button
              type="button"
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors',
                !value
                  ? 'bg-accent-50 text-accent-900'
                  : 'text-ink-700 hover:bg-surface-50',
              )}
              onClick={handleClear}
            >
              بدون مطور
            </button>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-ink-500">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                جاري البحث…
              </div>
            ) : null}

            {showEmpty ? (
              <p className="py-6 text-center text-sm text-ink-500">
                {debouncedSearch ? 'لا توجد نتائج مطابقة.' : 'ابدأ بالكتابة للبحث عن مطور.'}
              </p>
            ) : null}

            {!loading
              ? results.map((developer) => (
                  <button
                    key={developer.id}
                    type="button"
                    className={cn(
                      'flex w-full items-start gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors',
                      value === developer.id
                        ? 'bg-accent-50 text-accent-900'
                        : 'text-ink-800 hover:bg-surface-50',
                    )}
                    onClick={() => handleSelect(developer)}
                  >
                    <Building2 className="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-medium">{formatDeveloperLabel(developer)}</span>
                      <span className="block truncate text-xs text-ink-500">{developer.slug}</span>
                    </span>
                  </button>
                ))
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
