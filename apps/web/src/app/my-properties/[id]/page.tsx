import { notFound, redirect } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { createPageMetadata } from '@/lib/seo/metadata';
import {
  getServerSession,
  withRefreshedAccessToken,
} from '@/features/auth/session';
import { fetchMyPropertyById } from '@/data/repositories/api-property-drafts';
import { fetchMyPropertyStatusHistory } from '@/data/repositories/api-my-properties';
import { getListingDraftService } from '@/features/add-property/service';
import {
  earliestIncompleteStep,
  preferredDestinationForStatus,
} from '@/features/add-property/lib/step-access';
import { OwnerPropertyStatusView } from '@/features/my-properties/components/owner-property-status-view';
import { myPropertiesCopy } from '@/features/my-properties/config/copy';
import { fetchPropertyTypes } from '@/features/properties/api/catalogs';
import { catalogPropertyTypeLabel } from '@/features/properties/lib/property-type-options';
import { ApiRequestError } from '@/lib/api/errors';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return createPageMetadata({
    title: myPropertiesCopy.statusPageTitle,
    description: 'عرض حالة إعلانك.',
    path: routes.myProperty(id),
    noIndex: true,
  });
}

export default async function MyPropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.myProperty(id))}`,
    );
  }

  try {
    const service = getListingDraftService();
    const [property, history, subscription, propertyTypes] = await Promise.all([
      withRefreshedAccessToken((token) => fetchMyPropertyById(token, id)),
      withRefreshedAccessToken((token) =>
        fetchMyPropertyStatusHistory(token, id),
      ).catch(() => []),
      service.getOpenSubscription(id).catch(() => null),
      fetchPropertyTypes().catch(() => []),
    ]);

    // Editable drafts continue in the wizard.
    if (property.status === 'DRAFT') {
      const draft = await service.getDraft(id, session.user.id);
      if (draft) {
        redirect(preferredDestinationForStatus(draft));
      }
      redirect(routes.addProperty.step(id, 'basic'));
    }

    const typeMatch = propertyTypes.find(
      (item) => item.id === property.propertyTypeId,
    );
    const propertyTypeLabel = typeMatch
      ? catalogPropertyTypeLabel(typeMatch)
      : undefined;

    const draft =
      property.status === 'REJECTED'
        ? await service.getDraft(id, session.user.id).catch(() => null)
        : null;
    const editHref = draft
      ? routes.addProperty.step(draft.id, earliestIncompleteStep(draft))
      : routes.addProperty.step(id, 'basic');

    return (
      <section className="bg-surface-50 py-8 sm:py-12">
        <Container className="max-w-3xl">
          <OwnerPropertyStatusView
            property={property}
            propertyTypeLabel={propertyTypeLabel}
            history={history}
            subscription={subscription}
            editHref={editHref}
          />
        </Container>
      </section>
    );
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.code === 'UNAUTHORIZED' || error.status === 401)
    ) {
      redirect(
        `${routes.auth.login}?returnTo=${encodeURIComponent(routes.myProperty(id))}`,
      );
    }
    if (
      error instanceof ApiRequestError &&
      (error.status === 403 || error.status === 404)
    ) {
      notFound();
    }
    throw error;
  }
}
