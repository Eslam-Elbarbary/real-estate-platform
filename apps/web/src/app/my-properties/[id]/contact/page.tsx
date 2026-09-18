import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { ContactStepForm } from '@/features/add-property/components/steps/contact-step';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { listingCopy } from '@/features/add-property/config';
import { getServerSession } from '@/features/auth/session';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: listingCopy.contactTitle,
    description: 'حدد كيف يتواصل العملاء معك بشأن هذا العقار.',
    path: routes.addProperty.step(id, 'contact'),
    noIndex: true,
  });
}

export default async function ListingContactPage({ params }: PageProps) {
  const { id } = await params;
  const draft = await loadListingDraftForStep(id, 'contact');
  const session = await getServerSession();

  return (
    <ListingWizardShell
      title={listingCopy.contactTitle}
      draft={draft}
      currentStep="contact"
    >
      <ContactStepForm
        draft={draft}
        accountName={session?.user.name ?? ''}
        accountPhone={session?.user.phone ?? null}
      />
    </ListingWizardShell>
  );
}
