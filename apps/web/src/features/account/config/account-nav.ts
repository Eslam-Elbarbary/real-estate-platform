import type { AppIconName } from '@/config/icons';
import { routes } from '@/config/routes';
import type { AccountNavId } from '../types';

export interface AccountNavItem {
  id: AccountNavId;
  label: string;
  href: string;
  icon: AppIconName;
}

export const accountCopy = {
  pageTitle: 'حسابي',
  profileTitle: 'بيانات الحساب',
  securityTitle: 'الخصوصية والأمان',
  paymentMethodsTitle: 'البطاقات المحفوظة',
  paymentMethodsSubtitle: 'يمكنك إضافة حتى 3 بطاقات دفع خاصة بك',
  walletTitle: 'المحفظة',
  subscriptionTitle: 'خطة الاشتراك',
  contactsTitle: 'إدارة جهات اتصالك',
  contactsDescription:
    'تحكم في أرقام الهاتف التي يراها المستخدمون على إعلاناتك',
  adNumbersHeading: 'أرقام الإعلانات',
  add: 'أضف',
  save: 'حفظ',
  cancel: 'إلغاء',
  edit: 'تعديل',
  emailLabel: 'البريد الإلكتروني',
  passwordLabel: 'كلمة المرور',
  phoneLabel: 'رقم الهاتف',
  passwordMasked: '********',
  whatsappToggleLabel: 'يوجد واتساب على هذا الرقم',
  addPhoneTitle: 'إضافة رقم هاتف',
  countryPrefix: '+20',
  logoutAllTitle: 'تسجيل الخروج من جميع الأجهزة',
  logoutAllDescription:
    'سيتم تسجيل خروجك من جميع الأجهزة والجهاز الحالي.',
  logoutAllConfirm: 'تأكيد تسجيل الخروج',
  paymentEmptyTitle:
    'ليس لديك بطاقات ائتمان محفوظة. اضف بطاقات لسهولة الدفع',
  walletEmptyTitle: 'لا يوجد معاملات',
  walletCta: 'أضف رصيد الآن',
  subscriptionEmptyTitle: 'ليس لديك أي اشتراكات',
  subscriptionCta: 'اشترك الآن',
  deletePhone: 'حذف الرقم',
  maxCardsHint: 'يمكنك حفظ حتى 3 بطاقات للعرض التجريبي فقط.',
  demoCardTitle: 'إضافة بطاقة (تجريبي)',
  demoCardNickname: 'اسم البطاقة',
  demoNoGateway:
    'هذه إضافة تجريبية فقط — لا يتم حفظ بيانات بطاقة حقيقية.',
} as const;

export const accountNavItems: AccountNavItem[] = [
  {
    id: 'profile',
    label: 'بيانات الحساب',
    href: routes.account.profile,
    icon: 'accountProfile',
  },
  {
    id: 'security',
    label: 'الخصوصية والأمان',
    href: routes.account.security,
    icon: 'accountSecurity',
  },
  {
    id: 'payment-methods',
    label: 'البطاقات المحفوظة',
    href: routes.account.paymentMethods,
    icon: 'accountCards',
  },
  {
    id: 'wallet',
    label: 'المحفظة',
    href: routes.account.wallet,
    icon: 'accountWallet',
  },
  {
    id: 'subscription',
    label: 'خطة الاشتراك',
    href: routes.account.subscription,
    icon: 'accountSubscription',
  },
  {
    id: 'contacts',
    label: 'إدارة جهات اتصالك',
    href: routes.account.contacts,
    icon: 'accountContacts',
  },
];
