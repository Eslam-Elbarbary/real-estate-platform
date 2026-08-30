export const routes = {
  home: '/',
  login: '/login',
  users: {
    root: '/users',
    details: (id: string) => `/users/${id}`,
  },
  properties: {
    root: '/properties',
    details: (id: string) => `/properties/${id}`,
    pending: '/properties?status=pending',
  },
  plans: {
    root: '/plans',
    details: (id: string) => `/plans/${id}`,
  },
  payments: {
    root: '/payments',
    details: (id: string) => `/payments/${id}`,
  },
  developers: {
    root: '/developers',
    details: (id: string) => `/developers/${id}`,
  },
  compounds: {
    root: '/compounds',
    details: (id: string) => `/compounds/${id}`,
  },
} as const;
