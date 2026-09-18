'use client';

import Link from 'next/link';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import { useBranding } from './branding-context';

interface BrandLogoProps {
  className?: string;
  tone?: 'default' | 'inverse';
  siteName?: string;
  logoUrl?: string | null;
}

export function BrandLogo({
  className,
  tone = 'default',
  siteName,
  logoUrl,
}: BrandLogoProps) {
  const branding = useBranding();
  const inverse = tone === 'inverse';
  const resolvedName = siteName ?? branding.siteName;
  const resolvedLogo = logoUrl === undefined ? branding.logoUrl : logoUrl;

  return (
    <Link
      href={routes.home}
      className={cn(
        'inline-flex min-w-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        className,
      )}
    >
      {resolvedLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedLogo}
          alt={resolvedName}
          className="h-8 w-auto max-w-[180px] object-contain"
        />
      ) : (
        <span
          className={cn(
            'truncate text-[1.35rem] font-extrabold tracking-tight',
            inverse ? 'text-white' : 'text-brand-600',
          )}
        >
          {resolvedName}
        </span>
      )}
    </Link>
  );
}
