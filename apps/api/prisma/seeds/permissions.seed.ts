import { PrismaClient } from '../generated/prisma-client';

type PermissionSeed = {
  code: string;
  name: string;
  description: string;
};

export const PERMISSIONS: PermissionSeed[] = [
  // Properties
  {
    code: 'properties.view',
    name: 'View Properties',
    description: 'View property listings in the admin panel',
  },
  {
    code: 'properties.create',
    name: 'Create Properties',
    description: 'Create property listings on behalf of owners',
  },
  {
    code: 'properties.update',
    name: 'Update Properties',
    description: 'Edit property listing details',
  },
  {
    code: 'properties.delete',
    name: 'Delete Properties',
    description: 'Permanently remove property listings',
  },
  {
    code: 'properties.archive',
    name: 'Archive Properties',
    description: 'Archive property listings (soft removal from active catalog)',
  },
  {
    code: 'properties.restore',
    name: 'Restore Properties',
    description: 'Restore archived property listings back to draft',
  },
  {
    code: 'properties.approve',
    name: 'Approve Properties',
    description: 'Approve properties pending review',
  },
  {
    code: 'properties.reject',
    name: 'Reject Properties',
    description: 'Reject properties pending review',
  },
  {
    code: 'properties.publish',
    name: 'Publish Properties',
    description: 'Publish approved property listings',
  },
  // Users
  {
    code: 'users.view',
    name: 'View Users',
    description: 'View user accounts in the admin panel',
  },
  {
    code: 'users.create',
    name: 'Create Users',
    description: 'Create new user accounts',
  },
  {
    code: 'users.update',
    name: 'Update Users',
    description: 'Edit user account details',
  },
  {
    code: 'users.delete',
    name: 'Delete Users',
    description: 'Deactivate or remove user accounts',
  },
  {
    code: 'users.manage_roles',
    name: 'Manage User Roles',
    description: 'Assign or revoke user roles',
  },
  // Media
  {
    code: 'media.view',
    name: 'View Media',
    description: 'Browse the media library',
  },
  {
    code: 'media.upload',
    name: 'Upload Media',
    description: 'Upload files to the media library',
  },
  {
    code: 'media.delete',
    name: 'Delete Media',
    description: 'Remove files from the media library',
  },
  // Developers
  {
    code: 'developers.view',
    name: 'View Developers',
    description: 'View developer profiles',
  },
  {
    code: 'developers.create',
    name: 'Create Developers',
    description: 'Create developer profiles',
  },
  {
    code: 'developers.update',
    name: 'Update Developers',
    description: 'Edit developer profiles',
  },
  {
    code: 'developers.delete',
    name: 'Delete Developers',
    description: 'Remove developer profiles',
  },
  // Compounds
  {
    code: 'compounds.view',
    name: 'View Compounds',
    description: 'View compound profiles',
  },
  {
    code: 'compounds.create',
    name: 'Create Compounds',
    description: 'Create compound profiles',
  },
  {
    code: 'compounds.update',
    name: 'Update Compounds',
    description: 'Edit compound profiles',
  },
  {
    code: 'compounds.delete',
    name: 'Delete Compounds',
    description: 'Remove compound profiles',
  },
  // Leads
  {
    code: 'leads.view',
    name: 'View Leads',
    description: 'View buyer inquiries and leads',
  },
  {
    code: 'leads.update_status',
    name: 'Update Lead Status',
    description: 'Change lead workflow status',
  },
  // Payments
  {
    code: 'payments.view',
    name: 'View Payments',
    description: 'View payment records and invoices',
  },
  {
    code: 'payments.refund',
    name: 'Refund Payments',
    description: 'Issue payment refunds',
  },
  // Dashboard
  {
    code: 'dashboard.view',
    name: 'View Dashboard',
    description: 'View admin dashboard statistics and overview',
  },
  // Plans
  {
    code: 'plans.view',
    name: 'View Plans',
    description: 'View subscription plans in the admin panel',
  },
  {
    code: 'plans.create',
    name: 'Create Plans',
    description: 'Create subscription plans',
  },
  {
    code: 'plans.update',
    name: 'Update Plans',
    description: 'Edit subscription plans',
  },
  // Catalogs
  {
    code: 'catalogs.view',
    name: 'View Catalogs',
    description: 'View property types, transaction types, and features',
  },
  {
    code: 'catalogs.create',
    name: 'Create Catalogs',
    description: 'Create property types, transaction types, and features',
  },
  {
    code: 'catalogs.update',
    name: 'Update Catalogs',
    description: 'Edit property types, transaction types, and features',
  },
  // Features (dedicated; catalogs.* still work as aliases)
  {
    code: 'features.view',
    name: 'View Features',
    description: 'View property feature catalog',
  },
  {
    code: 'features.create',
    name: 'Create Features',
    description: 'Create property features',
  },
  {
    code: 'features.update',
    name: 'Update Features',
    description: 'Edit and activate/deactivate property features',
  },
  {
    code: 'features.delete',
    name: 'Delete Features',
    description: 'Delete unused features or deactivate linked ones',
  },
  // Property views (dedicated; catalogs.* still work as aliases)
  {
    code: 'property_views.view',
    name: 'View Property Views',
    description: 'View the property view catalog (Nile, sea, garden…)',
  },
  {
    code: 'property_views.create',
    name: 'Create Property Views',
    description: 'Create property view options',
  },
  {
    code: 'property_views.update',
    name: 'Update Property Views',
    description: 'Edit and activate/deactivate property view options',
  },
  {
    code: 'property_views.delete',
    name: 'Delete Property Views',
    description: 'Delete unused property views or deactivate linked ones',
  },
  // Legal statuses (dedicated; catalogs.* still work as aliases)
  {
    code: 'property_legal_statuses.view',
    name: 'View Legal Statuses',
    description: 'View the property legal status catalog',
  },
  {
    code: 'property_legal_statuses.create',
    name: 'Create Legal Statuses',
    description: 'Create property legal status options',
  },
  {
    code: 'property_legal_statuses.update',
    name: 'Update Legal Statuses',
    description: 'Edit and activate/deactivate legal status options',
  },
  {
    code: 'property_legal_statuses.delete',
    name: 'Delete Legal Statuses',
    description: 'Delete unused legal statuses or deactivate linked ones',
  },
  // Settings
  {
    code: 'settings.view',
    name: 'View Settings',
    description: 'View platform branding, contact, and SEO settings',
  },
  {
    code: 'settings.update',
    name: 'Update Settings',
    description: 'Edit platform branding, contact, and SEO settings',
  },
  // Banners
  {
    code: 'banners.view',
    name: 'View Banners',
    description: 'View marketing banners',
  },
  {
    code: 'banners.create',
    name: 'Create Banners',
    description: 'Create marketing banners',
  },
  {
    code: 'banners.update',
    name: 'Update Banners',
    description: 'Edit, activate, deactivate, and reorder banners',
  },
  {
    code: 'banners.delete',
    name: 'Delete Banners',
    description: 'Delete marketing banners',
  },
  // Roles
  {
    code: 'roles.view',
    name: 'View Roles',
    description: 'View roles and their permission mappings',
  },
  {
    code: 'roles.create',
    name: 'Create Roles',
    description: 'Create new roles',
  },
  {
    code: 'roles.update',
    name: 'Update Roles',
    description: 'Edit role metadata',
  },
  {
    code: 'roles.delete',
    name: 'Delete Roles',
    description: 'Delete non-system roles',
  },
  {
    code: 'roles.manage_permissions',
    name: 'Manage Role Permissions',
    description: 'Assign or replace permissions on roles',
  },
];

