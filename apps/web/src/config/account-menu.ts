import type { AppIconName } from '@/config/icons';
import { routes } from '@/config/routes';

export interface AccountMenuLink {
  id: string;
  label: string;
  href: string;
  icon: AppIconName;
}

export interface AccountMenuSection {
  id: string;
  title: string;
  links: AccountMenuLink[];
}

/** Logged-out activity shortcuts shown in the header account dropdown. */
export const loggedOutAccountMenuLinks: AccountMenuLink[] = [
  {
    id: 'activities',
    label: 'نشاطاتي',
    href: routes.favorites,
    icon: 'activities',
  },
  {
    id: 'favorites',
    label: 'مفضلاتي',
    href: routes.favorites,
    icon: 'favorites',
  },
  {
    id: 'notes',
    label: 'ملاحظاتي',
    href: routes.notes,
    icon: 'notes',
  },
];

/** Logged-in header dropdown sections (ACTIVITY + MANAGEMENT). */
export const loggedInAccountMenuSections: AccountMenuSection[] = [
  {
    id: 'activity',
    title: 'نشاطاتي',
    links: [
      {
        id: 'favorites',
        label: 'مفضلة',
        href: routes.favorites,
        icon: 'favorites',
      },
      {
        id: 'notes',
        label: 'ملاحظاتي',
        href: routes.notes,
        icon: 'notes',
      },
      {
        id: 'notifications',
        label: 'إشعاراتي',
        href: routes.notifications,
        icon: 'notifications',
      },
      {
        id: 'alerts',
        label: 'تنبيهاتي',
        href: routes.alerts,
        icon: 'alerts',
      },
    ],
  },
  {
    id: 'management',
    title: 'إدارة',
    links: [
      {
        id: 'account',
        label: 'حسابي',
        href: routes.account.profile,
        icon: 'accountProfile',
      },
      {
        id: 'valuation',
        label: 'تقييم عقاري',
        href: routes.valuation.root,
        icon: 'valuation',
      },
      {
        id: 'my-properties',
        label: 'عقاراتي',
        href: routes.myProperties,
        icon: 'myProperties',
      },
      {
        id: 'credits',
        label: 'رصيدي',
        href: routes.credits,
        icon: 'credits',
      },
      {
        id: 'recharge',
        label: 'اشحن رصيد',
        href: routes.packages.root,
        icon: 'recharge',
      },
    ],
  },
];
