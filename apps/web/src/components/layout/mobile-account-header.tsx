import type { RefObject } from 'react';
import Link from 'next/link';
import { getAppIcon } from '@/config/icons';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';
import type { AuthSession } from '@/features/auth/types';

const CloseIcon = getAppIcon('close');
const EditIcon = getAppIcon('edit');

interface MobileAccountHeaderProps {
  titleId: string;
  session: AuthSession | null;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onNavigate: () => void;
}

export function MobileAccountHeader({
  titleId,
  session,
  closeButtonRef,
  onClose,
  onNavigate,
}: MobileAccountHeaderProps) {
  return (
    <div
      className="flex min-h-20 shrink-0 items-start justify-between gap-3 border-b border-surface-100 px-5 py-5"
      style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}
    >
      <div className="min-w-0">
        <div className="flex items-start gap-2">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-base font-extrabold text-ink-950">
              {session ? session.user.name : uiLabels.login}
            </h2>
            {session ? (
              <p className="mt-1 text-xs text-ink-500">{session.user.memberSinceLabel}</p>
            ) : (
              <p className="mt-1 text-xs leading-5 text-ink-600">
                سجّل الدخول لحفظ التقييمات والمفضلة ومتابعة نشاطك العقاري.
              </p>
            )}
          </div>
          {session ? (
            <Link
              href={routes.account.profile}
              onClick={onNavigate}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-ink-500 hover:bg-surface-50 hover:text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="تعديل الملف الشخصي"
            >
              <EditIcon size={16} aria-hidden />
            </Link>
          ) : null}
        </div>
      </div>
      <button
        ref={closeButtonRef}
        type="button"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink-800 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={uiLabels.closeMenu}
        data-testid="mobile-account-close"
        onClick={onClose}
      >
        <CloseIcon className="size-5" strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}
