import type { RefObject } from 'react';
import { BrandLogo } from './brand-logo';
import { getAppIcon } from '@/config/icons';
import { uiLabels } from '@/config/labels';

const CloseIcon = getAppIcon('close');

interface MobileNavigationHeaderProps {
  titleId: string;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

export function MobileNavigationHeader({
  titleId,
  closeButtonRef,
  onClose,
}: MobileNavigationHeaderProps) {
  return (
    <div className="flex h-[4.75rem] shrink-0 items-center justify-between border-b border-surface-100 px-3">
      <BrandLogo />
      <h2 id={titleId} className="sr-only">
        {uiLabels.mobileNav}
      </h2>
      <button
        ref={closeButtonRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-md text-ink-800 transition-colors hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={uiLabels.closeMenu}
        data-testid="mobile-nav-close"
        onClick={onClose}
      >
        <CloseIcon className="size-5" strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
