import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { BasicStepForm } from '@/features/add-property/components/steps/basic-step-form';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import {
  fetchLocationTree,
  fetchPropertyTypes,
} from '@/features/properties/api/catalogs';

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
  const [locationTree, propertyTypes] = await Promise.all([
    fetchLocationTree(),
    fetchPropertyTypes(),
  ]);

  const propertyTypeOptions = propertyTypes.map((item) => ({
    value: item.code.toLowerCase(),
    label: item.nameAr?.trim() || item.nameEn,
    id: item.id,
  }));

  return (
    <ListingWizardShell title="المعلومات الأساسية" draft={draft} currentStep="basic">
      <BasicStepForm
        draft={draft}
        locationTree={locationTree}
        propertyTypeOptions={propertyTypeOptions}
      />
    </ListingWizardShell>
  );
}
