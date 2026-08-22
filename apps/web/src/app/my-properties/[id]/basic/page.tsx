import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getLocationOptions } from '@/features/locations';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { BasicStepForm } from '@/features/add-property/components/steps/basic-step-form';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: 'المعلومات الأساسية',
    description: 'أدخل المعلومات الأساسية لإعلانك.',
    path: routes.addProperty.step(id, 'basic'),
    noIndex: true,
  });
}

export default async function ListingBasicPage({ params }: PageProps) {
  const { id } = await params;
  const draft = await loadListingDraftForStep(id, 'basic');
  const locations = await getLocationOptions();

  return (
    <ListingWizardShell title="المعلومات الأساسية" draft={draft} currentStep="basic">
      <BasicStepForm draft={draft} locations={locations} />
    </ListingWizardShell>
  );
}
