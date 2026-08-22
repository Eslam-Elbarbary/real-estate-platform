'use client';

import { useState } from 'react';
import { getButtonClassName } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { demoCardSchema } from '../schemas';
import { accountCopy } from '../config/account-nav';
import { AccountModal } from './account-modal';
import { AccountEmptyState, AccountSection } from './account-primitives';

export function PaymentMethodsPageClient() {
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function handleSave() {
    const parsed = demoCardSchema.safeParse({ nickname });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'قيمة غير صالحة');
      return;
    }
    setError(null);
    setSavedMessage(
      `تم حفظ البطاقة التجريبية «${parsed.data.nickname}» للعرض فقط — لا تُخزَّن بيانات دفع حقيقية.`,
    );
    setOpen(false);
    setNickname('');
  }

  return (
    <>
      <AccountSection
        title={accountCopy.paymentMethodsTitle}
        description={accountCopy.paymentMethodsSubtitle}
      >
        <AccountEmptyState
          icon="accountCards"
          title={accountCopy.paymentEmptyTitle}
          ctaLabel={accountCopy.add}
          onCtaClick={() => {
            setSavedMessage(null);
            setOpen(true);
          }}
        />
        {savedMessage ? (
          <p className="mt-4 text-sm text-ink-600" role="status">
            {savedMessage}
          </p>
        ) : null}
      </AccountSection>

      <AccountModal
        open={open}
        title={accountCopy.demoCardTitle}
        onClose={() => setOpen(false)}
      >
        <p className="mb-4 text-xs leading-6 text-ink-500">
          {accountCopy.demoNoGateway}
        </p>
        <Input
          id="demo-card-nickname"
          label={accountCopy.demoCardNickname}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          error={error ?? undefined}
        />
        <button
          type="button"
          onClick={handleSave}
          className={getButtonClassName({
            className: 'mt-4 h-11 w-full font-bold',
          })}
        >
          {accountCopy.save}
        </button>
      </AccountModal>
    </>
  );
}
