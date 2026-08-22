'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Button, getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { completeDemoSessionAction, registerAction } from '../actions';
import {
  RESERVED_DEMO_EMAILS,
  RESERVED_DEMO_PHONES,
  registerSchema,
} from '../schemas';
import { AuthShell } from './auth-shell';

type RegisterStep = 'form' | 'verify' | 'sent';

interface RegisterFormProps {
  returnTo?: string;
}

export function RegisterForm({
  returnTo = routes.valuation.root,
}: RegisterFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>('form');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function handleCreate() {
    const values = {
      name:
        (document.getElementById('register-name') as HTMLInputElement | null)
          ?.value ?? '',
      email:
        (document.getElementById('register-email') as HTMLInputElement | null)
          ?.value ?? '',
      phone:
        (document.getElementById('register-phone') as HTMLInputElement | null)
          ?.value ?? '',
      password:
        (document.getElementById('register-password') as HTMLInputElement | null)
          ?.value ?? '',
    };

    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? 'form');
        if (!next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      return;
    }

    const reservedErrors: Record<string, string> = {};
    if (RESERVED_DEMO_EMAILS.has(parsed.data.email.toLowerCase())) {
      reservedErrors.email = 'هذا البريد الإلكتروني مسجّل بالفعل';
    }
    if (RESERVED_DEMO_PHONES.has(parsed.data.phone)) {
      reservedErrors.phone = 'رقم الهاتف مسجّل بالفعل';
    }
    if (Object.keys(reservedErrors).length > 0) {
      setFieldErrors(reservedErrors);
      return;
    }

    startTransition(async () => {
      const result = await registerAction(parsed.data);
      if (!result.ok) {
        setFieldErrors(result.fieldErrors);
        return;
      }
      setFieldErrors({});
      setEmail(parsed.data.email);
      setStep('verify');
    });
  }

  function finishSession() {
    startTransition(async () => {
      await completeDemoSessionAction();
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

  if (step === 'sent') {
    return (
      <AuthShell footer={legalFooter}>
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-success-50 text-success-700">
            <Mail size={28} aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold text-ink-950">
            تم إرسال رابط التفعيل بنجاح
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-600">
            تحقق من بريدك الإلكتروني واتبع الرابط لتفعيل الحساب. لأغراض العرض
            يمكنك المتابعة مباشرة.
          </p>
          <Button type="button" className="mt-8 w-full" onClick={finishSession} disabled={pending}>
            متابعة إلى المنصة
          </Button>
        </div>
      </AuthShell>
    );
  }

  if (step === 'verify') {
    return (
      <AuthShell footer={legalFooter}>
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Mail size={28} aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold text-ink-950">
            تأكيد بريدك الإلكتروني
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-600">
            أرسلنا تعليمات التفعيل إلى{' '}
            <span className="font-semibold text-ink-900">{email}</span>. فعّل
            حسابك للوصول الكامل إلى أدوات التقييم.
          </p>
          <Button
            type="button"
            className="mt-8 w-full"
            onClick={() => setStep('sent')}
            disabled={pending}
          >
            احصل على رابط التفعيل
          </Button>
          <button
            type="button"
            className="mt-4 text-sm font-semibold text-ink-600 hover:text-ink-900"
            onClick={finishSession}
            disabled={pending}
          >
            تخطي
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={legalFooter}>
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-2xl font-extrabold text-ink-950">إنشاء حساب</h1>
        <p className="mt-2 text-sm text-ink-600">
          أنشئ حسابًا جديدًا للوصول إلى تقييم العقارات ومتابعة نتائجك.
        </p>

        <div className="mt-8 space-y-4">
          {(
            [
              ['name', 'الاسم', 'text', 'name'],
              ['email', 'البريد الإلكتروني', 'email', 'email'],
              ['phone', 'رقم الهاتف', 'tel', 'tel'],
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
                className="h-12 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
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
            {fieldErrors.password ? (
              <p className="mt-1.5 text-xs text-danger-600" data-testid="error-password">
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            data-testid="register-submit"
            disabled={pending}
            className={getButtonClassName({ className: 'h-12 w-full text-base' })}
            onClick={handleCreate}
          >
            إنشاء
          </button>
        </div>

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
