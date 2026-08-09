import Link from 'next/link';
import type { ReactNode } from 'react';
import { getButtonClassName } from '@/components/ui/button';
import { getAppIcon, ICON_SIZE_NAV } from '@/config/icons';
import { headerActions } from '@/config/navigation';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import { EgyptFlag } from './egypt-flag';

const AddPropertyIcon = getAppIcon('addProperty');
const SupportIcon = getAppIcon('support');
const ChevronIcon = getAppIcon('chevronDown');

interface HeaderActionsProps {
  accountSlot: ReactNode;
}

export function HeaderActions({ accountSlot }: HeaderActionsProps) {
  return (
    <div className="hidden items-center gap-1.5 lg:flex">
      <Link
        href={headerActions.addListing.href}
        className={getButtonClassName({
          variant: 'accent',
          size: 'small',
          className: 'me-1 font-bold',
        })}
      >
        <AddPropertyIcon className="size-3.5" strokeWidth={2} aria-hidden />
        {headerActions.addListing.label}
      </Link>

      <button
        type="button"
        className={cn(
          'inline-flex h-9 items-center gap-1 rounded-md px-2 text-xs font-semibold text-ink-700 transition-colors',
          'hover:bg-surface-50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        )}
        aria-label={uiLabels.languageSwitchAria}
        title={uiLabels.languageSwitchAria}
      >
        <EgyptFlag />
        <span>{uiLabels.languageCode}</span>
        <ChevronIcon size={14} strokeWidth={2} aria-hidden />
      </button>

      <Link
        href={headerActions.support.href}
        className={cn(
          'inline-flex size-9 items-center justify-center rounded-md text-ink-700 transition-colors',
          'hover:bg-surface-50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        )}
        aria-label={headerActions.support.label}
      >
        <SupportIcon size={ICON_SIZE_NAV} strokeWidth={1.75} aria-hidden />
      </Link>

      {accountSlot}
    </div>
  );
}
