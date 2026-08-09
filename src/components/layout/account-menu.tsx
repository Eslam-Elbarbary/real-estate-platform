'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, useTransition } from 'react';
import {
  Bell,
  Heart,
  LogOut,
  NotebookPen,
  Pencil,
  StickyNote,
} from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { getAppIcon, ICON_SIZE_UI } from '@/config/icons';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import { logoutAction } from '@/features/auth/actions';
import type { AuthSession } from '@/features/auth/types';

const AccountIcon = getAppIcon('account');
const ChevronIcon = getAppIcon('chevronDown');

interface AccountMenuProps {
  session: AuthSession | null;
}

export function AccountMenu({ session }: AccountMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div ref={rootRef} className="relative hidden lg:block">
      <button
        type="button"
        className={cn(
          'inline-flex h-9 items-center gap-0.5 rounded-md px-1.5 text-ink-700 transition-colors',
          'hover:bg-surface-50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        )}
        aria-label={session ? session.user.name : uiLabels.login}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="inline-flex size-7 items-center justify-center rounded-full border border-border">
          <AccountIcon size={ICON_SIZE_UI} strokeWidth={1.75} aria-hidden />
        </span>
        {session ? (
          <span className="ms-1 max-w-[7.5rem] truncate text-xs font-semibold">
            {session.user.name}
          </span>
        ) : null}
        <ChevronIcon size={14} strokeWidth={2} aria-hidden />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-[22rem] rounded-xl border border-border bg-white p-4 shadow-lg"
        >
          {session ? (
            <LoggedInPanel
              session={session}
              onLogout={handleLogout}
              pending={pending}
              onNavigate={() => setOpen(false)}
            />
          ) : (
            <LoggedOutPanel onNavigate={() => setOpen(false)} />
          )}
        </div>
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

      <ProCard />

      <nav className="space-y-1 border-t border-border pt-3">
        <MenuLink href={routes.favorites} icon={NotebookPen} onClick={onNavigate}>
          نشاطاتي
        </MenuLink>
        <MenuLink href={routes.favorites} icon={Heart} onClick={onNavigate}>
          مفضلاتي
        </MenuLink>
        <MenuLink href={routes.favorites} icon={StickyNote} onClick={onNavigate}>
          ملاحظاتي
        </MenuLink>
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
          <p className="mt-1 text-xs text-ink-500">{session.user.memberSinceLabel}</p>
        </div>
        <Link
          href={routes.auth.verifyEmail}
          onClick={onNavigate}
          className="inline-flex size-8 items-center justify-center rounded-md text-ink-500 hover:bg-surface-50 hover:text-ink-800"
          aria-label="تعديل الملف الشخصي"
        >
          <Pencil size={16} aria-hidden />
        </Link>
      </div>

      <ProCard />

      <nav className="space-y-1 border-t border-border pt-3">
        <MenuLink href={routes.favorites} icon={Heart} onClick={onNavigate}>
          مفضلاتي
        </MenuLink>
        <MenuLink href={routes.favorites} icon={StickyNote} onClick={onNavigate}>
          ملاحظاتي
        </MenuLink>
        <MenuLink href={routes.favorites} icon={Bell} onClick={onNavigate}>
          إشعاراتي
        </MenuLink>
        <MenuLink href={routes.favorites} icon={Bell} onClick={onNavigate}>
          تنبيهاتي
        </MenuLink>
        <button
          type="button"
          role="menuitem"
          disabled={pending}
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-danger-600 transition-colors hover:bg-danger-50"
        >
          <LogOut size={16} aria-hidden />
          تسجيل الخروج
        </button>
      </nav>
    </div>
  );
}

function ProCard() {
  return (
    <div className="rounded-xl bg-gradient-to-l from-brand-700 to-brand-500 p-3 text-white">
      <p className="text-xs font-bold">{uiLabels.proBadge}</p>
      <p className="mt-1 text-xs leading-5 text-white/90">{uiLabels.premiumMessage}</p>
      <span className="mt-2 inline-flex text-xs font-bold underline underline-offset-2">
        {uiLabels.premiumCta}
      </span>
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: typeof Heart;
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
      <Icon size={16} aria-hidden />
      {children}
    </Link>
  );
}
