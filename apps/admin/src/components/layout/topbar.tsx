'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { mainNav } from '@/config/navigation';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Topbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <Link
            href={routes.login}
            className={cn(
              'inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-xs font-medium text-ink-900 transition-colors',
              'hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
            )}
          >
            تسجيل الدخول
          </Link>
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
              {mainNav.map((item) => {
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
