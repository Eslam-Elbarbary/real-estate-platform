'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { getSearchLocationOptions } from '@/features/locations/api-options';
import { ApiRequestError } from '@/lib/api/errors';
import { ListingDraftStorageError } from './repository';
import { getListingDraftService } from './service';
import {
  basicStepSchema,
  contactStepSchema,
  descriptionStepSchema,
  detailsStepSchema,
  mediaStepSchema,
  pricingStepSchema,
} from './schemas';
import type { ListingDraft, ListingDraftStep, ListingImageDraft } from './types';
import {
  listingDetailHref,
  preferredDestinationForStatus,
  stepHref,
  earliestIncompleteWizardStep,
} from './lib/step-access';
import { decideAddPropertyEntry } from './lib/resume-policy';

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; href?: string };

const ACCEPT_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

function persistErrorMessage(error: unknown): string {
  if (error instanceof ListingDraftStorageError) return error.message;
  if (error instanceof ApiRequestError) {
    if (error.code === 'UNAUTHORIZED' || error.status === 401) {
      return 'انتهت صلاحية الجلسة. سجّل الدخول مرة أخرى.';
    }
    if (error.status === 403) {
      return 'ليس لديك صلاحية تعديل هذا الإعلان.';
    }
    if (error.status === 404) {
      return 'المسودة غير موجودة.';
    }
    if (error.status === 409) {
      return error.message || 'تعذر إكمال العملية بسبب تعارض في الحالة.';
    }
    if (error.code === 'NETWORK') {
      return error.userMessage;
    }
    return error.message || 'تعذر حفظ المسودة';
  }
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

function validateUploadFile(file: File): string | null {
  if (!ACCEPT_TYPES.has(file.type)) {
    return 'صيغة الملف غير مدعومة. استخدم JPG أو PNG أو WebP.';
  }
  if (file.size <= 0) {
    return 'الملف فارغ.';
  }
  if (file.size > MAX_BYTES) {
    return 'حجم الملف كبير جدًا. الحد الأقصى 5 ميجابايت.';
  }
  return null;
}

export async function listAddPropertyDraftsAction(): Promise<
  ActionResult<
    Array<{
      id: string;
      title: string | null;
      status: 'DRAFT';
      updatedAt: string;
      currentStep: ListingDraftStep;
    }>
  >
> {
  try {
    const user = await requireUser();
    const items = await getListingDraftService().listApiDraftSummaries(user.id);
    return { ok: true, data: items };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }
}

export async function createNewListingDraftAction(): Promise<void> {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
    );
  }

  try {
    const draft = await getListingDraftService().createFreshDraft(
      session.user.id,
    );
    revalidatePath(routes.myProperties);
    redirect(preferredDestinationForStatus(draft));
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (
      error instanceof ApiRequestError &&
      (error.code === 'UNAUTHORIZED' || error.status === 401)
    ) {
      redirect(
        `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
      );
    }
    const message = persistErrorMessage(error);
    redirect(
      `${routes.addProperty.root}?error=${encodeURIComponent(message)}`,
    );
  }
}

export async function resumeListingDraftAction(propertyId: string): Promise<void> {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
    );
  }

  try {
    const draft = await getListingDraftService().resumeDraftById(
      session.user.id,
      propertyId,
    );
    revalidatePath(routes.myProperties);
    redirect(preferredDestinationForStatus(draft));
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    if (
      error instanceof ApiRequestError &&
      (error.code === 'UNAUTHORIZED' || error.status === 401)
    ) {
      redirect(
        `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
      );
    }
    const message = persistErrorMessage(error);
    redirect(
      `${routes.addProperty.root}?error=${encodeURIComponent(message)}`,
    );
  }
}

/**
 * Legacy auto-entry: only creates when zero drafts; otherwise returns to /add-property UI.
 * Prefer createNewListingDraftAction / resumeListingDraftAction.
 */
