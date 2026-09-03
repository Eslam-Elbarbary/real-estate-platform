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
  leads: {
    root: '/leads',
    details: (id: string) => `/leads/${id}`,
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
} as const;
