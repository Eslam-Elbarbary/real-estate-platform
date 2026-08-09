'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Button, getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import {
  loginWithCredentialsAction,
  loginWithMagicLinkAction,
} from '../actions';
import {
  loginIdentifierSchema,
  loginPasswordSchema,
} from '../schemas';
import { AuthShell } from './auth-shell';

type LoginStep = 'identifier' | 'password' | 'magic-sent';

interface LoginFormProps {
  returnTo?: string;
}

export function LoginForm({ returnTo = routes.valuation.root }: LoginFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [socialMessage, setSocialMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleIdentifierNext() {
    const value =
      (document.getElementById('login-identifier') as HTMLInputElement | null)
        ?.value ?? '';
    const parsed = loginIdentifierSchema.safeParse({ identifier: value });
    if (!parsed.success) {
      setIdentifierError(parsed.error.issues[0]?.message ?? 'قيمة غير صالحة');
      return;
    }
    setIdentifierError(null);
    setIdentifier(parsed.data.identifier);
    setStep('password');
  }

  function handlePasswordSubmit() {
    const password =
      (document.getElementById('login-password') as HTMLInputElement | null)
        ?.value ?? '';
    const rememberMe =
      (document.querySelector('input[name="rememberMe"]') as HTMLInputElement | null)
        ?.checked ?? true;
    const parsed = loginPasswordSchema.safeParse({ password, rememberMe });
    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message ?? 'قيمة غير صالحة');
      return;
    }
    setPasswordError(null);
    startTransition(async () => {
      const result = await loginWithCredentialsAction({
        identifier,
        password: parsed.data.password,
        rememberMe: parsed.data.rememberMe,
      });
      if (result.ok) {
        router.push(returnTo);
        router.refresh();
      }
    });
  }

  function onMagicLink() {
    startTransition(async () => {
      await loginWithMagicLinkAction({ identifier });
      setStep('magic-sent');
    });
  }

  function onSocialClick() {
    setSocialMessage('سيتم تفعيل تسجيل الدخول الاجتماعي لاحقًا');
    window.setTimeout(() => setSocialMessage(null), 2800);
  }

  const legalFooter = (
    <>
      بالتسجيل فإنك توافق على{' '}
      <Link href="/terms" className="font-semibold text-brand-600 hover:underline">
        الشروط والأحكام
      </Link>
    </>
  );

  if (step === 'magic-sent') {
    return (
      <AuthShell footer={legalFooter}>
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Mail size={28} aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold text-ink-950">
            تم إرسال رابط تسجيل الدخول
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-600">
            أرسلنا رابط التحقق إلى{' '}
            <span className="font-semibold text-ink-900">{identifier}</span>. الرابط
            صالح لمدة 10 دقائق.
          </p>
          {process.env.NODE_ENV !== 'production' ? (
            <Button
              type="button"
              className="mt-8 w-full"
              onClick={() => {
                startTransition(async () => {
                  await loginWithCredentialsAction({
                    identifier,
                    password: 'demo',
                  });
                  router.push(returnTo);
                  router.refresh();
                });
              }}
              disabled={pending}
            >
              متابعة العرض التجريبي
            </Button>
          ) : null}
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-brand-600 hover:underline"
            onClick={() => setStep('password')}
          >
            العودة لتسجيل الدخول بكلمة المرور
          </button>
        </div>
      </AuthShell>
    );
  }

  if (step === 'password') {
    return (
      <AuthShell footer={legalFooter}>
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-ink-950">تسجيل الدخول</h1>
          <p className="mt-2 text-sm text-ink-600">
            أدخل كلمة المرور للمتابعة إلى حساب{' '}
            <span className="font-semibold text-ink-900">{identifier}</span>
          </p>

          <div className="mt-8 space-y-4">
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
                  className="h-12 w-full rounded-lg border border-border bg-white px-3 pe-11 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
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
                  className="size-4 rounded border-border"
                />
                تذكرني
              </label>
              <button
                type="button"
                className="font-semibold text-brand-600 hover:underline"
              >
                نسيت كلمة السر؟
              </button>
            </div>

            <button
              type="button"
              data-testid="login-submit"
              disabled={pending}
              className={getButtonClassName({ className: 'h-12 w-full text-base' })}
              onClick={handlePasswordSubmit}
            >
              تسجيل الدخول
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
            <span className="h-px flex-1 bg-border" />
            أو
            <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            className={getButtonClassName({
              variant: 'outline',
              className: 'h-12 w-full',
            })}
            onClick={onMagicLink}
            disabled={pending}
          >
            تسجيل الدخول باستخدام رابط التحقق
          </button>

          <button
            type="button"
            className="mt-4 text-sm text-ink-500 hover:text-ink-800"
            onClick={() => setStep('identifier')}
          >
            تغيير البريد أو رقم الهاتف
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={legalFooter}>
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-ink-950">
          تسجيل الدخول / إنشاء حساب
        </h1>

        <div className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="login-identifier"
              className="mb-1.5 block text-sm font-semibold text-ink-800"
            >
              البريد الإلكتروني أو رقم الهاتف
            </label>
            <input
              id="login-identifier"
              name="identifier"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="اكتب الموبايل أو بريد الإلكتروني"
              className="h-12 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            {identifierError ? (
              <p className="mt-1.5 text-xs text-danger-600">{identifierError}</p>
            ) : null}
          </div>

          <button
            type="button"
            data-testid="login-next"
            className={getButtonClassName({ className: 'h-12 w-full text-base' })}
            onClick={handleIdentifierNext}
          >
            التالي
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
          <span className="h-px flex-1 bg-border" />
          أو
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          {(
            [
              ['Google', 'تسجيل عبر جوجل'],
              ['Facebook', 'تسجيل عبر فيسبوك'],
              ['Apple', 'تسجيل عبر أبل'],
            ] as const
          ).map(([provider, label]) => (
            <button
              key={provider}
              type="button"
              onClick={onSocialClick}
              className={cn(
                getButtonClassName({
                  variant: 'outline',
                  className: 'h-12 w-full justify-center gap-2',
                }),
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {socialMessage ? (
          <p
            role="status"
            className="mt-4 rounded-md bg-surface-100 px-3 py-2 text-center text-sm text-ink-700"
          >
            {socialMessage}
          </p>
        ) : null}

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
