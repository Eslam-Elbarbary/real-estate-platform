import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { uiLabels } from '@/config/labels';
import type { AuthSession } from '@/features/auth/types';
import { MobileAccountContent } from './mobile-account-content';
import { MobileAccountHeader } from './mobile-account-header';

interface MobileAccountDrawerProps {
  session: AuthSession | null;
  pending: boolean;
  onLogout: () => void;
  onClose: () => void;
}

function getFocusable(root: HTMLElement) {
  return [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
}

export function MobileAccountDrawer({
  session,
  pending,
  onLogout,
  onClose,
}: MobileAccountDrawerProps) {
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
  }, [onClose]);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] lg:hidden">
      <button
        type="button"
        aria-label={uiLabels.closeMenu}
        data-testid="mobile-account-backdrop"
        className="mobile-nav-backdrop absolute inset-0 z-[90] bg-black/50"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        id="mobile-account-navigation"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="mobile-account-drawer"
        className="mobile-account-drawer absolute inset-y-0 end-0 top-0 z-[100] flex flex-col overflow-hidden bg-white"
      >
        <MobileAccountHeader
          titleId={titleId}
          session={session}
          closeButtonRef={closeButtonRef}
          onClose={onClose}
          onNavigate={onClose}
        />
        <MobileAccountContent
          session={session}
          pending={pending}
          onLogout={onLogout}
          onNavigate={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}
