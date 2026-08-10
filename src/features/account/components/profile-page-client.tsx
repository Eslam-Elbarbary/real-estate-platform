'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, createElement } from 'react';
import { ShieldCheck } from 'lucide-react';
import { appIcons } from '@/config/icons';
import { getButtonClassName } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  updateProfileEmailAction,
  updateProfileNameAction,
  updateProfilePasswordAction,
  updateProfilePhoneAction,
} from '../actions';
import { accountCopy } from '../config/account-nav';
import type { AccountProfile } from '../types';
import { AccountModal } from './account-modal';
import {
  AccountPanel,
  AccountSection,
  AccountSettingsRow,
} from './account-primitives';

type EditField = 'name' | 'email' | 'password' | 'phone' | null;

interface ProfilePageClientProps {
  profile: AccountProfile;
}

export function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const router = useRouter();
  const [editField, setEditField] = useState<EditField>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openEdit(field: Exclude<EditField, null>, initial: string) {
    setEditField(field);
    setValue(initial);
    setError(null);
  }

  function handleSave() {
    startTransition(async () => {
      setError(null);
      let result;
      if (editField === 'name') {
        result = await updateProfileNameAction(value);
      } else if (editField === 'email') {
        result = await updateProfileEmailAction(value);
      } else if (editField === 'password') {
        result = await updateProfilePasswordAction(value);
      } else if (editField === 'phone') {
        result = await updateProfilePhoneAction(value);
      } else {
        return;
      }

      if (!result.ok) {
        setError(
          result.fieldErrors
            ? Object.values(result.fieldErrors)[0]
            : result.error,
        );
        return;
      }
      setEditField(null);
      router.refresh();
    });
  }

  const titles: Record<Exclude<EditField, null>, string> = {
    name: 'تعديل الاسم',
    email: 'تعديل البريد الإلكتروني',
    password: 'تعديل كلمة المرور',
    phone: 'تعديل رقم الهاتف',
  };

  return (
    <>
      <AccountSection title={accountCopy.profileTitle}>
        <AccountPanel>
          <AccountSettingsRow
            trailing={
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-100 text-ink-500">
                {createElement(appIcons.account, {
                  size: 22,
                  strokeWidth: 1.5,
                  'aria-hidden': true,
                })}
              </span>
            }
            value={
              <div>
                <p className="text-base font-extrabold text-ink-950">
                  {profile.name}
                </p>
                <p className="mt-0.5 text-sm text-ink-500">
                  {profile.displayRoleLabel}
                </p>
              </div>
            }
            onEdit={() => openEdit('name', profile.name)}
            editLabel="تعديل الاسم"
          />
          <AccountSettingsRow
            label={accountCopy.emailLabel}
            value={profile.email}
            onEdit={() => openEdit('email', profile.email)}
            editLabel="تعديل البريد الإلكتروني"
          />
          <AccountSettingsRow
            label={accountCopy.passwordLabel}
            value={accountCopy.passwordMasked}
            onEdit={() => openEdit('password', '')}
            editLabel="تعديل كلمة المرور"
          />
          <AccountSettingsRow
            label={
              <span className="inline-flex items-center gap-1.5">
                {accountCopy.phoneLabel}
                {profile.phoneVerified ? (
                  <ShieldCheck
                    size={16}
                    className="text-success-700"
                    aria-label="رقم موثق"
                  />
                ) : null}
              </span>
            }
            value={profile.phone}
            onEdit={() => openEdit('phone', profile.phone)}
            editLabel="تعديل رقم الهاتف"
          />
        </AccountPanel>
      </AccountSection>

      <AccountModal
        open={editField !== null}
        title={editField ? titles[editField] : ''}
        onClose={() => setEditField(null)}
      >
        <div className="space-y-4">
          <Input
            id={`edit-${editField}`}
            label={
              editField === 'name'
                ? 'الاسم'
                : editField === 'email'
                  ? accountCopy.emailLabel
                  : editField === 'password'
                    ? accountCopy.passwordLabel
                    : accountCopy.phoneLabel
            }
            type={editField === 'password' ? 'password' : 'text'}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            error={error ?? undefined}
            autoComplete="off"
          />
          <button
            type="button"
            disabled={pending}
            onClick={handleSave}
            className={getButtonClassName({
              className: 'h-11 w-full font-bold',
            })}
          >
            {accountCopy.save}
          </button>
        </div>
      </AccountModal>
    </>
  );
}
