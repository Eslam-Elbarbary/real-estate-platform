import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { MediaStepForm } from '@/features/add-property/components/steps/media-step-form';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { listingCopy } from '@/features/add-property/config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: listingCopy.mediaTitle,
    description: 'أضف صور وفيديو للإعلان.',
    path: routes.addProperty.step(id, 'media'),
    noIndex: true,
  });
}

export default async function ListingMediaPage({ params }: PageProps) {
  const { id } = await params;
  const draft = await loadListingDraftForStep(id, 'media');

  return (
    <ListingWizardShell title={listingCopy.mediaTitle} draft={draft} currentStep="media">
      <MediaStepForm draft={draft} />
    </ListingWizardShell>
  );
}
