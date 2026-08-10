'use client';

import { useEffect, useId, useRef, useState, createElement } from 'react';
import { appIcons } from '@/config/icons';
import { getButtonClassName } from '@/components/ui/button';
import type { CreditPackage } from '@/features/credits/types';
import { packagePageCopy } from '../config/catalog';
import { cn } from '@/lib/utils/cn';

interface PackagePurchaseModalProps {
  open: boolean;
  onClose: () => void;
  pkg: CreditPackage;
  audienceLabel: string;
}

export function PackagePurchaseModal({
  open,
  onClose,
  pkg,
  audienceLabel,
}: PackagePurchaseModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [success, setSuccess] = useState(false);

  function handleClose() {
    setSuccess(false);
    onClose();
  }

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const node = dialogRef.current;
    const focusable = node?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSuccess(false);
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/45"
        aria-label="إغلاق"
        onClick={handleClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid="package-confirm-modal"
        className={cn(
          'relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg sm:p-6',
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-lg font-extrabold text-ink-950">
            {success
              ? packagePageCopy.confirmSuccess
              : packagePageCopy.confirmTitle}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex size-9 items-center justify-center rounded-md text-ink-600 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="إغلاق"
          >
            {createElement(appIcons.close, { size: 18, 'aria-hidden': true })}
          </button>
        </div>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm leading-7 text-ink-600">
              تم تسجيل اختيارك التجريبي للباقة بسعر{' '}
              <strong>
                {pkg.priceEgp.toLocaleString('en-US')}{' '}
                {packagePageCopy.priceSuffix}
              </strong>
              . لا يتم خصم أي مبلغ ولا يتغير رصيد النقاط في وضع العرض.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className={getButtonClassName({
                className: 'h-11 w-full font-bold',
              })}
            >
              {packagePageCopy.confirmClose}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <dl className="space-y-2 rounded-xl border border-[#e5e5e5] bg-surface-50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">نوع الحساب</dt>
                <dd className="font-bold text-ink-900">{audienceLabel}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-500">السعر</dt>
                <dd className="font-bold text-ink-900">
                  {pkg.priceEgp.toLocaleString('en-US')}{' '}
                  {packagePageCopy.priceSuffix}
                </dd>
              </div>
              {pkg.points != null ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500">النقاط</dt>
                  <dd className="font-bold text-ink-900">
                    {pkg.points.toLocaleString('en-US')}{' '}
                    {packagePageCopy.pointsUnit}
                  </dd>
                </div>
              ) : null}
            </dl>
            <ul className="max-h-40 space-y-1 overflow-y-auto text-xs leading-6 text-ink-600">
              {pkg.features
                .filter((feature) => feature.included === true)
                .slice(0, 6)
                .map((feature) => (
                  <li key={feature.key}>
                    • {feature.label}
                    {feature.value != null ? `: ${feature.value}` : ''}
                  </li>
                ))}
            </ul>
            <button
              type="button"
              data-testid="package-confirm-continue"
              onClick={() => setSuccess(true)}
              className={getButtonClassName({
                className: 'h-11 w-full font-bold',
              })}
            >
              {packagePageCopy.confirmContinue}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
