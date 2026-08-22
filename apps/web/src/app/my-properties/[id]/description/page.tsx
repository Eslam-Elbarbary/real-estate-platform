import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { DescriptionStepForm } from '@/features/add-property/components/steps/description-step-form';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { listingCopy } from '@/features/add-property/config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: listingCopy.descriptionTitle,
    description: 'أضف وصف الإعلان بالعربية والإنجليزية.',
    path: routes.addProperty.step(id, 'description'),
    noIndex: true,
  });
}

export default async function ListingDescriptionPage({ params }: PageProps) {
  const { id } = await params;
  const draft = await loadListingDraftForStep(id, 'description');

  return (
    <ListingWizardShell
      title={listingCopy.descriptionTitle}
      draft={draft}
      currentStep="description"
    >
      <DescriptionStepForm draft={draft} />
    </ListingWizardShell>
  );
}
