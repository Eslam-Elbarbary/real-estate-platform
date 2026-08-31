import { LoginForm } from '@/features/auth/components/login-form';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'تسجيل الدخول',
  description: 'دخول لوحة تحكم الإدارة.',
  path: '/login',
});

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <LoginForm />
    </div>
  );
}
