'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
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

const ROLE_LABELS: Partial<Record<UserRole, string>> = {
  SUPER_ADMIN: 'مدير عام',
  ADMIN: 'مدير',
  MODERATOR: 'مشرف',
  DEVELOPER: 'مطور',
  BROKER: 'وسيط',
  USER: 'مستخدم',
};

const ROLE_PRIORITY: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'MODERATOR',
  'DEVELOPER',
  'BROKER',
  'USER',
];

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

function getPrimaryRole(roles: UserRole[]): UserRole | null {
  for (const role of ROLE_PRIORITY) {
    if (roles.includes(role)) {
      return role;
    }
  }

  return roles[0] ?? null;
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

interface SidebarProps {
  roles: UserRole[];
  userName: string;
  userEmail: string;
}

export function Sidebar({ roles, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const navItems = filterNavByPermissions(filterNavByRoles(mainNav, roles), roles);
  const groupedNav = groupNavItems(navItems);
  const primaryRole = getPrimaryRole(roles);

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
    <aside
      className="fixed inset-y-0 start-0 z-30 hidden w-sidebar flex-col border-e border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] shadow-lg lg:flex"
      style={{ backgroundColor: 'var(--sidebar-bg)' }}
    >
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/" className="group block min-w-0">
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-500/20 ring-1 ring-accent-500/40">
              <span className="text-sm font-bold text-accent-500">M</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white transition-colors group-hover:text-accent-500">
                Madar Home Properties
              </p>
              <p className="truncate text-xs text-[var(--sidebar-muted)]">
                Admin Dashboard
              </p>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="القائمة الرئيسية">
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
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      active
                        ? 'border-s-2 border-accent-500 bg-white/10 text-accent-500 shadow-sm'
                        : 'border-s-2 border-transparent text-slate-300 hover:bg-white/5 hover:text-white',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon
                      className={cn(
                        'size-[1.125rem] shrink-0',
                        active ? 'text-accent-500' : 'text-slate-400',
                      )}
                      aria-hidden
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-500/20 text-sm font-semibold text-accent-500 ring-1 ring-accent-500/30">
              {getInitials(userName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{userName}</p>
              {primaryRole ? (
                <span className="mt-1 inline-flex rounded-full bg-accent-500/15 px-2 py-0.5 text-[0.65rem] font-medium text-accent-500 ring-1 ring-accent-500/25">
                  {ROLE_LABELS[primaryRole] ?? primaryRole}
                </span>
              ) : null}
            </div>
          </div>
          {userEmail ? (
            <p className="mt-2 truncate text-xs text-[var(--sidebar-muted)]" dir="ltr">
              {userEmail}
            </p>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="small"
            disabled={loggingOut}
            className="mt-3 w-full justify-start gap-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => {
              void handleLogout();
            }}
          >
            <LogOut className="size-4" aria-hidden />
            {loggingOut ? 'جاري تسجيل الخروج…' : 'تسجيل الخروج'}
          </Button>
        </div>
      </div>
    </aside>
  );
}
