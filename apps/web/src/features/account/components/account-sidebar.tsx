'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { accountCopy, accountNavItems } from '../config/account-nav';
import { AccountNavIcon } from './account-primitives';

export function AccountSidebar() {
  const pathname = usePathname();
  const navId = useId();

  return (
    <nav aria-labelledby={navId} className="hidden w-[16.5rem] shrink-0 lg:block">
      <p id={navId} className="sr-only">
        {accountCopy.pageTitle}
      </p>
      <ul className="space-y-1">
        {accountNavItems.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-700 hover:bg-surface-50',
                )}
              >
                <AccountNavIcon
                  name={item.icon}
                  size={18}
                  className={active ? 'text-brand-600' : 'text-ink-500'}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AccountMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const listId = useId();
  const current =
    accountNavItems.find((item) => item.href === pathname) ?? accountNavItems[0];

  return (
    <div className="relative mb-5 lg:hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm font-semibold text-ink-900"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="inline-flex items-center gap-2">
          <AccountNavIcon
            name={current.icon}
            size={18}
            className="text-brand-600"
          />
          {current.label}
        </span>
        <span className="text-ink-500">{open ? '▲' : '▼'}</span>
      </button>
      {open ? (
        <ul
          id={listId}
          className="absolute inset-x-0 top-[calc(100%+0.35rem)] z-20 space-y-1 rounded-xl border border-[#e5e5e5] bg-white p-2 shadow-md"
        >
          {accountNavItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold',
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-700 hover:bg-surface-50',
                  )}
                >
                  <AccountNavIcon name={item.icon} size={16} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
