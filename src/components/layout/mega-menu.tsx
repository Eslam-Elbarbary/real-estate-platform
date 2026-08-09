'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getAppIcon, ICON_SIZE_NAV } from '@/config/icons';
import type { MegaMenuDefinition } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';

interface MegaMenuProps {
  menu: MegaMenuDefinition;
  id: string;
  onNavigate?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MegaMenu({
  menu,
  id,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  return (
    <div
      id={id}
      role="region"
      data-mega-menu-panel="true"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="w-full border-b border-border bg-white shadow-[0_12px_28px_rgb(0_0_0_/0.1)]"
    >
      {/* Invisible bridge so pointer can move from nav into panel without flicker */}
      <div className="absolute inset-x-0 -top-2 h-2" aria-hidden />

      <Container className="py-5 lg:py-6">
        {menu.variant === 'columns' ? (
          <div className="grid grid-cols-2 gap-0 lg:grid-cols-4">
            {(menu.columns ?? []).map((column, columnIndex) => (
              <div
                key={`col-${columnIndex}`}
                className={cn(
                  'px-3 py-1 lg:px-5',
                  columnIndex > 0 && 'lg:border-s lg:border-border',
                )}
              >
                {column.title ? (
                  <p className="mb-2 text-xs font-semibold text-ink-500">
                    {column.title}
                  </p>
                ) : null}
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className="block text-[13px] font-medium text-ink-800 transition-colors hover:text-brand-600"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-0 md:grid-cols-2 lg:grid-cols-3">
            {(menu.featureColumns ?? []).map((column, columnIndex) => (
              <div
                key={`feature-col-${columnIndex}`}
                className={cn(
                  'space-y-4 px-3 py-1 lg:px-5',
                  columnIndex > 0 && 'lg:border-s lg:border-border',
                )}
              >
                {column.map((feature) => {
                  const Icon = getAppIcon(feature.icon);
                  return (
                    <Link
                      key={`${feature.href}-${feature.title}`}
                      href={feature.href}
                      onClick={onNavigate}
                      className="group flex items-start gap-3 rounded-md p-1 transition-colors hover:bg-surface-50"
                    >
                      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center text-accent-500">
                        <Icon
                          size={ICON_SIZE_NAV}
                          strokeWidth={1.75}
                          aria-hidden
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-ink-900 group-hover:text-brand-700">
                          {feature.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-5 text-ink-500">
                          {feature.description}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
