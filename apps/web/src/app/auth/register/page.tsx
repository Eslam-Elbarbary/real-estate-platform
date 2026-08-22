import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata = createPageMetadata({
  title: 'إنشاء حساب',
  description: 'أنشئ حسابًا جديدًا للوصول إلى تقييم العقارات ومتابعة نتائجك.',
  path: routes.auth.register,
  noIndex: true,
});

interface RegisterPageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

function safeReturnTo(value: string | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return routes.valuation.root;
  }
  return value;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  return <RegisterForm returnTo={safeReturnTo(params.returnTo)} />;
}
