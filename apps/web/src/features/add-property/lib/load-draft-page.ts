import { notFound, redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { ApiRequestError } from '@/lib/api/errors';
import { resolveStepRedirect } from '@/features/add-property/actions';
import { getListingDraftService } from '@/features/add-property/service';
import {
  preferredStepForStatus,
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

  if (step === 'checkout') {
    if (!resolveCheckoutAccess(draft)) {
      const preferred = preferredStepForStatus(draft);
      redirect(
        preferred === 'checkout'
          ? stepHref(draft.id, 'publish')
          : preferred === 'publish'
            ? stepHref(draft.id, 'publish')
            : stepHref(draft.id, preferred),
      );
    }
    return draft;
  }

  if (draft.apiStatus === 'PENDING_PAYMENT' && step !== 'publish') {
    redirect(stepHref(draft.id, 'checkout'));
  }

  const redirectTo = await resolveStepRedirect(draft, step);
  if (redirectTo) redirect(redirectTo);
  return draft;
}
