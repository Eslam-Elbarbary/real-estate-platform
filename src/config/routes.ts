import type { PropertyType, TransactionType } from '@/types';

export const routes = {
  home: '/',
  properties: {
    root: (transaction: TransactionType) => `/properties/${transaction}`,
    byType: (transaction: TransactionType, propertyType: PropertyType) =>
      `/properties/${transaction}/${propertyType}`,
    byLocation: (
      transaction: TransactionType,
      propertyType: PropertyType,
      locationSlugs: string[],
    ) =>
      `/properties/${transaction}/${propertyType}/${locationSlugs.join('/')}`,
  },
  listing: (id: string, slug: string) => `/listing/${id}/${slug}`,
  compounds: {
    root: '/compounds',
    byLocation: (locationSlugs: string[]) =>
      `/compounds/${locationSlugs.join('/')}`,
    details: (slug: string) => `/compound/${slug}`,
  },
  developer: (slug: string) => `/developer/${slug}`,
  neighborhood: {
    root: '/neighborhood',
    byLocation: (locationSlugs: string[]) =>
      `/neighborhood/${locationSlugs.join('/')}`,
  },
  advice: {
    root: '/advice',
    category: (category: string) => `/advice/${category}`,
    article: (slug: string) => `/advice/${slug}`,
  },
  addListing: '/add-listing',
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verifyEmail: '/auth/verify-email',
  },
  /** @deprecated Prefer routes.auth.login */
  login: '/auth/login',
  /** @deprecated Prefer routes.auth.register */
  register: '/auth/register',
  favorites: '/favorites',
  valuation: {
    root: '/valuation',
    add: '/valuation/add',
    report: (id: string) => `/valuation/report/${id}`,
  },
} as const;
