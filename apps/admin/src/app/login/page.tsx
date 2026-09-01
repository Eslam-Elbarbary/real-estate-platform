import { LoginForm } from '@/features/auth/components/login-form';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'تسجيل الدخول',
  description: 'دخول لوحة تحكم الإدارة.',
  path: '/login',
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const reason = Array.isArray(params.reason) ? params.reason[0] : params.reason;
  const sessionExpired = reason === 'session-expired';

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <LoginForm sessionExpired={sessionExpired} />
    </div>
  );
}
