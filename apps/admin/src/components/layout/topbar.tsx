'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  filterNavByPermissions,
  filterNavByRoles,
  mainNav,
} from '@/config/navigation';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { logoutAction } from '@/features/auth/actions';
import { cn } from '@/lib/utils/cn';
import type { UserRole } from '@/types';

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

interface TopbarProps {
  roles: UserRole[];
}

export function Topbar({ roles }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navItems = filterNavByPermissions(filterNavByRoles(mainNav, roles), roles);

  async function handleLogout() {
    setLoggingOut(true);

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
      <header className="sticky top-0 z-20 flex h-topbar items-center justify-between gap-3 border-b border-border bg-white px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="small"
            className="lg:hidden"
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
          <div className="lg:hidden">
            <p className="text-sm font-semibold text-ink-900">
              {siteConfig.name}
            </p>
          </div>
          <p className="hidden text-sm text-ink-500 lg:block">
            إدارة المنصة العقارية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-md bg-surface-100 px-2.5 py-1 text-xs font-medium text-ink-700 sm:inline">
            ADMIN
          </span>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={loggingOut}
            onClick={() => {
              void handleLogout();
            }}
          >
            {loggingOut ? 'جاري تسجيل الخروج…' : 'تسجيل الخروج'}
          </Button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/40"
            aria-label="إغلاق القائمة"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className="absolute inset-y-0 start-0 w-[min(88vw,18rem)] border-e border-border bg-white p-3 shadow-md"
            aria-label="القائمة الرئيسية"
          >
            <div className="mb-3 border-b border-border px-2 pb-3">
              <p className="text-sm font-semibold text-brand-700">
                {siteConfig.productName}
              </p>
              <p className="text-xs text-ink-500">{siteConfig.name}</p>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-700 hover:bg-surface-50',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
