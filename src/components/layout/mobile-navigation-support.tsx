import { getAppIcon, ICON_SIZE_NAV } from '@/config/icons';
import { headerActions } from '@/config/navigation';

const SupportIcon = getAppIcon('support');

export function MobileNavigationSupport() {
  return (
    <a
      href={headerActions.support.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex size-11 items-center justify-center rounded-md text-ink-800 transition-colors hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label={headerActions.support.label}
      data-testid="mobile-nav-support"
    >
      <SupportIcon size={ICON_SIZE_NAV} strokeWidth={1.75} aria-hidden />
    </a>
  );
}
