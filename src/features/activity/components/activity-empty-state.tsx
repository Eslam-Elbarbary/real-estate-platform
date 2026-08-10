import Link from 'next/link';
import { createElement, type ComponentType } from 'react';
import { getButtonClassName } from '@/components/ui/button';

interface ActivityEmptyStateProps {
  icon: ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean }>;
  message: string;
  ctaLabel: string;
  ctaHref?: string;
  onCtaClick?: () => void;
}

export function ActivityEmptyState({
  icon,
  message,
  ctaLabel,
  ctaHref,
  onCtaClick,
}: ActivityEmptyStateProps) {
  const ctaClass = getButtonClassName({
    className: 'mt-6 h-11 rounded-full px-8 font-bold',
  });

  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center rounded-xl border border-[#e5e5e5] bg-white px-6 py-16 text-center sm:min-h-[420px]">
      <div className="text-ink-400">
        {createElement(icon, {
          size: 72,
          className: 'stroke-[1.25]',
          'aria-hidden': true,
        })}
      </div>
      <p className="mt-5 text-base font-semibold text-ink-700">{message}</p>
      {ctaHref ? (
        <Link href={ctaHref} className={ctaClass}>
          {ctaLabel}
        </Link>
      ) : (
        <button type="button" onClick={onCtaClick} className={ctaClass}>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
