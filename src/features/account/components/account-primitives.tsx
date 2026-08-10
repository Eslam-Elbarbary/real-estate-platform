import type { ReactNode } from 'react';
import { createElement } from 'react';
import Link from 'next/link';
import { appIcons, type AppIconName } from '@/config/icons';
import { getButtonClassName } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { accountCopy } from '../config/account-nav';

type EmptyIconName = 'accountCards' | 'accountWallet' | 'accountSubscription';

interface AccountEmptyStateProps {
  icon: EmptyIconName;
  title: string;
  ctaLabel: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function AccountEmptyState({
  icon,
  title,
  ctaLabel,
  ctaHref,
  onCtaClick,
  className,
}: AccountEmptyStateProps) {
  const ctaClass = getButtonClassName({
    className: 'mt-6 h-11 min-w-[7.5rem] rounded-lg px-8 text-sm font-bold',
  });

  return (
    <div
      className={cn(
        'flex min-h-[28rem] flex-col items-center justify-center rounded-xl border border-[#e5e5e5] bg-white px-6 py-20 text-center',
        className,
      )}
    >
      {createElement(appIcons[icon], {
        size: 64,
        strokeWidth: 1.25,
        className: 'text-ink-400',
        'aria-hidden': true,
      })}
      <p className="mt-6 max-w-md text-base font-semibold text-ink-800">
        {title}
      </p>
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

interface AccountSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AccountSection({
  title,
  description,
  action,
  children,
  className,
}: AccountSectionProps) {
  return (
    <section className={cn('min-w-0 flex-1', className)}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-ink-950 sm:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-xl text-sm leading-7 text-ink-600">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

interface AccountSettingsRowProps {
  label?: ReactNode;
  value: ReactNode;
  trailing?: ReactNode;
  onEdit?: () => void;
  editLabel?: string;
  className?: string;
}

export function AccountSettingsRow({
  label,
  value,
  trailing,
  onEdit,
  editLabel = accountCopy.edit,
  className,
}: AccountSettingsRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-5 py-6 sm:px-7',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {trailing}
        <div className="min-w-0">
          {label ? (
            <div className="text-sm font-semibold text-ink-900">{label}</div>
          ) : null}
          <div
            className={cn(
              'min-w-0 text-sm text-ink-600',
              label ? 'mt-1 truncate' : '',
            )}
          >
            {value}
          </div>
        </div>
      </div>
      {onEdit ? (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-brand-600 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={editLabel}
        >
          {createElement(appIcons.edit, {
            size: 18,
            strokeWidth: 1.75,
            'aria-hidden': true,
          })}
        </button>
      ) : null}
    </div>
  );
}

interface AccountPanelProps {
  children: ReactNode;
  className?: string;
}

export function AccountPanel({ children, className }: AccountPanelProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-[#e5e5e5] bg-white divide-y divide-[#e5e5e5]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AccountNavIcon({
  name,
  className,
  size = 18,
}: {
  name: AppIconName;
  className?: string;
  size?: number;
}) {
  return createElement(appIcons[name], {
    size,
    strokeWidth: 1.75,
    className,
    'aria-hidden': true,
  });
}
