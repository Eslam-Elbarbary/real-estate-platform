import Link from 'next/link';
import { createElement, type ReactNode } from 'react';
import { Container } from '@/components/ui/container';
import { getAppIcon, type AppIconName } from '@/config/icons';
import { cn } from '@/lib/utils/cn';
import { activityCopy } from '../copy';

interface ActivityNavItem {
  id: string;
  label: string;
  href: string;
  icon: AppIconName;
  active?: boolean;
}

interface ActivityShellProps {
  children: ReactNode;
  navItems: ActivityNavItem[];
  sectionTitle: string;
}

export function ActivityShell({
  children,
  navItems,
  sectionTitle,
}: ActivityShellProps) {
  return (
    <div className="bg-white pb-16">
      <Container dashboard className="space-y-6 py-8 sm:py-10">
        <h1 className="text-3xl font-extrabold text-ink-950">
          {activityCopy.activityTitle}
        </h1>

        <nav aria-label="نشاطاتي" className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = getAppIcon(item.icon);
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors',
                  item.active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-600 hover:bg-surface-50 hover:text-ink-900',
                )}
              >
                {createElement(Icon, { size: 16, 'aria-hidden': true })}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <h2 className="text-xl font-extrabold text-ink-950">{sectionTitle}</h2>
        {children}
      </Container>
    </div>
  );
}
