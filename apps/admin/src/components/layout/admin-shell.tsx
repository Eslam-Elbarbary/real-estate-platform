import type { ReactNode } from 'react';
import { getAdminSession } from '@/features/auth/service';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AdminShellProps {
  children: ReactNode;
}

export async function AdminShell({ children }: AdminShellProps) {
  const session = await getAdminSession();
  const roles = session?.user.roles ?? [];

  return (
    <div className="min-h-full bg-background">
      <Sidebar roles={roles} />
      <div className="lg:ps-sidebar">
        <Topbar roles={roles} />
        <main id="main-content" className="px-4 py-6 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
