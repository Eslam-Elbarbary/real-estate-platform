'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { loginAction } from '../actions';
import { loginCredentialsSchema } from '../schemas';
import { AuthShell } from './auth-shell';

interface LoginFormProps {
  returnTo?: string;
  passwordChanged?: boolean;
  passwordReset?: boolean;
}

export function LoginForm({
  returnTo = routes.valuation.root,
  passwordChanged = false,
  passwordReset = false,
}: LoginFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email =
      (form.elements.namedItem('email') as HTMLInputElement | null)?.value ?? '';
    const password =
      (form.elements.namedItem('password') as HTMLInputElement | null)?.value ??
      '';
    const rememberMe =
      (form.elements.namedItem('rememberMe') as HTMLInputElement | null)
        ?.checked ?? true;

    const parsed = loginCredentialsSchema.safeParse({
      email,
      password,
      rememberMe,
    });

    if (!parsed.success) {
      const nextEmail =
        parsed.error.issues.find((issue) => issue.path[0] === 'email')
          ?.message ?? null;
      const nextPassword =
        parsed.error.issues.find((issue) => issue.path[0] === 'password')
          ?.message ?? null;
      setEmailError(nextEmail);
      setPasswordError(nextPassword);
      setFormError(null);
      return;
    }

    setEmailError(null);
    setPasswordError(null);
    setFormError(null);

    startTransition(async () => {
      const result = await loginAction({
        email: parsed.data.email,
        password: parsed.data.password,
        rememberMe: parsed.data.rememberMe,
      });

      if (!result.ok) {
        setFormError(result.error);
        return;
      }

      router.push(returnTo);
      router.refresh();
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
        <h1 className="text-2xl font-extrabold text-ink-950">تسجيل الدخول</h1>
        <p className="mt-2 text-sm text-ink-600">
          سجّل الدخول بالبريد الإلكتروني وكلمة المرور.
        </p>

        {passwordChanged ? (
          <p
            role="status"
            className="mt-4 rounded-md bg-success-50 px-3 py-2 text-sm text-success-800"
          >
            تم تغيير كلمة المرور بنجاح. سجّل الدخول بكلمة المرور الجديدة.
          </p>
        ) : null}

        {passwordReset ? (
          <p
            role="status"
            className="mt-4 rounded-md bg-success-50 px-3 py-2 text-sm text-success-800"
          >
            تم إعادة تعيين كلمة المرور. سجّل الدخول بكلمة المرور الجديدة.
          </p>
        ) : null}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              البريد الإلكتروني
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@example.com"
              disabled={pending}
              className="h-12 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
              data-testid="login-email"
            />
            {emailError ? (
              <p className="mt-1.5 text-xs text-danger-600">{emailError}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                disabled={pending}
                className="h-12 w-full rounded-lg border border-border bg-white px-3 pe-11 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
                data-testid="login-password"
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
            {passwordError ? (
              <p className="mt-1.5 text-xs text-danger-600">{passwordError}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="inline-flex items-center gap-2 text-ink-700">
              <input
                type="checkbox"
                name="rememberMe"
                defaultChecked
                disabled={pending}
                className="size-4 rounded border-border"
              />
              تذكرني
            </label>
            <Link
              href={routes.auth.forgotPassword}
              className="font-semibold text-brand-600 hover:underline"
            >
              نسيت كلمة السر؟
            </Link>
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
            data-testid="login-submit"
            disabled={pending}
            className={getButtonClassName({ className: 'h-12 w-full text-base' })}
          >
            {pending ? 'جاري تسجيل الدخول…' : 'تسجيل الدخول'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600">
          ليس لديك حساب؟{' '}
          <Link
            href={`${routes.auth.register}?returnTo=${encodeURIComponent(returnTo)}`}
            className="font-semibold text-brand-600 hover:underline"
          >
            إنشاء حساب
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
