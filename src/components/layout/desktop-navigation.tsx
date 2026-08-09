'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { getAppIcon, ICON_SIZE_NAV } from '@/config/icons';
import { uiLabels } from '@/config/labels';
import { primaryNavigation } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';
import { MegaMenu } from './mega-menu';

const CLOSE_DELAY_MS = 140;

interface DesktopNavigationProps {
  portalRoot: HTMLElement | null;
}

export function DesktopNavigation({ portalRoot }: DesktopNavigationProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const baseId = useId();

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setOpenId(null);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const openMenu = useCallback(
    (id: string) => {
      clearCloseTimer();
      setOpenId(id);
    },
    [clearCloseTimer],
  );

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setOpenId(null);
  }, [clearCloseTimer]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      const inNav = rootRef.current?.contains(target);
      const inPanel = (target as HTMLElement).closest?.(
        '[data-mega-menu-panel="true"]',
      );
      if (!inNav && !inPanel) {
        closeMenu();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
      clearCloseTimer();
    };
  }, [clearCloseTimer, closeMenu]);

  const openItem = primaryNavigation.find((item) => item.id === openId);

  return (
    <>
      <nav
        ref={rootRef}
        className="hidden items-center gap-1 lg:flex"
        aria-label={uiLabels.primaryNav}
        onMouseLeave={scheduleClose}
      >
        {primaryNavigation.map((item) => {
          const Icon = getAppIcon(item.icon);
          const isOpen = openId === item.id;
          const menuId = `${baseId}-${item.id}-menu`;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                isOpen
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-ink-700 hover:bg-surface-50 hover:text-ink-950',
              )}
              aria-expanded={item.megaMenu ? isOpen : undefined}
              aria-haspopup={item.megaMenu ? 'true' : undefined}
              aria-controls={item.megaMenu ? menuId : undefined}
              onMouseEnter={() => {
                if (item.megaMenu) {
                  openMenu(item.id);
                } else {
                  closeMenu();
                }
              }}
              onFocus={() => {
                if (item.megaMenu) {
                  openMenu(item.id);
                }
              }}
              onClick={(event) => {
                if (!item.megaMenu) {
                  return;
                }

                if (openId !== item.id) {
                  event.preventDefault();
                  openMenu(item.id);
                }
              }}
            >
              <Icon
                size={ICON_SIZE_NAV}
                strokeWidth={1.75}
                className="shrink-0"
                aria-hidden
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {openItem?.megaMenu && portalRoot
        ? createPortal(
            <MegaMenu
              id={`${baseId}-${openItem.id}-menu`}
              menu={openItem.megaMenu}
              onNavigate={closeMenu}
              onMouseEnter={() => openMenu(openItem.id)}
              onMouseLeave={scheduleClose}
            />,
            portalRoot,
          )
        : null}
    </>
  );
}
