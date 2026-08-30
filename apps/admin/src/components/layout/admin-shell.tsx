import type { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-full bg-background">
      <Sidebar />
      <div className="lg:ps-sidebar">
        <Topbar />
        <main id="main-content" className="px-4 py-6 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
