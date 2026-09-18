import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import {
  getPlatformSettings,
  resolveSiteName,
} from '@/features/settings';
import { AnnouncementBar } from './announcement-bar';
import { BrandingProvider } from './branding-context';
import { Footer } from './footer';
import { Header } from './header';

interface SiteShellProps {
  children: ReactNode;
}

export async function SiteShell({ children }: SiteShellProps) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname') ?? '';
  const isAuthRoute = pathname.startsWith('/auth');
  const settings = await getPlatformSettings();
  const branding = {
    siteName: resolveSiteName(settings),
    logoUrl: settings.logoUrl,
  };

  if (isAuthRoute) {
    return (
      <BrandingProvider value={branding}>
        <div className="flex min-h-full flex-col bg-white">
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </div>
      </BrandingProvider>
    );
  }

  return (
    <BrandingProvider value={branding}>
      <div className="flex min-h-full flex-col bg-white">
        <AnnouncementBar />
        <Header settings={settings} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer settings={settings} />
      </div>
    </BrandingProvider>
  );
}
