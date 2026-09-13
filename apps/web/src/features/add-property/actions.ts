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
  descriptionStepSchema,
  detailsStepSchema,
  mediaStepSchema,
  pricingStepSchema,
} from './schemas';
import type { ListingDraft, ListingDraftStep, ListingImageDraft } from './types';
import { preferredStepForStatus, stepHref } from './lib/step-access';

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

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

export async function startListingDraftAction(): Promise<void> {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.addProperty.root)}`,
    );
  }

  try {
    const draft = await getListingDraftService().startOrResumeDraft(
      session.user.id,
    );
    const preferred = preferredStepForStatus(draft);
    revalidatePath(routes.myProperties);
    redirect(routes.addProperty.step(draft.id, preferred));
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
    const locations = await getSearchLocationOptions();
    const selected = locations.find((item) => item.id === parsed.data.locationId);
    if (!selected?.areaId) {
      return {
        ok: false,
        error: 'اختر منطقة أو حيًا صالحًا (وليس محافظة فقط)',
      };
    }

    await getListingDraftService().updateBasic(id, user.id, {
      transaction: parsed.data.transaction,
      propertyType: parsed.data.propertyType as NonNullable<
        ListingDraft['propertyType']
      >,
      locationId: parsed.data.locationId,
      locationLabel: parsed.data.locationLabel,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      areaId: selected.areaId,
      districtId: selected.districtId ?? null,
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

export async function saveDetailsStepAction(
  id: string,
  input: unknown,
): Promise<ActionResult<{ href: string }>> {
  const parsed = detailsStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أكمل تفاصيل العقار' };

  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const current = await service.getById(id, user.id);
    if (!current) return { ok: false, error: 'المسودة غير موجودة' };
    await service.ensureCookieShell(current);

    await service.updateDetails(id, user.id, {
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
  const parsed = pricingStepSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'أكمل بيانات السعر' };

  try {
    const user = await requireUser();
    const service = getListingDraftService();
    const current = await service.getById(id, user.id);
    if (!current) return { ok: false, error: 'المسودة غير موجودة' };
    await service.updatePricing(id, user.id, parsed.data);
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
    await requireUser();
    const completion = await getListingDraftService().getCompletion(propertyId);
    if (!completion.completed) {
      return {
        ok: false,
        error: 'أكمل البيانات المطلوبة قبل اختيار الباقة',
      };
    }

    const subscription = await getListingDraftService().selectPlan(
      propertyId,
      planId,
    );
    const nextAction = subscription.nextAction ?? (
      subscription.status === 'PENDING' ? 'pay' : 'await_review'
    );

    revalidatePath(routes.myProperties);
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
    revalidatePath(routes.myProperties);
    revalidatePath(routes.addProperty.step(propertyId, 'publish'));
    revalidatePath(routes.addProperty.step(propertyId, 'checkout'));
    return {
      ok: true,
      data: { href: routes.addProperty.step(propertyId, 'publish') },
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
    const completion = await service.getCompletion(propertyId);
    if (!completion.completed) {
      return {
        ok: false,
        error: 'أكمل البيانات المطلوبة قبل إعادة الإرسال',
      };
    }
    await service.resubmitRejectedForOwner(propertyId, user.id);
    revalidatePath(routes.myProperties);
    revalidatePath(routes.addProperty.step(propertyId, 'publish'));
    return {
      ok: true,
      data: { href: routes.addProperty.step(propertyId, 'publish') },
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
  if (draft.apiStatus === 'PENDING_PAYMENT' && step !== 'publish') {
    return stepHref(draft.id, 'checkout');
  }
  const allowed = getListingDraftService().assertStepAccess(draft, step);
  if (allowed === step) return null;
  return stepHref(draft.id, allowed);
}
