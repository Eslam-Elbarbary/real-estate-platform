import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { DetailsStepForm } from '@/features/add-property/components/steps/details-step-form';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { fetchFeatures } from '@/features/properties/api/catalogs';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: 'تفاصيل العقار',
    description: 'أدخل تفاصيل العقار والمزايا.',
    path: routes.addProperty.step(id, 'details'),
    noIndex: true,
  });
}

export default async function ListingDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [draft, features] = await Promise.all([
    loadListingDraftForStep(id, 'details'),
    fetchFeatures(),
  ]);

  return (
    <ListingWizardShell title="تفاصيل العقار" draft={draft} currentStep="details">
      <DetailsStepForm draft={draft} features={features} />
    </ListingWizardShell>
  );
}