const ALL_PERMISSION_CODES = PERMISSIONS.map((permission) => permission.code);

const MODERATOR_PERMISSION_CODES = [
  'properties.view',
  'properties.approve',
  'properties.reject',
  'leads.view',
  'leads.update_status',
] as const;

export const ROLE_PERMISSION_MAP: Record<string, readonly string[]> = {
  SUPER_ADMIN: ALL_PERMISSION_CODES,
  ADMIN: ALL_PERMISSION_CODES,
  MODERATOR: MODERATOR_PERMISSION_CODES,
  USER: [],
};

/** Codes dropped by a rename; removed so roles stop carrying dead permissions. */
const RETIRED_PERMISSION_CODES = [
  'registration_statuses.view',
  'registration_statuses.create',
  'registration_statuses.update',
  'registration_statuses.delete',
];

export async function seedPermissions(prisma: PrismaClient): Promise<Map<string, string>> {
  const permissionIds = new Map<string, string>();

  await prisma.permission.deleteMany({
    where: { code: { in: RETIRED_PERMISSION_CODES } },
  });

  for (const permission of PERMISSIONS) {
    const row = await prisma.permission.upsert({
      where: { code: permission.code },
      update: {
        name: permission.name,
        description: permission.description,
      },
      create: permission,
    });
    permissionIds.set(row.code, row.id);
  }

  return permissionIds;
}

export async function seedRolePermissions(
  prisma: PrismaClient,
  permissionIds: Map<string, string>,
): Promise<void> {
  for (const [roleCode, permissionCodes] of Object.entries(ROLE_PERMISSION_MAP)) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { code: roleCode },
    });

    for (const permissionCode of permissionCodes) {
      const permissionId = permissionIds.get(permissionCode);
      if (!permissionId) {
        throw new Error(`Missing permission seed for code: ${permissionCode}`);
      }

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId,
        },
      });
    }
  }
}

export async function seedPermissionsAndRoleMappings(prisma: PrismaClient): Promise<void> {
  const permissionIds = await seedPermissions(prisma);
  await seedRolePermissions(prisma, permissionIds);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`  permissions: ${PERMISSIONS.length} upserted`);
    console.log(
      `  role mappings: SUPER_ADMIN=${ROLE_PERMISSION_MAP.SUPER_ADMIN.length}, ADMIN=${ROLE_PERMISSION_MAP.ADMIN.length}, MODERATOR=${ROLE_PERMISSION_MAP.MODERATOR.length}, USER=${ROLE_PERMISSION_MAP.USER.length}`,
    );
  }
}
