import { notFound, redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { resolveStepRedirect } from '@/features/add-property/actions';
import { getListingDraftService } from '@/features/add-property/service';
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
  await requireListingDraftSession(path);

  const draft = await getListingDraftService().getDraft(id);
  if (!draft) notFound();

  if (step === 'checkout') {
    const allowed = await resolveStepRedirect(draft, 'publish');
    if (allowed) redirect(allowed);
    return draft;
  }

  const redirectTo = await resolveStepRedirect(draft, step);
  if (redirectTo) redirect(redirectTo);
  return draft;
}
