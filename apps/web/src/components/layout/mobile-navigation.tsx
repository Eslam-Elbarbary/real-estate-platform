'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { getAppIcon } from '@/config/icons';
import { headerActions } from '@/config/navigation';
import { uiLabels } from '@/config/labels';
import { useHeaderOverlay } from './header-overlay';
import { MobileNavigationDrawer } from './mobile-navigation-drawer';

const PlusIcon = getAppIcon('addProperty');

export function MobileNavigation() {
  const { overlay, openNav, close } = useHeaderOverlay();
  const open = overlay === 'nav';
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  if (!open && openGroupId !== null) {
    setOpenGroupId(null);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      (previouslyFocused.current ?? trigger)?.focus();
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
        ref={triggerRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-md text-ink-700 transition-colors hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={uiLabels.openMenu}
        aria-expanded={open}
        aria-controls="mobile-main-navigation"
        data-testid="mobile-nav-trigger"
        onClick={() => (open ? close() : openNav())}
      >
        <Menu className="size-5" />
      </button>

      {open ? (
        <MobileNavOverlay
          openGroupId={openGroupId}
          onOpenGroupIdChange={setOpenGroupId}
          onClose={close}
        />
      ) : null}
    </div>
  );
}

function MobileNavOverlay({
  openGroupId,
  onOpenGroupIdChange,
  onClose,
}: {
  openGroupId: string | null;
  onOpenGroupIdChange: (id: string | null) => void;
  onClose: () => void;
}) {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] lg:hidden">
      <button
        type="button"
        aria-label={uiLabels.closeMenu}
        data-testid="mobile-nav-backdrop"
        className="mobile-nav-backdrop absolute inset-0 z-[90] bg-black/55"
        onClick={onClose}
      />
      <MobileNavigationDrawer
        openGroupId={openGroupId}
        onOpenGroupIdChange={onOpenGroupIdChange}
        onClose={onClose}
      />
    </div>,
    document.body,
  );
}
