import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CreditCard,
  Home,
  Image,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Package,
  Shield,
  Users,
} from 'lucide-react';
import { hasPermission } from '@/features/auth/permissions';
import { routes } from './routes';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission: string;
}

export const mainNav: NavItem[] = [
  {
    label: 'نظرة عامة',
    href: routes.home,
    icon: LayoutDashboard,
    permission: 'dashboard.view',
  },
  {
    label: 'المستخدمون',
    href: routes.users.root,
    icon: Users,
    permission: 'users.view',
  },
  {
    label: 'الأدوار',
    href: routes.roles.root,
    icon: Shield,
    permission: 'roles.view',
  },
  {
    label: 'العقارات',
    href: routes.properties.root,
    icon: Home,
    permission: 'properties.view',
  },
  {
    label: 'العملاء المحتملون',
    href: routes.leads.root,
    icon: MessageSquare,
    permission: 'leads.view',
  },
  {
    label: 'الخطط',
    href: routes.plans.root,
    icon: Package,
    permission: 'plans.view',
  },
  {
    label: 'المدفوعات',
    href: routes.payments.root,
    icon: CreditCard,
    permission: 'payments.view',
  },
  {
    label: 'المطورون',
    href: routes.developers.root,
    icon: Building2,
    permission: 'developers.view',
  },
  {
    label: 'المشاريع',
    href: routes.compounds.root,
    icon: Layers,
    permission: 'compounds.view',
  },
  {
    label: 'الوسائط',
    href: routes.media.root,
    icon: Image,
    permission: 'media.view',
  },
];

export function filterNavByPermissions(
  items: NavItem[],
  permissions: string[],
): NavItem[] {
  return items.filter((item) => hasPermission(permissions, item.permission));
}
