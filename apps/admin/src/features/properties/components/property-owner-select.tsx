'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Loader2, Search, User } from 'lucide-react';
import { selectUsersAction } from '@/features/users/actions';
import type { AdminUserSelectItem } from '@/features/users/types';
import { cn } from '@/lib/utils/cn';
import type { AdminPropertyOwner } from '../types';

interface PropertyOwnerSelectProps {
  value: string;
  onChange: (ownerId: string) => void;
  initialOwner?: AdminPropertyOwner | null;
  disabled?: boolean;
  error?: string;
}

function toSelectItem(owner: AdminPropertyOwner): AdminUserSelectItem {
  return {
    id: owner.id,
    name: owner.name,
    email: owner.email,
    phone: owner.phone,
  };
}

function formatOwnerLabel(user: AdminUserSelectItem): string {
  return user.name?.trim() || user.email;
}

export function PropertyOwnerSelect({
  value,
  onChange,
  initialOwner,
  disabled = false,
  error,
}: PropertyOwnerSelectProps) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AdminUserSelectItem[]>([]);
  const [selected, setSelected] = useState<AdminUserSelectItem | null>(
    initialOwner ? toSelectItem(initialOwner) : null,
  );

  useEffect(() => {
    if (initialOwner && initialOwner.id === value) {
      setSelected(toSelectItem(initialOwner));
    }
  }, [initialOwner, value]);

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

    async function loadUsers() {
      setLoading(true);
      const result = await selectUsersAction(debouncedSearch || undefined, 20);
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

    void loadUsers();

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

  function handleSelect(user: AdminUserSelectItem) {
    setSelected(user);
    onChange(user.id);
    setOpen(false);
    setSearch('');
  }

  const showEmpty = open && !loading && results.length === 0;

  return (
    <div ref={containerRef} className="relative flex w-full flex-col gap-1.5 text-sm">
      <span className="font-medium text-ink-800">مالك العقار</span>

      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          'flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-white px-3 text-start text-sm text-ink-900',
          'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
          'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
          error && 'border-danger-500 focus-visible:ring-danger-200',
        )}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
      >
        {selected ? (
          <span className="min-w-0 truncate">
            <span className="font-medium">{formatOwnerLabel(selected)}</span>
            <span className="mx-1 text-ink-400">·</span>
            <span className="text-ink-500" dir="ltr">
              {selected.email}
            </span>
          </span>
        ) : (
          <span className="text-ink-400">اختر مالك العقار</span>
        )}
        <ChevronDown className="size-4 shrink-0 text-ink-400" aria-hidden />
      </button>

      {error ? <span className="text-xs text-danger-600">{error}</span> : null}

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
                placeholder="ابحث بالاسم أو البريد..."
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
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-ink-500">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                جاري البحث…
              </div>
            ) : null}

            {showEmpty ? (
              <p className="py-6 text-center text-sm text-ink-500">
                {debouncedSearch
                  ? 'لا توجد نتائج مطابقة.'
                  : 'ابدأ بالكتابة للبحث عن مستخدم.'}
              </p>
            ) : null}

            {!loading
              ? results.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={cn(
                      'flex w-full items-start gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors',
                      value === user.id
                        ? 'bg-accent-50 text-accent-900'
                        : 'text-ink-800 hover:bg-surface-50',
                    )}
                    onClick={() => handleSelect(user)}
                  >
                    <User className="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-medium">{formatOwnerLabel(user)}</span>
                      <span className="block truncate text-xs text-ink-500" dir="ltr">
                        {user.email}
                      </span>
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
