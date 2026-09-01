import type { UserRole } from '@/types';

export type AdminPermission =
  // Dashboard
  | 'dashboard.view'
  // Users
  | 'users.view'
  | 'users.update_status'
  // Properties
  | 'properties.view'
  | 'properties.create'
  | 'properties.update'
  | 'properties.approve'
  | 'properties.reject'
  | 'properties.archive'
  // Leads
  | 'leads.view'
  | 'leads.update_status'
  // Plans
  | 'plans.view'
  | 'plans.create'
  | 'plans.update'
  // Payments
  | 'payments.view'
  // Developers
  | 'developers.view'
  | 'developers.create'
  | 'developers.update'
  // Compounds
  | 'compounds.view'
  | 'compounds.create'
  | 'compounds.update'
  // Media
  | 'media.view'
  | 'media.upload'
  | 'media.delete';

const ALL_PERMISSIONS: AdminPermission[] = [
  'dashboard.view',
  'users.view',
  'users.update_status',
  'properties.view',
  'properties.create',
  'properties.update',
  'properties.approve',
  'properties.reject',
  'properties.archive',
  'leads.view',
  'leads.update_status',
  'plans.view',
  'plans.create',
  'plans.update',
  'payments.view',
  'developers.view',
  'developers.create',
  'developers.update',
  'compounds.view',
  'compounds.create',
  'compounds.update',
  'media.view',
  'media.upload',
  'media.delete',
];

const ROLE_PERMISSIONS: Record<
  Extract<UserRole, 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'>,
  AdminPermission[]
> = {
  SUPER_ADMIN: ALL_PERMISSIONS,
  ADMIN: ALL_PERMISSIONS,
  MODERATOR: [
    'dashboard.view',
    'properties.view',
    'properties.approve',
    'properties.reject',
    'leads.view',
    'leads.update_status',
  ],
};

function isElevatedAdminRole(role: UserRole): boolean {
  return role === 'SUPER_ADMIN' || role === 'ADMIN';
}

function getModeratorPermissions(roles: UserRole[]): AdminPermission[] {
  if (!roles.includes('MODERATOR')) {
    return [];
  }

  return ROLE_PERMISSIONS.MODERATOR;
}

export function hasPermission(
  roles: UserRole[],
  permission: AdminPermission,
): boolean {
  if (roles.some(isElevatedAdminRole)) {
    return true;
  }

  return getModeratorPermissions(roles).includes(permission);
}

export function hasAnyPermission(
  roles: UserRole[],
  permissions: AdminPermission[],
): boolean {
  return permissions.some((permission) => hasPermission(roles, permission));
}

/*
 * UI usage examples (wire in components when ready):
 *
 * PropertyActions should later use:
 *   hasPermission(session.user.roles, 'properties.approve')
 *
 * LeadActions should later use:
 *   hasPermission(session.user.roles, 'leads.update_status')
 *
 * PlanFormDialog should later use:
 *   hasAnyPermission(session.user.roles, ['plans.create', 'plans.update'])
 */
