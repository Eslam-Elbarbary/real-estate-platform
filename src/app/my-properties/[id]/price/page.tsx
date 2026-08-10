import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { PriceStepForm } from '@/features/add-property/components/steps/price-step-form';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { listingCopy } from '@/features/add-property/config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: listingCopy.price,
    description: 'حدد سعر العقار وطريقة الدفع.',
    path: routes.addProperty.step(id, 'price'),
    noIndex: true,
  });
}

export default async function ListingPricePage({ params }: PageProps) {
  const { id } = await params;
  const draft = await loadListingDraftForStep(id, 'price');

  return (
    <ListingWizardShell title="سعر العقار" draft={draft} currentStep="price">
      <PriceStepForm draft={draft} />
    </ListingWizardShell>
  );
}
