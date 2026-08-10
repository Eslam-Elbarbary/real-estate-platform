import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { PublishPreview } from '@/features/add-property/components/steps/publish-preview';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { listingCopy } from '@/features/add-property/config';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: listingCopy.publishTitle,
    description: 'راجع إعلانك وادفع لنشره.',
    path: routes.addProperty.step(id, 'publish'),
    noIndex: true,
  });
}

export default async function ListingPublishPage({ params }: PageProps) {
  const { id } = await params;
  const draft = await loadListingDraftForStep(id, 'publish');

  return (
    <ListingWizardShell
      title={listingCopy.publishTitle}
      draft={draft}
      currentStep="publish"
    >
      <PublishPreview draft={draft} />
    </ListingWizardShell>
  );
}
