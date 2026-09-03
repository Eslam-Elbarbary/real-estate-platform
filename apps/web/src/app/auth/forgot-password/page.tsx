import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata = createPageMetadata({
  title: 'نسيت كلمة المرور',
  description: 'اطلب رابطًا لإعادة تعيين كلمة مرور حسابك.',
  path: routes.auth.forgotPassword,
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
