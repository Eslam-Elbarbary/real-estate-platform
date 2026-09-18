import type { ReactNode } from 'react';
import { Cairo } from 'next/font/google';
import { SiteShell } from '@/components/layout/site-shell';
import { siteConfig } from '@/config/site';
import { getPlatformSettings } from '@/features/settings';
import { createRootMetadata } from '@/lib/seo/metadata';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export async function generateMetadata() {
  const settings = await getPlatformSettings();
  return createRootMetadata(settings);
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={siteConfig.language}
      dir={siteConfig.direction}
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
