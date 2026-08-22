'use client';

import { PackageModalShell } from '@/features/packages/components/package-modal-shell';
import { getButtonClassName } from '@/components/ui/button';
import { subscriptionCopy } from '../config';

interface DemoPaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: () => void;
}

export function DemoPaymentMethodModal({
  open,
  onClose,
  onSelect,
}: DemoPaymentMethodModalProps) {
  return (
    <PackageModalShell
      open={open}
      onClose={onClose}
      title={subscriptionCopy.demoCardModalTitle}
      size="md"
      testId="demo-payment-modal"
    >
      <div className="space-y-4 py-3">
        <p className="text-sm leading-7 text-ink-600">
          {subscriptionCopy.successHint}
        </p>
        <div className="rounded-lg border border-[#e5e5e5] bg-surface-50 px-4 py-3 text-sm font-bold text-ink-900">
          {subscriptionCopy.demoCardOption}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onSelect}
            className={getButtonClassName({
              className: 'h-11 rounded-lg px-5 font-bold',
            })}
            data-testid="use-demo-card"
          >
            {subscriptionCopy.demoCardUse}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={getButtonClassName({
              variant: 'outline',
              className: 'h-11 rounded-lg px-5 font-bold',
            })}
          >
            {subscriptionCopy.demoCardCancel}
          </button>
        </div>
      </div>
    </PackageModalShell>
  );
}
