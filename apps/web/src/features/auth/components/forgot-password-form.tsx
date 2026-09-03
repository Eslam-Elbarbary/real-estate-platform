'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { forgotPasswordAction } from '../actions';
import { forgotPasswordSchema } from '../schemas';
import { AuthShell } from './auth-shell';

export function ForgotPasswordForm() {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email =
      (form.elements.namedItem('email') as HTMLInputElement | null)?.value ?? '';

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message ?? 'البريد الإلكتروني غير صالح');
      setFormError(null);
      return;
    }

    setEmailError(null);
    setFormError(null);

    startTransition(async () => {
      const result = await forgotPasswordAction(parsed.data.email);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      setSubmittedEmail(parsed.data.email);
    });
  }

  const legalFooter = (
    <>
      بالتسجيل فإنك توافق على{' '}
      <Link href="/terms" className="font-semibold text-brand-600 hover:underline">
        الشروط والأحكام
      </Link>
    </>
  );

  if (submittedEmail) {
    return (
      <AuthShell footer={legalFooter}>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-ink-950">تحقق من بريدك</h1>
          <p
            role="status"
            className="mt-3 text-sm leading-7 text-ink-600"
          >
            إذا كان هناك حساب مرتبط بهذا البريد، ستصلك تعليمات إعادة تعيين كلمة
            المرور.
          </p>
          <Link
            href={routes.auth.login}
            className={getButtonClassName({ className: 'mt-8 h-12 w-full' })}
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={legalFooter}>
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-ink-950">نسيت كلمة المرور؟</h1>
        <p className="mt-2 text-sm text-ink-600">
          أدخل بريدك الإلكتروني وسنرسل تعليمات إعادة التعيين إن وُجد حساب مرتبط به.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="forgot-email"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              البريد الإلكتروني
            </label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@example.com"
              disabled={pending}
              className="h-12 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
              data-testid="forgot-email"
            />
            {emailError ? (
              <p className="mt-1.5 text-xs text-danger-600">{emailError}</p>
            ) : null}
          </div>

          {formError ? (
            <p
              role="alert"
              className="rounded-md bg-danger-50 px-3 py-2 text-sm text-danger-700"
            >
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            data-testid="forgot-submit"
            disabled={pending}
            className={getButtonClassName({ className: 'h-12 w-full text-base' })}
          >
            {pending ? 'جاري الإرسال…' : 'إرسال التعليمات'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600">
          تذكرت كلمة المرور؟{' '}
          <Link
            href={routes.auth.login}
            className="font-semibold text-brand-600 hover:underline"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
