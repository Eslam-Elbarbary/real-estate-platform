import { notFound, redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { ApiRequestError } from '@/lib/api/errors';
import { resolveStepRedirect } from '@/features/add-property/actions';
import { getListingDraftService } from '@/features/add-property/service';
import {
  canAccessListingStep,
  isPropertyEditable,
  listingDetailHref,
  preferredDestinationForStatus,
  resolveCheckoutAccess,
  stepHref,
} from '@/features/add-property/lib/step-access';
import type { ListingDraft, ListingDraftStep } from '@/features/add-property/types';

export async function requireListingDraftSession(returnTo: string) {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }
  return session;
}

export async function loadListingDraftForStep(
  id: string,
  step: ListingDraftStep | 'checkout',
): Promise<ListingDraft> {
  const path =
    step === 'checkout'
      ? routes.addProperty.step(id, 'checkout')
      : routes.addProperty.step(id, step);
  const session = await requireListingDraftSession(path);

  let draft: ListingDraft | null;
  try {
    draft = await getListingDraftService().getDraft(id, session.user.id);
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.code === 'UNAUTHORIZED' || error.status === 401)
    ) {
      redirect(
        `${routes.auth.login}?returnTo=${encodeURIComponent(path)}`,
      );
    }
    if (error instanceof ApiRequestError && (error.status === 403 || error.status === 404)) {
      notFound();
    }
    throw error;
  }

  if (!draft) notFound();

  // Submitted / published / archived never reopen the wizard.
  if (
    !isPropertyEditable(draft.apiStatus) &&
    draft.apiStatus !== 'PENDING_PAYMENT'
  ) {
    redirect(listingDetailHref(draft.id));
  }

  if (step === 'checkout') {
    if (!resolveCheckoutAccess(draft)) {
      redirect(preferredDestinationForStatus(draft));
    }
    return draft;
  }

  if (draft.apiStatus === 'PENDING_PAYMENT' && step !== 'publish') {
    redirect(stepHref(draft.id, 'checkout'));
  }

  if (!canAccessListingStep(draft, step)) {
    redirect(preferredDestinationForStatus(draft));
  }

  const redirectTo = await resolveStepRedirect(draft, step);
  if (redirectTo) redirect(redirectTo);
  return draft;
}
