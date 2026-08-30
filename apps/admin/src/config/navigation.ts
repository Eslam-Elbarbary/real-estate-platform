import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  CreditCard,
  Home,
  Layers,
  LayoutDashboard,
  Package,
  Users,
} from 'lucide-react';
import { routes } from './routes';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const mainNav: NavItem[] = [
  {
    label: 'نظرة عامة',
    href: routes.home,
    icon: LayoutDashboard,
  },
  {
    label: 'المستخدمون',
    href: routes.users.root,
    icon: Users,
  },
  {
    label: 'العقارات',
    href: routes.properties.root,
    icon: Home,
  },
  {
    label: 'الخطط',
    href: routes.plans.root,
    icon: Package,
  },
  {
    label: 'المدفوعات',
    href: routes.payments.root,
    icon: CreditCard,
  },
  {
    label: 'المطورون',
    href: routes.developers.root,
    icon: Building2,
  },
  {
    label: 'المشاريع',
    href: routes.compounds.root,
    icon: Layers,
  },
];
