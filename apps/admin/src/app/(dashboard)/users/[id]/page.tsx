import { UserDetails } from '@/features/users/components/user-details';
import {
  getAdminUserDetails,
  getAdminUserRoles,
  getAssignableAdminRoles,
} from '@/features/users';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminSession } from '@/features/auth/service';
import type { AdminRole } from '@/features/roles/types';
import { createPageMetadata } from '@/lib/seo/metadata';
import type { AdminUserRole } from '@/features/users/types';

export const metadata = createPageMetadata({
  title: 'تفاصيل المستخدم',
  description: 'عرض وإدارة حساب المستخدم.',
  path: '/users',
});

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, session] = await Promise.all([
    getAdminUserDetails(id),
    getAdminSession(),
  ]);
  const permissions = session?.user.permissions ?? [];
  const canManageRoles = hasPermission(permissions, 'users.manage_roles');

  let assignedRoles: AdminUserRole[] = [];
  let availableRoles: AdminRole[] = [];

  if (canManageRoles) {
    const [roles, catalog] = await Promise.all([
      getAdminUserRoles(id),
      getAssignableAdminRoles(),
    ]);
    assignedRoles = roles;
    availableRoles = catalog;
  }

  return (
    <UserDetails
      user={user}
      permissions={permissions}
      assignedRoles={assignedRoles}
      availableRoles={availableRoles}
    />
  );
}
