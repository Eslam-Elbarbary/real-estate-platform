'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

function isActivePath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 start-0 z-30 hidden w-sidebar flex-col border-e border-border bg-white lg:flex">
      <div className="flex h-topbar items-center border-b border-border px-5">
        <Link href="/" className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-700">
            {siteConfig.productName}
          </p>
          <p className="truncate text-xs text-ink-500">{siteConfig.name}</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="القائمة الرئيسية">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const active = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-700 hover:bg-surface-50 hover:text-ink-900',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
