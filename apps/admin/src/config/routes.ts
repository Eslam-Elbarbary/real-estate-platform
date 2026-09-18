export const routes = {
  home: '/',
  login: '/login',
  forbidden: '/forbidden',
  users: {
    root: '/users',
    details: (id: string) => `/users/${id}`,
  },
  roles: {
    root: '/roles',
    details: (id: string) => `/roles/${id}`,
  },
  properties: {
    root: '/properties',
    details: (id: string) => `/properties/${id}`,
    create: '/properties/create',
    edit: (id: string) => `/properties/${id}/edit`,
    pending: '/properties?status=PENDING_REVIEW',
  },
  catalogs: {
    root: '/catalogs',
    propertyTypes: '/catalogs/property-types',
    transactionTypes: '/catalogs/transaction-types',
    features: '/catalogs/features',
    views: '/catalogs/views',
    legalStatuses: '/catalogs/legal-statuses',
    finishingTypes: '/catalogs/finishing-types',
  },
  features: {
    root: '/features',
  },
  plans: {
    root: '/plans',
    details: (id: string) => `/plans/${id}`,
  },
  payments: {
    root: '/payments',
    details: (id: string) => `/payments/${id}`,
    pending: '/payments?status=PENDING',
  },
  leads: {
    root: '/leads',
    details: (id: string) => `/leads/${id}`,
    new: '/leads?status=NEW',
  },
  developers: {
    root: '/developers',
    details: (id: string) => `/developers/${id}`,
  },
  compounds: {
    root: '/compounds',
    details: (id: string) => `/compounds/${id}`,
  },
  media: {
    root: '/media',
  },
  banners: {
    root: '/banners',
  },
  settings: {
    root: '/settings',
  },
} as const;
