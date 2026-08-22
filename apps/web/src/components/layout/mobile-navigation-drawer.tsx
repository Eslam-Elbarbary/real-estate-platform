import { useEffect, useId, useRef } from 'react';
import { uiLabels } from '@/config/labels';
import { MobileNavigationAccordion } from './mobile-navigation-accordion';
import { MobileNavigationFooter } from './mobile-navigation-footer';
import { MobileNavigationHeader } from './mobile-navigation-header';

interface MobileNavigationDrawerProps {
  openGroupId: string | null;
  onOpenGroupIdChange: (id: string | null) => void;
  onClose: () => void;
}

function getFocusable(root: HTMLElement) {
  return [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
}

export function MobileNavigationDrawer({
  openGroupId,
  onOpenGroupIdChange,
  onClose,
}: MobileNavigationDrawerProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }
      const focusable = getFocusable(panelRef.current);
      if (focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, openGroupId]);

  return (
    <div
      ref={panelRef}
      id="mobile-main-navigation"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-testid="mobile-nav-drawer"
      className="mobile-nav-drawer absolute inset-y-0 end-0 top-0 z-[100] flex flex-col overflow-hidden bg-white pt-[env(safe-area-inset-top)]"
    >
      <MobileNavigationHeader
        titleId={titleId}
        closeButtonRef={closeButtonRef}
        onClose={onClose}
      />
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        data-testid="mobile-nav-scroll"
      >
        <MobileNavigationAccordion
          openGroupId={openGroupId}
          onOpenGroupIdChange={onOpenGroupIdChange}
          onNavigate={onClose}
        />
      </div>
      <MobileNavigationFooter onNavigate={onClose} />
      <span className="sr-only">{uiLabels.mobileNav}</span>
    </div>
  );
}
