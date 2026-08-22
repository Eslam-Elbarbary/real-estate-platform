import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { createPageMetadata } from '@/lib/seo/metadata';
import { AuthShell } from '@/features/auth/components/auth-shell';
import { getServerSession } from '@/features/auth/session';

export const metadata = createPageMetadata({
  title: 'تأكيد البريد الإلكتروني',
  description: 'أكد بريدك الإلكتروني لإكمال إنشاء الحساب.',
  path: routes.auth.verifyEmail,
  noIndex: true,
});

export default async function VerifyEmailPage() {
  const session = await getServerSession();
  if (session) {
    redirect(routes.valuation.root);
  }

  return (
    <AuthShell
      footer={
        <>
          بالتسجيل فإنك توافق على{' '}
          <Link href="/terms" className="font-semibold text-brand-600 hover:underline">
            الشروط والأحكام
          </Link>
        </>
      }
    >
      <div className="mx-auto w-full max-w-sm text-center">
        <h1 className="text-2xl font-extrabold text-ink-950">
          تأكيد بريدك الإلكتروني
        </h1>
        <p className="mt-3 text-sm leading-7 text-ink-600">
          إذا أنشأت حسابًا جديدًا، ستصلك رسالة تفعيل عبر البريد الإلكتروني. يمكنك
          العودة لتسجيل الدخول أو إنشاء حساب.
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
