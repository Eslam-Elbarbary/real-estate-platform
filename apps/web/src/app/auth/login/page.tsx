import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = createPageMetadata({
  title: 'تسجيل الدخول',
  description: 'سجّل الدخول إلى حسابك للوصول إلى أدوات تقييم العقارات.',
  path: routes.auth.login,
  noIndex: true,
});

interface LoginPageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

function safeReturnTo(value: string | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return routes.valuation.root;
  }
  return value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return <LoginForm returnTo={safeReturnTo(params.returnTo)} />;
}
