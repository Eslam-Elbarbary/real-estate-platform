export type AdminPermission =
  // Dashboard
  | 'dashboard.view'
  // Users
  | 'users.view'
  | 'users.update'
  | 'users.manage_roles'
  // Properties
  | 'properties.view'
  | 'properties.create'
  | 'properties.update'
  | 'properties.approve'
  | 'properties.reject'
  | 'properties.archive'
  | 'properties.publish'
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
  | 'media.delete'
  // Roles
  | 'roles.view'
  | 'roles.create'
  | 'roles.update'
  | 'roles.delete'
  | 'roles.manage_permissions';

export function hasPermission(
  permissions: string[],
  permission: string,
): boolean {
  return permissions.includes(permission);
}

export function hasAnyPermission(
  permissions: string[],
  required: string[],
): boolean {
  return required.some((permission) => hasPermission(permissions, permission));
}
