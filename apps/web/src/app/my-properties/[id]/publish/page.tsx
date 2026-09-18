import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { ListingWizardShell } from '@/features/add-property/components/listing-wizard-shell';
import { ListingSubmissionClient } from '@/features/add-property/components/steps/listing-submission-client';
import { loadListingDraftForStep } from '@/features/add-property/lib/load-draft-page';
import { getListingDraftService } from '@/features/add-property/service';
import { listingCopy } from '@/features/add-property/config';
import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: listingCopy.publishTitle,
    description: 'راجع اكتمال الإعلان واختر الباقة.',
    path: routes.addProperty.step(id, 'publish'),
    noIndex: true,
  });
}

export default async function ListingPublishPage({ params }: PageProps) {
  const { id } = await params;
  const draft = await loadListingDraftForStep(id, 'publish');

  if (draft.apiStatus === 'PENDING_PAYMENT') {
    redirect(routes.addProperty.step(id, 'checkout'));
  }

  // PENDING_REVIEW / PUBLISHED / etc. never stay on the publish wizard step.
  if (
    draft.apiStatus === 'PENDING_REVIEW' ||
    draft.apiStatus === 'PUBLISHED' ||
    draft.apiStatus === 'ARCHIVED' ||
    draft.apiStatus === 'EXPIRED'
  ) {
    redirect(routes.myProperty(id));
  }

  const service = getListingDraftService();
  const [completion, plans, subscription] = await Promise.all([
    service.getCompletion(id),
    service.listPlans(),
    service.getOpenSubscription(id),
  ]);

  return (
    <ListingWizardShell
      title={listingCopy.publishTitle}
      draft={draft}
      currentStep="publish"
    >
      <ListingSubmissionClient
        draft={draft}
        completion={completion}
        plans={plans}
        subscription={subscription}
      />
    </ListingWizardShell>
  );
}
