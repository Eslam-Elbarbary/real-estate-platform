'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { PropertySearchForm } from '@/features/property-search';
import type { LocationOption } from '@/features/locations';
import { getAppIcon, ICON_SIZE_UI } from '@/config/icons';
import { headerActions, primaryNavigation } from '@/config/navigation';
import { uiLabels } from '@/config/labels';

const PlusIcon = getAppIcon('addProperty');
const UserIcon = getAppIcon('account');
const CloseIcon = getAppIcon('close');

interface MobileNavigationProps {
  locations: LocationOption[];
}

export function MobileNavigation({ locations }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open]);

  return (
    <div className="flex items-center gap-1 lg:hidden">
      <Link
        href={headerActions.addListing.href}
        className={getButtonClassName({
          variant: 'accent',
          size: 'small',
          className: 'hidden font-bold sm:inline-flex',
        })}
      >
        <PlusIcon className="size-3.5" aria-hidden />
        {headerActions.addListing.label}
      </Link>

      <button
        type="button"
        className="inline-flex size-9 items-center justify-center rounded-md text-ink-700 transition-colors hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={uiLabels.openMenu}
        aria-expanded={open}
        aria-controls="mobile-navigation-drawer"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label={uiLabels.closeMenu}
            className="absolute inset-0 bg-ink-950/40"
            onClick={() => setOpen(false)}
          />

          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 end-0 flex w-[min(100%,22rem)] flex-col bg-white shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p id={titleId} className="text-sm font-semibold text-ink-950">
                {uiLabels.mobileNav}
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex size-9 items-center justify-center rounded-md text-ink-700 transition-colors hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                aria-label={uiLabels.closeMenu}
                onClick={() => setOpen(false)}
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              <PropertySearchForm
                locations={locations}
                variant="stacked"
                className="mb-4"
              />

              <nav aria-label={uiLabels.mobileNav} className="grid gap-0.5">
                {primaryNavigation.map((item) => {
                  const Icon = getAppIcon(item.icon);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-surface-50"
                      onClick={() => setOpen(false)}
                    >
                      <Icon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="grid gap-2 border-t border-border p-4">
              <Link
                href={headerActions.login.href}
                className={getButtonClassName({
                  variant: 'outline',
                  className: 'w-full',
                })}
                onClick={() => setOpen(false)}
              >
                <UserIcon className="size-4" aria-hidden />
                {headerActions.login.label}
              </Link>
              <Link
                href={headerActions.addListing.href}
                className={getButtonClassName({
                  variant: 'accent',
                  className: 'w-full font-bold',
                })}
                onClick={() => setOpen(false)}
              >
                <PlusIcon className="size-4" aria-hidden />
                {headerActions.addListing.label}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
