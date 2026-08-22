import Link from 'next/link';
import { getAppIcon } from '@/config/icons';
import {
  loggedInAccountMenuSections,
  loggedOutAccountMenuLinks,
} from '@/config/account-menu';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';
import { getButtonClassName } from '@/components/ui/button';
import type { AuthSession } from '@/features/auth/types';

const LogoutIcon = getAppIcon('logout');
const drawerIcons = {
  activities: getAppIcon('activities'),
  favorites: getAppIcon('favorites'),
  notes: getAppIcon('notes'),
  notifications: getAppIcon('notifications'),
  alerts: getAppIcon('alerts'),
  accountProfile: getAppIcon('accountProfile'),
  valuation: getAppIcon('valuation'),
  myProperties: getAppIcon('myProperties'),
  credits: getAppIcon('credits'),
  recharge: getAppIcon('recharge'),
} as const;

function AccountDrawerLink({
  href,
  icon,
  label,
  onNavigate,
}: {
  href: string;
  icon: keyof typeof drawerIcons;
  label: string;
  onNavigate: () => void;
}) {
  const Icon = drawerIcons[icon];
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex min-h-12 w-full items-center gap-3 border-b border-surface-100 px-[18px] text-sm font-medium text-ink-800 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
    >
      <Icon size={18} strokeWidth={1.75} aria-hidden />
      {label}
    </Link>
  );
}

interface MobileAccountContentProps {
  session: AuthSession | null;
  pending: boolean;
  onLogout: () => void;
  onNavigate: () => void;
}

export function MobileAccountContent({
  session,
  pending,
  onLogout,
  onNavigate,
}: MobileAccountContentProps) {
  return (
    <>
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
        data-testid="mobile-account-scroll"
      >
        <div className="px-4 py-4">
          {session ? null : (
            <div className="mb-4 flex gap-2">
              <Link
                href={routes.auth.login}
                onClick={onNavigate}
                className={getButtonClassName({ className: 'h-10 flex-1 text-sm' })}
              >
                تسجيل الدخول
              </Link>
              <Link
                href={routes.auth.register}
                onClick={onNavigate}
                className={getButtonClassName({
                  variant: 'accent',
                  className: 'h-10 flex-1 text-sm font-bold',
                })}
              >
                تسجيل حساب
              </Link>
            </div>
          )}

          <Link
            href={routes.pro.root}
            onClick={onNavigate}
            className="block w-full rounded-[10px] bg-gradient-to-l from-brand-700 to-brand-500 p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            data-testid="account-menu-pro-card"
          >
            <p className="text-xs font-bold">{uiLabels.proBadge}</p>
            <p className="mt-1 text-xs leading-5 break-words text-white/90">
              {uiLabels.premiumMessage}
            </p>
            <span className="mt-2 inline-flex text-xs font-bold underline underline-offset-2">
              {uiLabels.premiumCta}
            </span>
          </Link>
        </div>

        {session ? (
          loggedInAccountMenuSections.map((section) => (
            <nav key={section.id} aria-label={section.title}>
              <p className="px-5 pb-1 pt-3 text-[11px] font-bold tracking-wide text-ink-400">
                {section.title}
              </p>
              {section.links.map((item) => (
                <AccountDrawerLink
                  key={item.id}
                  href={item.href}
                  icon={item.icon as keyof typeof drawerIcons}
                  label={item.label}
                  onNavigate={onNavigate}
                />
              ))}
            </nav>
          ))
        ) : (
          <nav aria-label="نشاطاتي">
            {loggedOutAccountMenuLinks.map((item) => (
              <AccountDrawerLink
                key={item.id}
                href={item.href}
                icon={item.icon as keyof typeof drawerIcons}
                label={item.label}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        )}
      </div>

      {session ? (
        <div
          className="shrink-0 border-t border-surface-100 bg-white px-2 pt-2"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            disabled={pending}
            onClick={onLogout}
            data-testid="mobile-account-logout"
            className="flex min-h-12 w-full items-center gap-3 rounded-md px-[18px] text-sm font-medium text-danger-600 hover:bg-danger-50"
          >
            <LogoutIcon size={18} aria-hidden />
            تسجيل الخروج
          </button>
        </div>
      ) : (
        <div
          className="shrink-0"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        />
      )}
    </>
  );
}
