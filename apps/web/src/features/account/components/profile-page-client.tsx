'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition, createElement } from 'react';
import { ShieldCheck } from 'lucide-react';
import { appIcons } from '@/config/icons';
import { getButtonClassName } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { routes } from '@/config/routes';
import {
  changePasswordAction,
  updateProfileNameAction,
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

type EditField = 'name' | 'phone' | null;

interface ProfilePageClientProps {
  profile: AccountProfile;
}

export function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const router = useRouter();
  const [editField, setEditField] = useState<EditField>(null);
  const [firstName, setFirstName] = useState(profile.firstName ?? '');
  const [lastName, setLastName] = useState(profile.lastName ?? '');
  const [phone, setPhone] = useState(profile.phone);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordPending, startPasswordTransition] = useTransition();

  function openName() {
    setEditField('name');
    setFirstName(profile.firstName ?? '');
    setLastName(profile.lastName ?? '');
    setError(null);
  }

  function openPhone() {
    setEditField('phone');
    setPhone(profile.phone);
    setError(null);
  }

  function handleSave() {
    startTransition(async () => {
      setError(null);
      const result =
        editField === 'name'
          ? await updateProfileNameAction(firstName, lastName)
          : editField === 'phone'
            ? await updateProfilePhoneAction(phone)
            : null;

      if (!result) {
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

  function handleChangePassword() {
    setPasswordErrors({});
    setPasswordMessage(null);
    startPasswordTransition(async () => {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!result.ok) {
        setPasswordErrors(result.fieldErrors ?? {});
        setPasswordMessage(result.error);
        return;
      }

      setPasswordMessage(accountCopy.changePasswordSuccess);
      router.push(`${routes.auth.login}?passwordChanged=1`);
      router.refresh();
    });
  }

  return (
    <>
      <AccountSection title={accountCopy.profileTitle}>
        <AccountPanel>
          <AccountSettingsRow
            trailing={
              profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="size-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-100 text-ink-500">
                  {createElement(appIcons.account, {
                    size: 22,
                    strokeWidth: 1.5,
                    'aria-hidden': true,
                  })}
                </span>
              )
            }
            value={
              <div>
                <p className="text-base font-extrabold text-ink-950">
                  {profile.name}
                </p>
                {profile.displayRoleLabel ? (
                  <p className="mt-0.5 text-sm text-ink-500">
                    {profile.displayRoleLabel}
                  </p>
                ) : null}
              </div>
            }
            onEdit={openName}
            editLabel="تعديل الاسم"
          />
          <AccountSettingsRow
            label={
              <span className="inline-flex items-center gap-1.5">
                {accountCopy.emailLabel}
                {profile.isEmailVerified ? (
                  <ShieldCheck
                    size={16}
                    className="text-success-700"
                    aria-label="بريد موثّق"
                  />
                ) : null}
              </span>
            }
            value={profile.email}
          />
          <AccountSettingsRow
            label={accountCopy.phoneLabel}
            value={profile.phone || '—'}
            onEdit={openPhone}
            editLabel="تعديل رقم الهاتف"
          />
        </AccountPanel>
      </AccountSection>

      <AccountSection title={accountCopy.changePasswordTitle} className="mt-8">
        <AccountPanel>
          <div className="space-y-4 p-5 sm:p-6">
            <Input
              id="current-password"
              name="currentPassword"
              label={accountCopy.currentPasswordLabel}
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              error={passwordErrors.currentPassword}
            />
            <Input
              id="new-password"
              name="newPassword"
              label={accountCopy.newPasswordLabel}
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              error={passwordErrors.newPassword}
            />
            <Input
              id="confirm-password"
              name="confirmPassword"
              label={accountCopy.confirmPasswordLabel}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={passwordErrors.confirmPassword}
            />
            {passwordMessage ? (
              <p
                role="status"
                className="text-sm text-ink-700"
              >
                {passwordMessage}
              </p>
            ) : null}
            <button
              type="button"
              disabled={passwordPending}
              onClick={handleChangePassword}
              className={getButtonClassName({
                className: 'h-11 w-full font-bold sm:w-auto sm:min-w-[12rem]',
              })}
            >
              {passwordPending
                ? 'جاري الحفظ…'
                : accountCopy.changePasswordSubmit}
            </button>
          </div>
        </AccountPanel>
      </AccountSection>

      <AccountModal
        open={editField !== null}
        title={editField === 'name' ? 'تعديل الاسم' : 'تعديل رقم الهاتف'}
        onClose={() => setEditField(null)}
      >
        <div className="space-y-4">
          {editField === 'name' ? (
            <>
              <Input
                id="edit-firstName"
                label="الاسم الأول"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                autoComplete="given-name"
              />
              <Input
                id="edit-lastName"
                label="اسم العائلة"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                autoComplete="family-name"
              />
            </>
          ) : (
            <Input
              id="edit-phone"
              label={accountCopy.phoneLabel}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              autoComplete="tel"
            />
          )}
          {error ? <p className="text-sm text-danger-600">{error}</p> : null}
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
