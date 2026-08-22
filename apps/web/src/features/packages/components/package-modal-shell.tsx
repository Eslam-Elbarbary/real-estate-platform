'use client';

import {
  useEffect,
  useId,
  useRef,
  createElement,
  type ReactNode,
} from 'react';
import { appIcons } from '@/config/icons';
import { cn } from '@/lib/utils/cn';

interface PackageModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Wider dialog for FAQ/terms content. */
  size?: 'md' | 'lg';
  testId?: string;
}

export function PackageModalShell({
  open,
  onClose,
  title,
  children,
  size = 'lg',
  testId,
}: PackageModalShellProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

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
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/65"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid={testId}
        className={cn(
          'relative z-10 flex max-h-[min(88vh,720px)] w-full flex-col overflow-hidden rounded-xl bg-white shadow-lg',
          size === 'lg' ? 'max-w-2xl' : 'max-w-md',
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#e8e8e8] px-5 py-4 sm:px-6">
          <h2
            id={titleId}
            className="text-lg font-extrabold text-ink-950 sm:text-xl"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-md text-ink-600 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="إغلاق"
          >
            {createElement(appIcons.close, { size: 18, 'aria-hidden': true })}
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2 sm:px-6 sm:py-3">
          {children}
        </div>
      </div>
    </div>
  );
}
