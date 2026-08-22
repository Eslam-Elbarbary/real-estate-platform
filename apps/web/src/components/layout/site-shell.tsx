import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { AnnouncementBar } from './announcement-bar';
import { Footer } from './footer';
import { Header } from './header';

interface SiteShellProps {
  children: ReactNode;
}

export async function SiteShell({ children }: SiteShellProps) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') ?? '';
  const isAuthRoute = pathname.startsWith('/auth');

  if (isAuthRoute) {
    return (
      <div className="flex min-h-full flex-col bg-white">
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
