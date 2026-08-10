'use client';

import { useEffect, useId, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { PropertySearchForm } from '@/features/property-search';
import type { LocationOption } from '@/features/locations';
import { getAppIcon, ICON_SIZE_UI } from '@/config/icons';
import {
  loggedInAccountMenuSections,
  loggedOutAccountMenuLinks,
} from '@/config/account-menu';
import { headerActions, primaryNavigation } from '@/config/navigation';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';
import { logoutAction } from '@/features/auth/actions';
import type { AuthSession } from '@/features/auth/types';

const PlusIcon = getAppIcon('addProperty');
const UserIcon = getAppIcon('account');
const CloseIcon = getAppIcon('close');
const LogoutIcon = getAppIcon('logout');

interface MobileNavigationProps {
  locations: LocationOption[];
  session: AuthSession | null;
}

export function MobileNavigation({
  locations,
  session,
}: MobileNavigationProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
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

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
      setOpen(false);
      router.refresh();
    });
  }

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
        data-testid="mobile-nav-trigger"
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
            data-testid="mobile-nav-drawer"
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
              {session ? (
                <div className="mb-4 rounded-xl border border-border bg-surface-50 p-3">
                  <p className="text-sm font-extrabold text-ink-950">
                    {session.user.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {session.user.memberSinceLabel}
                  </p>
                  {session.user.displayRoleLabel ? (
                    <p className="mt-1 text-xs text-ink-600">
                      {session.user.displayRoleLabel}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <PropertySearchForm
                locations={locations}
                variant="stacked"
                className="mb-4"
              />

              <nav aria-label={uiLabels.mobileNav} className="grid gap-0.5">
                {primaryNavigation.map((item) => {
                  const Icon = getAppIcon(item.icon);
                  const linkClassName =
                    'inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-surface-50';

                  if (!item.href) {
                    const features =
                      item.megaMenu?.featureColumns?.flat() ?? [];
                    return (
                      <div key={item.id} className="space-y-0.5">
                        <p className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-ink-800">
                          <Icon
                            size={ICON_SIZE_UI}
                            strokeWidth={1.75}
                            aria-hidden
                          />
                          {item.label}
                        </p>
                        {features.map((feature) => {
                          const FeatureIcon = getAppIcon(feature.icon);
                          if (!feature.href) {
                            return (
                              <div
                                key={feature.title}
                                aria-disabled="true"
                                className="ms-4 inline-flex cursor-default items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-ink-400"
                              >
                                <FeatureIcon
                                  size={ICON_SIZE_UI}
                                  strokeWidth={1.75}
                                  aria-hidden
                                />
                                {feature.title}
                              </div>
                            );
                          }
                          return (
                            <Link
                              key={feature.title}
                              href={feature.href}
                              className={`${linkClassName} ms-4 py-2`}
                              onClick={() => setOpen(false)}
                            >
                              <FeatureIcon
                                size={ICON_SIZE_UI}
                                strokeWidth={1.75}
                                aria-hidden
                              />
                              {feature.title}
                            </Link>
                          );
                        })}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={linkClassName}
                      onClick={() => setOpen(false)}
                    >
                      <Icon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {session ? (
                <div className="mt-5 space-y-4 border-t border-border pt-4">
                  {loggedInAccountMenuSections.map((section) => (
                    <nav
                      key={section.id}
                      aria-label={section.title}
                      className="grid gap-0.5"
                    >
                      <p className="px-3 pb-1 text-[11px] font-bold text-ink-400">
                        {section.title}
                      </p>
                      {section.links.map((item) => {
                        const Icon = getAppIcon(item.icon);
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-surface-50"
                            onClick={() => setOpen(false)}
                          >
                            <Icon
                              size={ICON_SIZE_UI}
                              strokeWidth={1.75}
                              aria-hidden
                            />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                  ))}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={handleLogout}
                    className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-danger-600 hover:bg-danger-50"
                  >
                    <LogoutIcon size={ICON_SIZE_UI} aria-hidden />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <nav
                  aria-label="نشاطاتي"
                  className="mt-5 grid gap-0.5 border-t border-border pt-4"
                >
                  {loggedOutAccountMenuLinks.map((item) => {
                    const Icon = getAppIcon(item.icon);
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:bg-surface-50"
                        onClick={() => setOpen(false)}
                      >
                        <Icon
                          size={ICON_SIZE_UI}
                          strokeWidth={1.75}
                          aria-hidden
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            <div className="grid gap-2 border-t border-border p-4">
              {!session ? (
                <Link
                  href={routes.auth.login}
                  className={getButtonClassName({
                    variant: 'outline',
                    className: 'w-full',
                  })}
                  onClick={() => setOpen(false)}
                >
                  <UserIcon className="size-4" aria-hidden />
                  {headerActions.login.label}
                </Link>
              ) : (
                <Link
                  href={routes.account.profile}
                  className={getButtonClassName({
                    variant: 'outline',
                    className: 'w-full',
                  })}
                  onClick={() => setOpen(false)}
                >
                  <UserIcon className="size-4" aria-hidden />
                  حسابي
                </Link>
              )}
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
