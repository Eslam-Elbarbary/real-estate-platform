import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';

export const metadata = createPageMetadata({
  title: 'إعادة تعيين كلمة المرور',
  description: 'عيّن كلمة مرور جديدة لحسابك.',
  path: routes.auth.resetPassword,
  noIndex: true,
});

function firstString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? '';
  }
  return value?.trim() ?? '';
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = firstString(params.token);

  return <ResetPasswordForm token={token || undefined} />;
}
