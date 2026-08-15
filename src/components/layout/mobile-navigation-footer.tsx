import Link from 'next/link';
import { getButtonClassName } from '@/components/ui/button';
import { getAppIcon } from '@/config/icons';
import { headerActions } from '@/config/navigation';
import { MobileNavigationLanguage } from './mobile-navigation-language';
import { MobileNavigationSupport } from './mobile-navigation-support';

const PlusIcon = getAppIcon('addProperty');

interface MobileNavigationFooterProps {
  onNavigate: () => void;
}

export function MobileNavigationFooter({
  onNavigate,
}: MobileNavigationFooterProps) {
  return (
    <div
      className="shrink-0 border-t border-surface-100 bg-white px-4 pt-3"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      data-testid="mobile-nav-footer"
    >
      <Link
        href={headerActions.addListing.href}
        className={getButtonClassName({
          variant: 'accent',
          className: 'h-12 w-full rounded-full font-bold',
        })}
        data-testid="mobile-nav-add-listing"
        onClick={onNavigate}
      >
        <PlusIcon className="size-4" aria-hidden />
        {headerActions.addListing.label}
      </Link>
      <div className="mt-1 flex items-center justify-between">
        <MobileNavigationLanguage />
        <MobileNavigationSupport />
      </div>
    </div>
  );
}
