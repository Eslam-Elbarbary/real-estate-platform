import Image from 'next/image';
import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/layout/brand-logo';
import { cn } from '@/lib/utils/cn';

interface AuthShellProps {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthShell({ children, footer, className }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh w-full bg-white">
      <div className="relative hidden min-h-dvh w-[60%] lg:block">
        <Image
          src="/assets/auth/auth-lifestyle.webp"
          alt=""
          fill
          priority
          sizes="60vw"
          className="object-cover"
        />
      </div>

      <div
        className={cn(
          'relative flex min-h-dvh w-full flex-col px-6 py-8 sm:px-10 lg:w-[40%]',
          className,
        )}
      >
        <div className="shrink-0">
          <BrandLogo />
        </div>

        <div className="flex flex-1 flex-col justify-center py-8">{children}</div>

        {footer ? (
          <div className="shrink-0 pt-4 text-center text-xs leading-relaxed text-ink-500">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
