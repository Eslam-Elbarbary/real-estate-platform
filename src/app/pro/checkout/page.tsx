import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { getAccountService } from '@/features/account/service';
import { getSubscriptionPlanById } from '@/features/subscriptions/config';
import { ProCheckoutClient } from '@/features/subscriptions/components/pro-checkout-client';
import { parseProCheckoutSearchParams } from '@/features/subscriptions/search-params';

export const metadata = createPageMetadata({
  title: 'إتمام اشتراك برو',
  description: 'تفاصيل الدفع وملخص طلب اشتراك برو.',
  path: routes.pro.checkout,
  noIndex: true,
});

export default async function ProCheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const checkoutPath = `${routes.pro.checkout}?${new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) => {
      if (Array.isArray(value)) return value.map((v) => [key, v] as [string, string]);
      if (value == null) return [];
      return [[key, value] as [string, string]];
    }),
  ).toString()}`;

  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(checkoutPath)}`,
    );
  }

  const query = parseProCheckoutSearchParams(params);
  const plan = getSubscriptionPlanById(query.plan);
  if (!plan) {
    redirect(routes.pro.root);
  }

  const paymentMethods = await getAccountService().getPaymentMethods();

  return (
    <ProCheckoutClient
      plan={plan}
      billing={query.billing}
      initialPaymentMethods={paymentMethods}
    />
  );
}