export async function startListingDraftAction(): Promise<void> {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
    );
  }

  try {
    const summaries = await getListingDraftService().listApiDraftSummaries(
      session.user.id,
    );
    const decision = decideAddPropertyEntry(summaries);
    if (decision.kind === 'create') {
      const draft = await getListingDraftService().createFreshDraft(
        session.user.id,
      );
      revalidatePath(routes.myProperties);
      redirect(preferredDestinationForStatus(draft));
    }
    // Existing drafts: stay on /add-property so the client modal can choose.
    redirect(routes.addProperty.root);
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }
    if (
      error instanceof ApiRequestError &&
      (error.code === 'UNAUTHORIZED' || error.status === 401)
    ) {
      redirect(
        `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
      );
    }
    const message = persistErrorMessage(error);
    redirect(
      `${routes.addProperty.root}?error=${encodeURIComponent(message)}`,
    );
  }
}

function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest?: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  );
}

export async function saveBasicStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = basicStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أكمل الحقول المطلوبة' };

  try {
    const user = await requireUser();

    await getListingDraftService().updateBasic(id, user.id, {
      transaction: parsed.data.transaction,
      propertyType: parsed.data.propertyType as NonNullable<
        ListingDraft['propertyType']
      >,
      countryId: parsed.data.countryId,
      cityId: parsed.data.cityId,
      areaId: parsed.data.areaId,
      districtId: parsed.data.districtId ?? null,
      compoundId: parsed.data.compoundId ?? null,
      address: parsed.data.address?.trim() || null,
      locationLabel: parsed.data.locationLabel || '',
      latitude: parsed.data.latitude ?? null,
      longitude: parsed.data.longitude ?? null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }

  revalidatePath(routes.addProperty.step(id, 'basic'));
  revalidatePath(routes.myProperties);
  return { ok: true, data: { href: routes.addProperty.step(id, 'details') } };
}

export async function listWebCompoundsByAreaAction(
  areaId: string,
): Promise<
  | {
      ok: true;
      items: Array<{
        id: string;
        nameEn: string;
        nameAr: string | null;
        developerName: string | null;
        locationLabel: string | null;
      }>;
    }
  | { ok: false; error: string }
> {
  try {
    const { fetchCompoundsByArea } = await import(
      '@/features/properties/api/catalogs'
    );
    const items = await fetchCompoundsByArea(areaId);
    return {
      ok: true,
      items: items.map((compound) => {
        const locationParts = [
          compound.location.area.nameAr || compound.location.area.nameEn,
          compound.location.city?.nameAr || compound.location.city?.nameEn,
        ].filter(Boolean);
        return {
          id: compound.id,
          nameEn: compound.nameEn,
          nameAr: compound.nameAr,
          developerName:
            compound.developer?.nameAr?.trim() ||
            compound.developer?.nameEn ||
            null,
          locationLabel: locationParts.join(' · ') || null,
        };
      }),
    };
  } catch (error) {
    return { ok: false, error: persistErrorMessage(error) };
  }
}

export async function saveDetailsStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const current = await service.getById(id, user.id);
    if (!current) return { ok: false, error: 'المسودة غير موجودة' };

    const parsed = detailsStepSchema.safeParse({
      ...(typeof input === 'object' && input ? input : {}),
      propertyType: current.propertyType,
    });
    if (!parsed.success) return { ok: false, error: 'أكمل تفاصيل العقار' };

    await service.ensureCookieShell(current);

    await service.updateDetails(id, user.id, {
      areaSqm: parsed.data.areaSqm,
      bedrooms: parsed.data.bedrooms,
      bathrooms: parsed.data.bathrooms,
      floor: parsed.data.floor,
      buildOrDeliveryYear: parsed.data.buildOrDeliveryYear,
      furnished: parsed.data.furnished,
      finishing: parsed.data.finishing as ListingDraft['details']['finishing'],
      propertyViewIds: parsed.data.propertyViewIds,
      legalStatusId: parsed.data.legalStatusId,
      mortgageEligible: parsed.data.mortgageEligible,
      amenities: parsed.data.amenities,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }

  revalidatePath(routes.addProperty.step(id, 'details'));
  return { ok: true, data: { href: routes.addProperty.step(id, 'price') } };
}

export async function savePriceStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const current = await service.getById(id, user.id);
    if (!current) return { ok: false, error: 'المسودة غير موجودة' };

    const parsed = pricingStepSchema.safeParse({
      ...(typeof input === 'object' && input ? input : {}),
      transaction: current.transaction ?? undefined,
    });
    if (!parsed.success) {
      const first =
        parsed.error.issues[0]?.message ?? 'أكمل بيانات السعر';
      return { ok: false, error: first };
    }

    const {
      transaction: _transaction,
      ...pricing
    } = parsed.data;

    await service.updatePricing(
      id,
      user.id,
      {
        price: pricing.price,
        currency: pricing.currency,
        paymentType: pricing.paymentType || '',
        downPayment: pricing.downPayment,
        installmentYears: pricing.installmentYears,
        monthlyInstallment: pricing.monthlyInstallment,
        rentPeriod: pricing.rentPeriod || '',
      },
      current.transaction,
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }

  revalidatePath(routes.addProperty.step(id, 'price'));
  return { ok: true, data: { href: routes.addProperty.step(id, 'description') } };
}

export async function saveDescriptionStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = descriptionStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أكمل الوصف باللغة العربية' };

  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const current = await service.getById(id, user.id);
    if (!current) return { ok: false, error: 'المسودة غير موجودة' };
    await service.updateDescription(id, user.id, parsed.data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }

  revalidatePath(routes.addProperty.step(id, 'description'));
  return { ok: true, data: { href: routes.addProperty.step(id, 'contact') } };
}

export async function saveContactStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = contactStepSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      parsed.error.issues[0]?.message ?? 'أكمل بيانات التواصل';
    return { ok: false, error: first };
  }

  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const current = await service.getById(id, user.id);
    if (!current) return { ok: false, error: 'المسودة غير موجودة' };
    await service.updateContact(id, user.id, parsed.data);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }

  revalidatePath(routes.addProperty.step(id, 'contact'));
  return { ok: true, data: { href: routes.addProperty.step(id, 'media') } };
}

export async function saveMediaStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = mediaStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أضف صورة واحدةً على الأقل' };

  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const current = await service.getById(id, user.id);
    if (!current) return { ok: false, error: 'المسودة غير موجودة' };
    // Ignore client media payload as source of truth — verify API gallery.
    await service.updateMedia(id, user.id);
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }

  revalidatePath(routes.addProperty.step(id, 'media'));
  return { ok: true, data: { href: routes.addProperty.step(id, 'preview') } };
}

/** Advances media → preview → publish without mutating listing fields. */
export async function continuePreviewStepAction(
  id: string,
): Promise<ActionResult<{ href: string }>> {
  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const current = await service.getById(id, user.id);
    if (!current) return { ok: false, error: 'المسودة غير موجودة' };

    const firstInvalid = earliestIncompleteWizardStep(current);
    if (firstInvalid && firstInvalid !== 'preview' && firstInvalid !== 'publish') {
      return {
        ok: true,
        data: { href: routes.addProperty.step(id, firstInvalid) },
      };
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }

  revalidatePath(routes.addProperty.step(id, 'preview'));
  return { ok: true, data: { href: routes.addProperty.step(id, 'publish') } };
}

export async function uploadListingMediaAction(
  propertyId: string,
  formData: FormData,
): Promise<ActionResult<{ images: ListingImageDraft[] }>> {
  try {
    await requireUser();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return { ok: false, error: 'لم يتم اختيار ملف صالح.' };
    }
    const validationError = validateUploadFile(file);
    if (validationError) {
      return { ok: false, error: validationError };
    }

    const images = await getListingDraftService().uploadMediaImage(
      propertyId,
      file,
    );
    revalidatePath(routes.addProperty.step(propertyId, 'media'));
    return { ok: true, data: { images } };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }
}

export async function deleteListingMediaAction(
  propertyId: string,
  imageId: string,
): Promise<ActionResult<{ images: ListingImageDraft[] }>> {
  try {
    await requireUser();
    const images = await getListingDraftService().deleteMediaImage(
      propertyId,
      imageId,
    );
    revalidatePath(routes.addProperty.step(propertyId, 'media'));
    return { ok: true, data: { images } };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }
}

export async function setPrimaryListingMediaAction(
  propertyId: string,
  imageId: string,
): Promise<ActionResult<{ images: ListingImageDraft[] }>> {
  try {
    await requireUser();
    const images = await getListingDraftService().setPrimaryMediaImage(
      propertyId,
      imageId,
    );
    revalidatePath(routes.addProperty.step(propertyId, 'media'));
    return { ok: true, data: { images } };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }
}

export async function selectListingPlanAction(
  propertyId: string,
  planId: string,
): Promise<
  ActionResult<{
    nextAction: 'pay' | 'await_review';
    subscriptionId: string;
    href: string;
  }>
> {
  if (!planId.trim()) {
    return { ok: false, error: 'اختر باقة صالحة' };
  }

  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const draft = await service.getById(propertyId, user.id);
    if (!draft) return { ok: false, error: 'المسودة غير موجودة' };

    const firstInvalid = earliestIncompleteWizardStep(draft);
    if (firstInvalid) {
      return {
        ok: false,
        error: 'أكمل خطوات الإعلان قبل الإرسال',
        href: routes.addProperty.step(propertyId, firstInvalid),
      };
    }

    const completion = await service.getCompletion(propertyId);
    if (!completion.completed) {
      return {
        ok: false,
        error: 'أكمل البيانات المطلوبة قبل اختيار الباقة',
      };
    }

    const subscription = await service.selectPlan(propertyId, planId);
    const nextAction = subscription.nextAction ?? (
      subscription.status === 'PENDING' ? 'pay' : 'await_review'
    );

    await service.clearLocalDraftState(propertyId);
    revalidatePath(routes.myProperties);
    revalidatePath(routes.myProperty(propertyId));
    revalidatePath(routes.addProperty.step(propertyId, 'publish'));

    if (nextAction === 'pay') {
      return {
        ok: true,
        data: {
          nextAction: 'pay',
          subscriptionId: subscription.id,
          href: routes.addProperty.step(propertyId, 'checkout'),
        },
      };
    }

    return {
      ok: true,
      data: {
        nextAction: 'await_review',
        subscriptionId: subscription.id,
        href: routes.myProperty(propertyId),
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }
}

/** Validate all wizard steps; returns first invalid step href when incomplete. */
export async function validateListingBeforeSubmitAction(
  propertyId: string,
): Promise<ActionResult<{ href: string; complete: boolean }>> {
  try {
    const user = await requireUser();
    const draft = await getListingDraftService().getById(propertyId, user.id);
    if (!draft) return { ok: false, error: 'المسودة غير موجودة' };

    const firstInvalid = earliestIncompleteWizardStep(draft);
    if (firstInvalid) {
      return {
        ok: true,
        data: {
          complete: false,
          href: routes.addProperty.step(propertyId, firstInvalid),
        },
      };
    }

    const completion = await getListingDraftService().getCompletion(propertyId);
    if (!completion.completed) {
      // Stay on publish with completion panel when API completion is incomplete.
      return {
        ok: true,
        data: {
          complete: false,
          href: routes.addProperty.step(propertyId, 'publish'),
        },
      };
    }

    return {
      ok: true,
      data: {
        complete: true,
        href: routes.addProperty.step(propertyId, 'publish'),
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }
}

export async function payListingSubscriptionAction(
  propertyId: string,
  subscriptionId: string,
): Promise<ActionResult<{ href: string }>> {
  try {
    await requireUser();
    await getListingDraftService().payListingSubscription(subscriptionId);
    await getListingDraftService().clearLocalDraftState(propertyId);
    revalidatePath(routes.myProperties);
    revalidatePath(routes.myProperty(propertyId));
    revalidatePath(routes.addProperty.step(propertyId, 'publish'));
    revalidatePath(routes.addProperty.step(propertyId, 'checkout'));
    return {
      ok: true,
      data: { href: routes.myProperty(propertyId) },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }
}

export async function resubmitRejectedListingAction(
  propertyId: string,
): Promise<ActionResult<{ href: string }>> {
  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const draft = await service.getById(propertyId, user.id);
    if (!draft) return { ok: false, error: 'المسودة غير موجودة' };

    const firstInvalid = earliestIncompleteWizardStep(draft);
    if (firstInvalid) {
      return {
        ok: false,
        error: 'أكمل خطوات الإعلان قبل إعادة الإرسال',
        href: routes.addProperty.step(propertyId, firstInvalid),
      };
    }

    const completion = await service.getCompletion(propertyId);
    if (!completion.completed) {
      return {
        ok: false,
        error: 'أكمل البيانات المطلوبة قبل إعادة الإرسال',
      };
    }
    await service.resubmitRejectedForOwner(propertyId, user.id);
    await service.clearLocalDraftState(propertyId);
    revalidatePath(routes.myProperties);
    revalidatePath(routes.myProperty(propertyId));
    revalidatePath(routes.addProperty.step(propertyId, 'publish'));
    return {
      ok: true,
      data: { href: routes.myProperty(propertyId) },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return { ok: false, error: 'يجب تسجيل الدخول.' };
    }
    return { ok: false, error: persistErrorMessage(error) };
  }
}

export async function resolveStepRedirect(
  draft: ListingDraft,
  step: ListingDraftStep,
): Promise<string | null> {
  if (
    draft.apiStatus === 'PENDING_REVIEW' ||
    draft.apiStatus === 'PUBLISHED' ||
    draft.apiStatus === 'ARCHIVED' ||
    draft.apiStatus === 'EXPIRED'
  ) {
    return listingDetailHref(draft.id);
  }
  if (draft.apiStatus === 'PENDING_PAYMENT' && step !== 'publish') {
    return stepHref(draft.id, 'checkout');
  }
  const allowed = getListingDraftService().assertStepAccess(draft, step);
  if (allowed === step) return null;
  return stepHref(draft.id, allowed);
}
