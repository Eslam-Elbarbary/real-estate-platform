import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { routes } from '@/config/routes';
import { getAdminSession } from '@/features/auth/service';
import type { UserRole } from '@/types';

const ALLOWED_DASHBOARD_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'MODERATOR',
];

function hasDashboardAccess(roles: UserRole[]): boolean {
  return roles.some((role) => ALLOWED_DASHBOARD_ROLES.includes(role));
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect(routes.login);
  }

  if (!hasDashboardAccess(session.user.roles)) {
    redirect(routes.forbidden);
  }

  return <AdminShell>{children}</AdminShell>;
}
