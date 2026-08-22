import { usePathname } from 'next/navigation';
import { getMobileDrawerGroups } from '@/config/navigation';
import { uiLabels } from '@/config/labels';
import { MobileNavigationGroup } from './mobile-navigation-group';

const groups = getMobileDrawerGroups();

interface MobileNavigationAccordionProps {
  openGroupId: string | null;
  onOpenGroupIdChange: (id: string | null) => void;
  onNavigate: () => void;
}

function isGroupActive(groupId: string, pathname: string) {
  if (groupId === 'sale') return pathname.startsWith('/properties/sale');
  if (groupId === 'rent') return pathname.startsWith('/properties/rent');
  if (groupId === 'compounds') return pathname.startsWith('/compounds');
  if (groupId === 'know') {
    return (
      pathname.startsWith('/advice') ||
      pathname.startsWith('/valuation') ||
      pathname.startsWith('/neighborhood') ||
      pathname.startsWith('/market-index')
    );
  }
  return false;
}

export function MobileNavigationAccordion({
  openGroupId,
  onOpenGroupIdChange,
  onNavigate,
}: MobileNavigationAccordionProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={uiLabels.primaryNav} data-testid="mobile-nav-accordion">
      {groups.map((group) => (
        <MobileNavigationGroup
          key={group.id}
          group={group}
          open={openGroupId === group.id}
          active={isGroupActive(group.id, pathname)}
          onToggle={() =>
            onOpenGroupIdChange(openGroupId === group.id ? null : group.id)
          }
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
