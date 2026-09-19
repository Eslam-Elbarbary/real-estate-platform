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
  | 'properties.delete'
  | 'properties.approve'
  | 'properties.reject'
  | 'properties.archive'
  | 'properties.restore'
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
  | 'roles.manage_permissions'
  // Catalogs
  | 'catalogs.view'
  | 'catalogs.create'
  | 'catalogs.update'
  // Features
  | 'features.view'
  | 'features.create'
  | 'features.update'
  | 'features.delete'
  // Property views
  | 'property_views.view'
  | 'property_views.create'
  | 'property_views.update'
  | 'property_views.delete'
  // Legal statuses
  | 'property_legal_statuses.view'
  | 'property_legal_statuses.create'
  | 'property_legal_statuses.update'
  | 'property_legal_statuses.delete'
  // Locations
  | 'locations.view'
  | 'locations.create'
  | 'locations.update'
  | 'locations.delete'
  // Settings
  | 'settings.view'
  | 'settings.update'
  // Banners
  | 'banners.view'
  | 'banners.create'
  | 'banners.update'
  | 'banners.delete';

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
