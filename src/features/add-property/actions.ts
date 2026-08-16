'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { ListingDraftStorageError } from './repository';
import { getListingDraftService } from './service';
import {
  basicStepSchema,
  descriptionStepSchema,
  detailsStepSchema,
  mediaStepSchema,
  pricingStepSchema,
} from './schemas';
import type { ListingDraft, ListingDraftStep } from './types';
import { earliestIncompleteStep, stepHref } from './lib/step-access';

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function persistErrorMessage(error: unknown): string {
  if (error instanceof ListingDraftStorageError) return error.message;
  if (error instanceof Error && error.message === 'LISTING_DRAFT_PERSISTENCE_FAILED') {
    return 'تعذر حفظ المسودة';
  }
  if (error instanceof Error) return error.message;
  return 'تعذر حفظ المسودة';
}

async function requireUser() {
  const session = await getServerSession();
  if (!session) throw new Error('UNAUTHORIZED');
  return session.user;
}

export async function startListingDraftAction(): Promise<void> {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
    );
  }

  const draft = await getListingDraftService().startOrResumeDraft(session.user.id);
  const step = earliestIncompleteStep(draft);
  revalidatePath(routes.myProperties);
  redirect(routes.addProperty.step(draft.id, step));
}

export async function saveBasicStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = basicStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أكمل الحقول المطلوبة' };
  await requireUser();
  try {
    await getListingDraftService().updateBasic(id, parsed.data);
  } catch (error) {
    return { ok: false, error: persistErrorMessage(error) };
  }
  revalidatePath(routes.addProperty.step(id, 'basic'));
  return { ok: true, data: { href: routes.addProperty.step(id, 'details') } };
}

export async function saveDetailsStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = detailsStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أكمل تفاصيل العقار' };
  await requireUser();
  try {
    await getListingDraftService().updateDetails(id, {
      areaSqm: parsed.data.areaSqm,
      bedrooms: parsed.data.bedrooms,
      bathrooms: parsed.data.bathrooms,
      floor: parsed.data.floor,
      buildOrDeliveryYear: parsed.data.buildOrDeliveryYear,
      views: parsed.data.views as ListingDraft['details']['views'],
      finishing: parsed.data.finishing as ListingDraft['details']['finishing'],
      registrationStatus:
        parsed.data.registrationStatus as ListingDraft['details']['registrationStatus'],
      mortgageEligible: parsed.data.mortgageEligible,
      amenities: parsed.data.amenities as ListingDraft['details']['amenities'],
    });
  } catch (error) {
    return { ok: false, error: persistErrorMessage(error) };
  }
  return { ok: true, data: { href: routes.addProperty.step(id, 'price') } };
}

export async function savePriceStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = pricingStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أكمل بيانات السعر' };
  await requireUser();
  try {
    await getListingDraftService().updatePricing(id, parsed.data);
  } catch (error) {
    return { ok: false, error: persistErrorMessage(error) };
  }
  return { ok: true, data: { href: routes.addProperty.step(id, 'description') } };
}

export async function saveDescriptionStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = descriptionStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أكمل الوصف باللغة العربية' };
  await requireUser();
  try {
    await getListingDraftService().updateDescription(id, parsed.data);
  } catch (error) {
    return { ok: false, error: persistErrorMessage(error) };
  }
  return { ok: true, data: { href: routes.addProperty.step(id, 'media') } };
}

export async function saveMediaStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = mediaStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أضف صورة واحدةً واحدة على الأقل' };
  await requireUser();
  try {
    await getListingDraftService().updateMedia(id, {
      images: parsed.data.images,
      videoUrl: parsed.data.videoUrl,
    });
  } catch (error) {
    return { ok: false, error: persistErrorMessage(error) };
  }
  return { ok: true, data: { href: routes.addProperty.step(id, 'publish') } };
}

export async function publishListingDemoAction(
  id: string,
): Promise<ActionResult<{ href: string }>> {
  try {
    const user = await requireUser();
    await getListingDraftService().publishDemoListing(id, user.id);
    revalidatePath(routes.myProperties);
    return { ok: true, data: { href: `${routes.myProperties}?status=pending` } };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'تعذر نشر الإعلان',
    };
  }
}

export async function resolveStepRedirect(
  draft: ListingDraft,
  step: ListingDraftStep,
): Promise<string | null> {
  const allowed = getListingDraftService().assertStepAccess(draft, step);
  if (allowed === step) return null;
  return stepHref(draft.id, allowed);
}
