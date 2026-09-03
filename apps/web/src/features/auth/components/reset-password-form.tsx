'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { resetPasswordAction } from '../actions';
import { resetPasswordSchema } from '../schemas';
import { AuthShell } from './auth-shell';

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const legalFooter = (
    <>
      بالتسجيل فإنك توافق على{' '}
      <Link href="/terms" className="font-semibold text-brand-600 hover:underline">
        الشروط والأحكام
      </Link>
    </>
  );

  if (!token) {
    return (
      <AuthShell footer={legalFooter}>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-ink-950">رابط غير صالح</h1>
          <p className="mt-3 text-sm leading-7 text-ink-600">
            رابط إعادة تعيين كلمة المرور غير موجود أو غير مكتمل. اطلب رابطًا جديدًا.
          </p>
          <Link
            href={routes.auth.forgotPassword}
            className={getButtonClassName({ className: 'mt-8 h-12 w-full' })}
          >
            طلب رابط جديد
          </Link>
        </div>
      </AuthShell>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      return;
    }

    const form = event.currentTarget;
    const password =
      (form.elements.namedItem('password') as HTMLInputElement | null)?.value ??
      '';
    const confirmPassword =
      (form.elements.namedItem('confirmPassword') as HTMLInputElement | null)
        ?.value ?? '';

    const parsed = resetPasswordSchema.safeParse({
      token,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      setFormError(null);
      return;
    }

    setFieldErrors({});
    setFormError(null);

    startTransition(async () => {
      const result = await resetPasswordAction({
        token: parsed.data.token,
        password: parsed.data.password,
        confirmPassword: parsed.data.confirmPassword,
      });
      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.error);
        return;
      }

      router.push(`${routes.auth.login}?passwordReset=1`);
      router.refresh();
    });
  }

  return (
    <AuthShell footer={legalFooter}>
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-ink-950">إعادة تعيين كلمة المرور</h1>
        <p className="mt-2 text-sm text-ink-600">
          أدخل كلمة مرور جديدة لحسابك. يجب ألا تقل عن 8 أحرف وتشمل حرفًا ورقمًا.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="reset-password"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                id="reset-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={pending}
                className="h-12 w-full rounded-lg border border-border bg-white px-3 pe-11 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
                data-testid="reset-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 end-0 flex items-center px-3 text-ink-500"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="mt-1.5 text-xs text-danger-600">{fieldErrors.password}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="reset-confirm-password"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              تأكيد كلمة المرور
            </label>
            <input
              id="reset-confirm-password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              disabled={pending}
              className="h-12 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
              data-testid="reset-confirm-password"
            />
            {fieldErrors.confirmPassword ? (
              <p className="mt-1.5 text-xs text-danger-600">
                {fieldErrors.confirmPassword}
              </p>
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
            data-testid="reset-submit"
            disabled={pending}
            className={getButtonClassName({ className: 'h-12 w-full text-base' })}
          >
            {pending ? 'جاري الحفظ…' : 'حفظ كلمة المرور'}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
