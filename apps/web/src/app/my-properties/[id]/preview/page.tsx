import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { PreviewStep } from '@/features/add-property/components/steps/preview-step';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { listingCopy } from '@/features/add-property/config';
import { getSearchLocationOptions } from '@/features/locations/api-options';
import {
  fetchFeatures,
  fetchLegalStatuses,
  fetchPropertyViews,
} from '@/features/properties/api/catalogs';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: listingCopy.previewTitle,
    description: 'معاينة الإعلان قبل الإرسال للمراجعة.',
    path: routes.addProperty.step(id, 'preview'),
    noIndex: true,
  });
}

export default async function ListingPreviewPage({ params }: PageProps) {
  const { id } = await params;
  const [draft, features, locations, propertyViews, legalStatuses] =
    await Promise.all([
      loadListingDraftForStep(id, 'preview'),
      fetchFeatures().catch(() => []),
      getSearchLocationOptions().catch(() => []),
      fetchPropertyViews().catch(() => []),
      fetchLegalStatuses().catch(() => []),
    ]);

  return (
    <ListingWizardShell
      title={listingCopy.previewTitle}
      draft={draft}
      currentStep="preview"
      unboxed
    >
      <PreviewStep
        draft={draft}
        features={features}
        locations={locations}
        propertyViews={propertyViews}
        legalStatuses={legalStatuses}
      />
    </ListingWizardShell>
  );
}
