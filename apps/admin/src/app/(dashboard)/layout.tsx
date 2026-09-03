import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { routes } from '@/config/routes';
import { getAdminSession } from '@/features/auth/service';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect(routes.login);
  }

  if (!session.user.isAdmin) {
    redirect(routes.forbidden);
  }

  return <AdminShell>{children}</AdminShell>;
}
