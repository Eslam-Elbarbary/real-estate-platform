import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CreditCard,
  Home,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Package,
  Users,
} from 'lucide-react';
import {
  hasAnyPermission,
  type AdminPermission,
} from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import { routes } from './routes';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  allowedRoles?: UserRole[];
  allowedPermissions?: AdminPermission[];
}

export const mainNav: NavItem[] = [
  {
    label: 'نظرة عامة',
    href: routes.home,
    icon: LayoutDashboard,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
    allowedPermissions: ['dashboard.view'],
  },
  {
    label: 'المستخدمون',
    href: routes.users.root,
    icon: Users,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    allowedPermissions: ['users.view'],
  },
  {
    label: 'العقارات',
    href: routes.properties.root,
    icon: Home,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
    allowedPermissions: ['properties.view'],
  },
  {
    label: 'العملاء المحتملون',
    href: routes.leads.root,
    icon: MessageSquare,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
    allowedPermissions: ['leads.view'],
  },
  {
    label: 'الخطط',
    href: routes.plans.root,
    icon: Package,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    allowedPermissions: ['plans.view'],
  },
  {
    label: 'المدفوعات',
    href: routes.payments.root,
    icon: CreditCard,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    allowedPermissions: ['payments.view'],
  },
  {
    label: 'المطورون',
    href: routes.developers.root,
    icon: Building2,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    allowedPermissions: ['developers.view'],
  },
  {
    label: 'المشاريع',
    href: routes.compounds.root,
    icon: Layers,
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    allowedPermissions: ['compounds.view'],
  },
];

export function filterNavByRoles(
  items: NavItem[],
  roles: UserRole[],
): NavItem[] {
  return items.filter((item) => {
    if (!item.allowedRoles?.length) {
      return true;
    }

    return item.allowedRoles.some((role) => roles.includes(role));
  });
}

export function filterNavByPermissions(
  items: NavItem[],
  roles: UserRole[],
): NavItem[] {
  return items.filter((item) => {
    if (!item.allowedPermissions?.length) {
      return true;
    }

    return hasAnyPermission(roles, item.allowedPermissions);
  });
}
