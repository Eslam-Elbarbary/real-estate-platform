import Link from 'next/link';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

interface BrandLogoProps {
  className?: string;
  tone?: 'default' | 'inverse';
}

export function BrandLogo({ className, tone = 'default' }: BrandLogoProps) {
  const inverse = tone === 'inverse';

  return (
    <Link
      href={routes.home}
      className={cn(
        'inline-flex min-w-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        className,
      )}
    >
      <span
        className={cn(
          'truncate text-[1.35rem] font-extrabold tracking-tight',
          inverse ? 'text-white' : 'text-brand-600',
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
