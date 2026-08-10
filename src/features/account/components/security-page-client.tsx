'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { logoutAction } from '@/features/auth/actions';
import { routes } from '@/config/routes';
import { accountCopy } from '../config/account-nav';
import type { AccountSecuritySettings } from '../types';
import { AccountModal } from './account-modal';
import {
  AccountPanel,
  AccountSection,
  AccountSettingsRow,
} from './account-primitives';

interface SecurityPageClientProps {
  settings: AccountSecuritySettings;
}

export function SecurityPageClient({ settings }: SecurityPageClientProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleLogoutAll() {
    startTransition(async () => {
      await logoutAction();
      setConfirmOpen(false);
      router.push(routes.auth.login);
      router.refresh();
    });
  }

  return (
    <>
      <AccountSection title={accountCopy.securityTitle}>
        <AccountPanel>
          <AccountSettingsRow
            label={accountCopy.emailLabel}
            value={settings.email}
            onEdit={() => router.push(routes.account.profile)}
          />
          <AccountSettingsRow
            label={accountCopy.passwordLabel}
            value={settings.passwordMasked}
            onEdit={() => router.push(routes.account.profile)}
          />
          <AccountSettingsRow
            label={
              <span className="inline-flex items-center gap-1.5">
                {accountCopy.phoneLabel}
                {settings.phoneVerified ? (
                  <ShieldCheck
                    size={16}
                    className="text-success-700"
                    aria-label="رقم موثق"
                  />
                ) : null}
              </span>
            }
            value={settings.phone}
            onEdit={() => router.push(routes.account.profile)}
          />
        </AccountPanel>

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="mt-4 flex w-full items-center justify-between gap-4 rounded-xl border border-[#e5e5e5] bg-white px-5 py-5 text-start transition-colors hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-danger-50 text-danger-600">
              <LogOut size={20} aria-hidden />
            </span>
            <div>
              <p className="text-sm font-extrabold text-ink-950">
                {accountCopy.logoutAllTitle}
              </p>
              <p className="mt-1 text-xs leading-6 text-ink-600">
                {accountCopy.logoutAllDescription}
              </p>
            </div>
          </div>
          <span className="text-lg text-ink-400" aria-hidden>
            ‹
          </span>
        </button>
      </AccountSection>

      <AccountModal
        open={confirmOpen}
        title={accountCopy.logoutAllTitle}
        onClose={() => setConfirmOpen(false)}
      >
        <p className="text-sm leading-7 text-ink-600">
          {accountCopy.logoutAllDescription}
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={handleLogoutAll}
            className={getButtonClassName({
              variant: 'danger',
              className: 'h-11 flex-1 font-bold',
            })}
          >
            {accountCopy.logoutAllConfirm}
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            className={getButtonClassName({
              variant: 'outline',
              className: 'h-11 flex-1',
            })}
          >
            {accountCopy.cancel}
          </button>
        </div>
      </AccountModal>
    </>
  );
}
