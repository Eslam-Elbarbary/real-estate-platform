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
  const userName = session?.user.name ?? 'Admin User';
  const userEmail = session?.user.email ?? '';

  return (
    <div className="min-h-full bg-background">
      <Sidebar roles={roles} userName={userName} userEmail={userEmail} />
      <div className="flex min-h-full flex-col transition-[padding] duration-300 lg:ps-sidebar">
        <Topbar roles={roles} userName={userName} userEmail={userEmail} />
        <main
          id="main-content"
          className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
