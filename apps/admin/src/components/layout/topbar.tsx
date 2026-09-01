'use client';

import Link from 'next/link';
import { Bell, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  filterNavByPermissions,
  filterNavByRoles,
  mainNav,
  type NavItem,
} from '@/config/navigation';
import { routes } from '@/config/routes';
import { logoutAction } from '@/features/auth/actions';
import { cn } from '@/lib/utils/cn';
import type { UserRole } from '@/types';

const NAV_GROUPS = [
  {
    title: 'MAIN',
    hrefs: [routes.home],
  },
  {
    title: 'MANAGEMENT',
    hrefs: [routes.users.root, routes.properties.root, routes.leads.root],
  },
  {
    title: 'BUSINESS',
    hrefs: [routes.payments.root, routes.plans.root],
  },
  {
    title: 'CATALOG',
    hrefs: [routes.developers.root, routes.compounds.root],
  },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupNavItems(items: NavItem[]) {
  return NAV_GROUPS.map((group) => ({
    title: group.title,
    items: group.hrefs
      .map((href) => items.find((item) => item.href === href))
      .filter((item): item is NavItem => Boolean(item)),
  })).filter((group) => group.items.length > 0);
}

function getCurrentPageLabel(pathname: string, items: NavItem[]): string {
  const match = items.find((item) => isActivePath(pathname, item.href));
  return match?.label ?? 'لوحة التحكم';
}

function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'A';
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
  }

  return trimmed.slice(0, 2).toUpperCase();
}

interface TopbarProps {
  roles: UserRole[];
  userName: string;
  userEmail: string;
}

export function Topbar({ roles, userName, userEmail }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navItems = filterNavByPermissions(filterNavByRoles(mainNav, roles), roles);
  const groupedNav = groupNavItems(navItems);
  const pageLabel = getCurrentPageLabel(pathname, navItems);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    setUserMenuOpen(false);

    const result = await logoutAction();

    if (result.ok) {
      router.push(routes.login);
      router.refresh();
      setLoggingOut(false);
      return;
    }

    setLoggingOut(false);
  }

  return (
    <>
      <header className="sticky top-0 z-20 flex h-topbar items-center justify-between gap-4 border-b border-border bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="small"
            className="rounded-lg lg:hidden"
            aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-4" aria-hidden />
            ) : (
              <Menu className="size-4" aria-hidden />
            )}
          </Button>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-ink-900 lg:text-lg">
              {pageLabel}
            </p>
            <p className="hidden truncate text-xs text-ink-500 sm:block">
              Madar Home Properties — Admin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="small"
            className="hidden rounded-lg sm:inline-flex"
            aria-label="الإشعارات"
          >
            <Bell className="size-4 text-ink-600" aria-hidden />
          </Button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-border bg-surface-50 px-2 py-1.5 transition-colors hover:bg-surface-100 sm:px-3"
              aria-expanded={userMenuOpen}
              aria-haspopup="menu"
              onClick={() => setUserMenuOpen((open) => !open)}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-semibold text-white">
                {getInitials(userName)}
              </div>
              <div className="hidden min-w-0 text-start sm:block">
                <p className="max-w-[8rem] truncate text-sm font-medium text-ink-900">
                  {userName}
                </p>
                <p className="max-w-[8rem] truncate text-xs text-ink-500" dir="ltr">
                  {userEmail}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  'hidden size-4 text-ink-500 transition-transform sm:block',
                  userMenuOpen && 'rotate-180',
                )}
                aria-hidden
              />
            </button>

            {userMenuOpen ? (
              <div
                role="menu"
                className="absolute end-0 top-[calc(100%+0.5rem)] z-30 w-56 rounded-xl border border-border bg-white p-1.5 shadow-lg"
              >
                <div className="border-b border-border px-3 py-2.5">
                  <p className="truncate text-sm font-medium text-ink-900">{userName}</p>
                  <p className="truncate text-xs text-ink-500" dir="ltr">
                    {userEmail}
                  </p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  disabled={loggingOut}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-surface-50 disabled:opacity-50"
                  onClick={() => {
                    void handleLogout();
                  }}
                >
                  <LogOut className="size-4" aria-hidden />
                  {loggingOut ? 'جاري تسجيل الخروج…' : 'تسجيل الخروج'}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm"
            aria-label="إغلاق القائمة"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className="absolute inset-y-0 start-0 flex w-[min(88vw,18rem)] flex-col border-e border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] shadow-lg"
            aria-label="القائمة الرئيسية"
          >
            <div className="border-b border-white/10 px-4 py-4">
              <p className="text-sm font-semibold text-white">Madar Home Properties</p>
              <p className="text-xs text-[var(--sidebar-muted)]">Admin Dashboard</p>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-3">
              {groupedNav.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 px-3 text-[0.65rem] font-semibold tracking-[0.14em] text-[var(--sidebar-muted)]">
                    {group.title}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActivePath(pathname, item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                            active
                              ? 'border-s-2 border-accent-500 bg-white/10 text-accent-500'
                              : 'border-s-2 border-transparent text-slate-300 hover:bg-white/5 hover:text-white',
                          )}
                          aria-current={active ? 'page' : undefined}
                        >
                          <Icon className="size-[1.125rem] shrink-0" aria-hidden />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 p-4">
              <Button
                type="button"
                variant="ghost"
                size="small"
                disabled={loggingOut}
                className="w-full justify-start gap-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                onClick={() => {
                  void handleLogout();
                }}
              >
                <LogOut className="size-4" aria-hidden />
                {loggingOut ? 'جاري تسجيل الخروج…' : 'تسجيل الخروج'}
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
