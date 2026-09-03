import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { VerifyEmailClient } from '@/features/auth/components/verify-email-client';

export const metadata = createPageMetadata({
  title: 'تأكيد البريد الإلكتروني',
  description: 'أكد بريدك الإلكتروني لإكمال إنشاء الحساب.',
  path: routes.auth.verifyEmail,
  noIndex: true,
});

function firstString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? '';
  }
  return value?.trim() ?? '';
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = firstString(params.token);
  const email = firstString(params.email);

  return <VerifyEmailClient token={token || undefined} email={email || undefined} />;
}
