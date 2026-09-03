'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { registerAction } from '../actions';
import { registerSchema } from '../schemas';
import { AuthShell } from './auth-shell';

interface RegisterFormProps {
  returnTo?: string;
}

export function RegisterForm({
  returnTo = routes.valuation.root,
}: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = {
      firstName:
        (form.elements.namedItem('firstName') as HTMLInputElement | null)
          ?.value ?? '',
      lastName:
        (form.elements.namedItem('lastName') as HTMLInputElement | null)
          ?.value ?? '',
      email:
        (form.elements.namedItem('email') as HTMLInputElement | null)?.value ??
        '',
      phone:
        (form.elements.namedItem('phone') as HTMLInputElement | null)?.value ??
        '',
      password:
        (form.elements.namedItem('password') as HTMLInputElement | null)
          ?.value ?? '',
    };

    const parsed = registerSchema.safeParse({
      ...values,
      phone: values.phone.trim() || undefined,
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
      const result = await registerAction(parsed.data);
      if (!result.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.error ?? null);
        return;
      }

      const params = new URLSearchParams({
        email: parsed.data.email,
      });
      if (returnTo) {
        params.set('returnTo', returnTo);
      }
      router.push(`${routes.auth.verifyEmail}?${params.toString()}`);
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

  return (
    <AuthShell footer={legalFooter}>
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-ink-950">إنشاء حساب</h1>
        <p className="mt-2 text-sm text-ink-600">
          أنشئ حسابًا جديدًا ثم فعّل بريدك الإلكتروني للمتابعة.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          {(
            [
              ['firstName', 'الاسم الأول', 'text', 'given-name'],
              ['lastName', 'اسم العائلة', 'text', 'family-name'],
              ['email', 'البريد الإلكتروني', 'email', 'email'],
              ['phone', 'رقم الهاتف (اختياري)', 'tel', 'tel'],
            ] as const
          ).map(([field, label, type, autoComplete]) => (
            <div key={field}>
              <label
                htmlFor={`register-${field}`}
                className="mb-1.5 block text-sm font-semibold text-ink-800"
              >
                {label}
              </label>
              <input
                id={`register-${field}`}
                name={field}
                type={type}
                autoComplete={autoComplete}
                disabled={pending}
                className="h-12 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
              />
              {fieldErrors[field] ? (
                <p className="mt-1.5 text-xs text-danger-600" data-testid={`error-${field}`}>
                  {fieldErrors[field]}
                </p>
              ) : null}
            </div>
          ))}

          <div>
            <label
              htmlFor="register-password"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={pending}
                className="h-12 w-full rounded-lg border border-border bg-white px-3 pe-11 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
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
              <p className="mt-1.5 text-xs text-danger-600" data-testid="error-password">
                {fieldErrors.password}
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
            data-testid="register-submit"
            disabled={pending}
            className={getButtonClassName({ className: 'h-12 w-full text-base' })}
          >
            {pending ? 'جاري إنشاء الحساب…' : 'إنشاء حساب'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600">
          لديك حساب بالفعل؟{' '}
          <Link
            href={`${routes.auth.login}?returnTo=${encodeURIComponent(returnTo)}`}
            className="font-semibold text-brand-600 hover:underline"
          >
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
