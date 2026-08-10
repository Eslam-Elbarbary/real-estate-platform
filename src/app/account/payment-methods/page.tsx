import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { PaymentMethodsPageClient } from '@/features/account/components/payment-methods-page-client';
import { accountCopy } from '@/features/account/config/account-nav';

export const metadata = createPageMetadata({
  title: accountCopy.paymentMethodsTitle,
  description: 'إدارة بطاقات الدفع المحفوظة.',
  path: routes.account.paymentMethods,
  noIndex: true,
});

export default function AccountPaymentMethodsPage() {
  return <PaymentMethodsPageClient />;
}
