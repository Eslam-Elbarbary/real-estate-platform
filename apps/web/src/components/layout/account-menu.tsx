'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, useTransition } from 'react';
import { getButtonClassName } from '@/components/ui/button';
import { getAppIcon, ICON_SIZE_UI } from '@/config/icons';
import {
  loggedInAccountMenuSections,
  loggedOutAccountMenuLinks,
} from '@/config/account-menu';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import { logoutAction } from '@/features/auth/actions';
import type { AuthSession } from '@/features/auth/types';
import { useHeaderOverlay } from './header-overlay';
import { MobileAccountDrawer } from './mobile-account-drawer';

const AccountIcon = getAppIcon('account');
const ChevronIcon = getAppIcon('chevronDown');
const EditIcon = getAppIcon('edit');
const LogoutIcon = getAppIcon('logout');

interface AccountMenuProps {
  session: AuthSession | null;
}

export function AccountMenu({ session }: AccountMenuProps) {
  const router = useRouter();
  const { overlay, openAccount, close } = useHeaderOverlay();
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const menuId = useId();
  const mobileOpen = overlay === 'account';

  useEffect(() => {
    if (!desktopOpen) {
      return;
    }

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setDesktopOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setDesktopOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [desktopOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
      (previouslyFocused.current ?? trigger)?.focus();
    };
  }, [mobileOpen]);

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
      setDesktopOpen(false);
      close();
      router.refresh();
    });
  }

  function toggle() {
    const isDesktop =
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 1024px)').matches;
    if (isDesktop) {
      setDesktopOpen((value) => !value);
      return;
    }
    if (mobileOpen) {
      close();
    } else {
      openAccount();
    }
  }

  const expanded = desktopOpen || mobileOpen;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          'inline-flex size-11 items-center justify-center rounded-md text-ink-700 transition-colors',
          'lg:h-9 lg:w-auto lg:gap-0.5 lg:px-1.5',
          'hover:bg-surface-50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        )}
        aria-label={
          session
            ? `${uiLabels.openAccountMenu}، ${session.user.name}`
            : uiLabels.openAccountMenu
        }
        aria-expanded={expanded}
        aria-controls={desktopOpen ? menuId : 'mobile-account-navigation'}
        data-testid="account-menu-trigger"
        onClick={toggle}
      >
        <span className="inline-flex size-7 items-center justify-center rounded-full border border-border">
          <AccountIcon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
        </span>
        {session ? (
          <span className="ms-1 hidden max-w-[7.5rem] truncate text-xs font-semibold lg:inline">
            {session.user.name}
          </span>
        ) : null}
        <ChevronIcon
          size={14}
          strokeWidth={2}
          className="hidden lg:inline"
          aria-hidden
        />
      </button>

      {desktopOpen ? (
        <div
          id={menuId}
          role="menu"
          data-testid="account-menu-panel"
          className="absolute end-0 top-[calc(100%+0.5rem)] z-50 hidden w-[23rem] rounded-xl border border-border bg-white p-4 shadow-lg lg:block"
        >
          {session ? (
            <LoggedInPanel
              session={session}
              onLogout={handleLogout}
              pending={pending}
              onNavigate={() => setDesktopOpen(false)}
            />
          ) : (
            <LoggedOutPanel onNavigate={() => setDesktopOpen(false)} />
          )}
        </div>
      ) : null}

      {mobileOpen ? (
        <MobileAccountDrawer
          session={session}
          pending={pending}
          onLogout={handleLogout}
          onClose={close}
        />
      ) : null}
    </div>
  );
}

function LoggedOutPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-extrabold text-ink-950">تسجيل الدخول</h2>
        <p className="mt-1 text-xs leading-6 text-ink-600">
          سجّل الدخول لحفظ التقييمات والمفضلة ومتابعة نشاطك العقاري.
        </p>
      </div>

      <div className="flex gap-2">
        <Link
          href={routes.auth.login}
          onClick={onNavigate}
          className={getButtonClassName({
            className: 'h-10 flex-1 text-sm',
          })}
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

      <ProCard onNavigate={onNavigate} />

      <nav className="space-y-1 border-t border-border pt-3">
        {loggedOutAccountMenuLinks.map((item) => {
          const Icon = getAppIcon(item.icon);
          return (
            <MenuLink
              key={item.id}
              href={item.href}
              icon={Icon}
              onClick={onNavigate}
            >
              {item.label}
            </MenuLink>
          );
        })}
      </nav>
    </div>
  );
}

function LoggedInPanel({
  session,
  onLogout,
  pending,
  onNavigate,
}: {
  session: AuthSession;
  onLogout: () => void;
  pending: boolean;
  onNavigate: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-ink-950">
            {session.user.name}
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            {session.user.memberSinceLabel}
          </p>
        </div>
        <Link
          href={routes.account.profile}
          onClick={onNavigate}
          className="inline-flex size-8 items-center justify-center rounded-md text-ink-500 hover:bg-surface-50 hover:text-ink-800"
          aria-label="تعديل الملف الشخصي"
        >
          <EditIcon size={16} aria-hidden />
        </Link>
      </div>

      <ProCard onNavigate={onNavigate} />

      <div className="space-y-3 border-t border-border pt-3">
        {loggedInAccountMenuSections.map((section) => (
          <nav key={section.id} aria-label={section.title} className="space-y-1">
            <p className="px-2 pb-1 text-[11px] font-bold tracking-wide text-ink-400">
              {section.title}
            </p>
            {section.links.map((item) => {
              const Icon = getAppIcon(item.icon);
              return (
                <MenuLink
                  key={item.id}
                  href={item.href}
                  icon={Icon}
                  onClick={onNavigate}
                >
                  {item.label}
                </MenuLink>
              );
            })}
          </nav>
        ))}
      </div>

      <div className="border-t border-border pt-2">
        <button
          type="button"
          role="menuitem"
          disabled={pending}
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
        >
          <LogoutIcon size={16} aria-hidden />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

function ProCard({ onNavigate }: { onNavigate: () => void }) {
  return (
    <Link
      href={routes.pro.root}
      onClick={onNavigate}
      className="block rounded-xl bg-gradient-to-l from-brand-700 to-brand-500 p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      data-testid="account-menu-pro-card"
    >
      <p className="text-xs font-bold">{uiLabels.proBadge}</p>
      <p className="mt-1 text-xs leading-5 text-white/90">
        {uiLabels.premiumMessage}
      </p>
      <span className="mt-2 inline-flex text-xs font-bold underline underline-offset-2">
        {uiLabels.premiumCta}
      </span>
    </Link>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: ReturnType<typeof getAppIcon>;
  children: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-ink-800 transition-colors hover:bg-surface-50"
    >
      <Icon size={16} strokeWidth={1.75} aria-hidden />
      {children}
    </Link>
  );
}
