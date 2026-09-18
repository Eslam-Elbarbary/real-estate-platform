import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CreditCard,
  Home,
  Image,
  Layers,
  LayoutDashboard,
  Library,
  MessageSquare,
  Package,
  PanelsTopLeft,
  Settings,
  Shield,
  Sparkles,
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

export interface NavGroup {
  title: string;
  hrefs: readonly string[];
}

export const mainNav: NavItem[] = [
  {
    label: 'نظرة عامة',
    href: routes.home,
    icon: LayoutDashboard,
    permission: 'dashboard.view',
  },
  {
    label: 'العقارات',
    href: routes.properties.root,
    icon: Home,
    permission: 'properties.view',
  },
  {
    label: 'المشاريع والكمبوندات',
    href: routes.compounds.root,
    icon: Layers,
    permission: 'compounds.view',
  },
  {
    label: 'المطورون',
    href: routes.developers.root,
    icon: Building2,
    permission: 'developers.view',
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
    label: 'الوسائط',
    href: routes.media.root,
    icon: Image,
    permission: 'media.view',
  },
  {
    label: 'الكتالوجات',
    href: routes.catalogs.root,
    icon: Library,
    permission: 'catalogs.view',
  },
  {
    label: 'المميزات',
    href: routes.features.root,
    icon: Sparkles,
    permission: 'features.view',
  },
  {
    label: 'البنرات',
    href: routes.banners.root,
    icon: PanelsTopLeft,
    permission: 'banners.view',
  },
  {
    label: 'المستخدمون',
    href: routes.users.root,
    icon: Users,
    permission: 'users.view',
  },
  {
    label: 'الأدوار والصلاحيات',
    href: routes.roles.root,
    icon: Shield,
    permission: 'roles.view',
  },
  {
    label: 'إعدادات الموقع',
    href: routes.settings.root,
    icon: Settings,
    permission: 'settings.view',
  },
];

export const navGroups: NavGroup[] = [
  {
    title: 'الرئيسية',
    hrefs: [routes.home],
  },
  {
    title: 'السوق',
    hrefs: [
      routes.properties.root,
      routes.compounds.root,
      routes.developers.root,
    ],
  },
  {
    title: 'CRM',
    hrefs: [routes.leads.root],
  },
  {
    title: 'الأعمال',
    hrefs: [routes.plans.root, routes.payments.root],
  },
  {
    title: 'المحتوى',
    hrefs: [
      routes.media.root,
      routes.catalogs.root,
      routes.features.root,
      routes.banners.root,
    ],
  },
  {
    title: 'النظام',
    hrefs: [routes.users.root, routes.roles.root, routes.settings.root],
  },
];

export function filterNavByPermissions(
  items: NavItem[],
  permissions: string[],
): NavItem[] {
  return items.filter((item) => hasPermission(permissions, item.permission));
}

export function groupNavItems(items: NavItem[]) {
  return navGroups
    .map((group) => ({
      title: group.title,
      items: group.hrefs
        .map((href) => items.find((item) => item.href === href))
        .filter((item): item is NavItem => Boolean(item)),
    }))
    .filter((group) => group.items.length > 0);
}

export function isActiveNavPath(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
