import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingPaymentClient } from '@/features/add-property/components/steps/listing-payment-client';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { getListingDraftService } from '@/features/add-property/service';
import { listingCopy } from '@/features/add-property/config';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: listingCopy.checkoutPaymentTitle,
    description: 'أكمل دفع باقة نشر الإعلان.',
    path: routes.addProperty.step(id, 'checkout'),
    noIndex: true,
  });
}

export default async function ListingCheckoutPage({ params }: PageProps) {
  const { id } = await params;
  const draft = await loadListingDraftForStep(id, 'checkout');
  const subscription = await getListingDraftService().getOpenSubscription(id);

  if (!subscription || subscription.status !== 'PENDING') {
    redirect(routes.addProperty.step(id, 'publish'));
  }

  return (
    <ListingPaymentClient propertyId={draft.id} subscription={subscription} />
  );
}
