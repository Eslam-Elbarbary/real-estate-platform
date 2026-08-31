import { PaymentDetails } from '@/features/payments/components/payment-details';
import { getAdminPaymentDetails } from '@/features/payments';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'تفاصيل الدفع',
  description: 'عرض تفاصيل عملية الدفع والاشتراك المرتبط.',
  path: '/payments',
});

export default async function PaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = await getAdminPaymentDetails(id);

  return <PaymentDetails payment={payment} />;
}
