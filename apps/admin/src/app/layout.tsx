import type { ReactNode } from 'react';
import { Cairo } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { createRootMetadata } from '@/lib/seo/metadata';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata = createRootMetadata();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={siteConfig.language}
      dir={siteConfig.direction}
      className={`${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
