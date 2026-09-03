'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, LoaderCircle, Mail, XCircle } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { verifyEmailAction } from '../actions';
import { AuthShell } from './auth-shell';

type VerifyState = 'idle' | 'verifying' | 'success' | 'error';

interface VerifyEmailClientProps {
  token?: string;
  email?: string;
}

export function VerifyEmailClient({ token, email }: VerifyEmailClientProps) {
  const [state, setState] = useState<VerifyState>(token ? 'verifying' : 'idle');
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!token || started.current) {
      return;
    }
    started.current = true;

    void (async () => {
      const result = await verifyEmailAction(token);
      if (result.ok) {
        setState('success');
        return;
      }
      setError(result.error);
      setState('error');
    })();
  }, [token]);

  const legalFooter = (
    <>
      بالتسجيل فإنك توافق على{' '}
      <Link href="/terms" className="font-semibold text-brand-600 hover:underline">
        الشروط والأحكام
      </Link>
    </>
  );

  if (state === 'verifying') {
    return (
      <AuthShell footer={legalFooter}>
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <LoaderCircle size={28} className="animate-spin" aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold text-ink-950">جاري تأكيد البريد</h1>
          <p className="mt-3 text-sm leading-7 text-ink-600">
            نتحقق من رابط التفعيل. انتظر لحظة…
          </p>
        </div>
      </AuthShell>
    );
  }

  if (state === 'success') {
    return (
      <AuthShell footer={legalFooter}>
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-success-50 text-success-700">
            <CheckCircle2 size={28} aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold text-ink-950">تم تأكيد البريد</h1>
          <p className="mt-3 text-sm leading-7 text-ink-600">
            حسابك مفعّل الآن. يمكنك تسجيل الدخول والمتابعة.
          </p>
          <Link
            href={routes.auth.login}
            className={getButtonClassName({ className: 'mt-8 h-12 w-full' })}
          >
            تسجيل الدخول
          </Link>
        </div>
      </AuthShell>
    );
  }

  if (state === 'error') {
    return (
      <AuthShell footer={legalFooter}>
        <div className="mx-auto w-full max-w-sm text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-danger-50 text-danger-700">
            <XCircle size={28} aria-hidden />
          </div>
          <h1 className="text-2xl font-extrabold text-ink-950">تعذر تأكيد البريد</h1>
          <p className="mt-3 text-sm leading-7 text-ink-600">
            {error ?? 'رابط التفعيل غير صالح أو منتهٍ.'}
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={routes.auth.login}
              className={getButtonClassName({ className: 'h-12 w-full' })}
            >
              تسجيل الدخول
            </Link>
            <Link
              href={routes.auth.register}
              className="text-sm font-semibold text-brand-600 hover:underline"
            >
              إنشاء حساب
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell footer={legalFooter}>
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Mail size={28} aria-hidden />
        </div>
        <h1 className="text-2xl font-extrabold text-ink-950">تأكيد بريدك الإلكتروني</h1>
        <p className="mt-3 text-sm leading-7 text-ink-600">
          {email ? (
            <>
              أرسلنا تعليمات التفعيل إلى{' '}
              <span className="font-semibold text-ink-900">{email}</span>. افتح
              الرسالة واتبع الرابط لتفعيل الحساب.
            </>
          ) : (
            <>
              إذا أنشأت حسابًا جديدًا، ستصلك رسالة تفعيل عبر البريد الإلكتروني.
              افتح الرابط في الرسالة لإكمال التسجيل.
            </>
          )}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={routes.auth.login}
            className={getButtonClassName({ className: 'h-12 w-full' })}
          >
            تسجيل الدخول
          </Link>
          <Link
            href={routes.auth.register}
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            إنشاء حساب
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
