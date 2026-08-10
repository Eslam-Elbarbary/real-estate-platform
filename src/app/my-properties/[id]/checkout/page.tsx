import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingCheckoutClient } from '@/features/add-property/components/steps/listing-checkout-client';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { getListingPublicationFee } from '@/features/add-property/lib/pricing';
import { listingCopy } from '@/features/add-property/config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: listingCopy.checkoutPaymentTitle,
    description: 'ادفع رسوم نشر الإعلان.',
    path: routes.addProperty.step(id, 'checkout'),
    noIndex: true,
  });
}

export default async function ListingCheckoutPage({ params }: PageProps) {
  const { id } = await params;
  const draft = await loadListingDraftForStep(id, 'checkout');
  const fee = getListingPublicationFee({
    transaction: draft.transaction,
    propertyType: draft.propertyType,
    locationId: draft.locationId,
  });

  return <ListingCheckoutClient draftId={draft.id} fee={fee} />;
}
