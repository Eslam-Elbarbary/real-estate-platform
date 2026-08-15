import { getAppIcon, ICON_SIZE_NAV } from '@/config/icons';
import type { MobileDrawerGroup } from '@/config/navigation';
import { cn } from '@/lib/utils/cn';
import { MobileNavigationSubmenu } from './mobile-navigation-submenu';

const ChevronIcon = getAppIcon('chevronDown');
const SaleIcon = getAppIcon('sale');
const RentIcon = getAppIcon('rent');
const CompoundsIcon = getAppIcon('compounds');
const KnowIcon = getAppIcon('know');

const groupIcons = {
  sale: SaleIcon,
  rent: RentIcon,
  compounds: CompoundsIcon,
  know: KnowIcon,
} as const;

interface MobileNavigationGroupProps {
  group: MobileDrawerGroup;
  open: boolean;
  active: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

export function MobileNavigationGroup({
  group,
  open,
  active,
  onToggle,
  onNavigate,
}: MobileNavigationGroupProps) {
  const Icon = groupIcons[group.id as keyof typeof groupIcons] ?? SaleIcon;
  const panelId = `mobile-nav-panel-${group.id}`;

  return (
    <div>
      <button
        type="button"
        className={cn(
          'flex min-h-[3.75rem] w-full items-center gap-3 border-b border-surface-100 px-5 text-ink-900',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500',
          open && 'bg-white font-semibold ring-1 ring-inset ring-surface-200',
          !open && 'font-medium',
          active && !open && 'text-ink-950',
        )}
        aria-expanded={open}
        aria-controls={panelId}
        data-testid={`mobile-nav-group-${group.id}`}
        onClick={onToggle}
      >
        <Icon
          size={ICON_SIZE_NAV}
          strokeWidth={1.75}
          className="shrink-0 text-ink-800"
          aria-hidden
        />
        <span className="min-w-0 flex-1 text-start text-[0.975rem]">{group.label}</span>
        <ChevronIcon
          size={18}
          strokeWidth={1.75}
          className={cn(
            'shrink-0 text-ink-700 transition-transform duration-200',
            open && 'rotate-180',
            'motion-reduce:transition-none',
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <MobileNavigationSubmenu
          id={panelId}
          links={group.links}
          onNavigate={onNavigate}
        />
      ) : null}
    </div>
  );
}
