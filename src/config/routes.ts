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
    details: (...segments: string[]) =>
      `/neighborhood/${segments.filter(Boolean).join('/')}`,
    bySlug: (slug: string) => `/neighborhood/${slug}`,
    byLocation: (locationSlugs: string[]) =>
      `/neighborhood/${locationSlugs.join('/')}`,
  },
  advice: {
    root: '/advice',
    ask: {
      root: '/advice/ask',
      question: (id: string, slug: string) => `/advice/ask/${id}/${slug}`,
    },
    category: (category: string) => `/advice/${category}`,
    article: (slug: string) => `/advice/${slug}`,
  },
  addListing: '/add-property',
  addProperty: {
    root: '/add-property',
    step: (
      id: string,
      step:
        | 'basic'
        | 'details'
        | 'price'
        | 'description'
        | 'media'
        | 'publish'
        | 'checkout',
    ) => `/my-properties/${id}/${step}`,
    resume: (
      id: string,
      step:
        | 'basic'
        | 'details'
        | 'price'
        | 'description'
        | 'media'
        | 'publish',
    ) => `/my-properties/${id}/${step}`,
  },
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verifyEmail: '/auth/verify-email',
    /** Register with post-auth return destination. */
    registerWithReturnTo: (returnTo: string) =>
      `/auth/register?returnTo=${encodeURIComponent(returnTo)}`,
    loginWithReturnTo: (returnTo: string) =>
      `/auth/login?returnTo=${encodeURIComponent(returnTo)}`,
  },
  /** @deprecated Prefer routes.auth.login */
  login: '/auth/login',
  /** @deprecated Prefer routes.auth.register */
  register: '/auth/register',
  favorites: '/favorites',
  notes: '/notes',
  notifications: '/notifications',
  alerts: '/alerts',
  account: {
    root: '/account',
    profile: '/account/profile',
    security: '/account/security',
    paymentMethods: '/account/payment-methods',
    wallet: '/account/wallet',
    subscription: '/account/subscription',
    contacts: '/account/contacts',
  },
  credits: '/credits',
  packages: {
    root: '/packages',
    owner: '/packages/owner',
    marketer: '/packages/marketer',
    marketingCompany: '/packages/marketing-company',
    compoundDeveloper: '/packages/compound-developer',
  },
  myProperties: '/my-properties',
  marketingServices: '/marketing-services',
  pro: {
    root: '/pro',
    checkout: '/pro/checkout',
  },
  valuation: {
    root: '/valuation',
    add: '/valuation/add',
    /** Dashboard portfolio tab */
    portfolio: '/valuation?tab=portfolio',
    addWithGoal: (goal: 'owned-property' | 'price-inquiry') =>
      `/valuation/add?goal=${goal}`,
    report: (id: string) => `/valuation/report/${id}`,
  },
} as const;
