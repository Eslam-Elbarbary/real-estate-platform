import type { PropertyLocationValue } from '../property-location-field';
import type { MediaAsset } from '@/components/media-picker';
import { isDetailFieldVisible } from '../../property-type-fields';
import type {
  PropertyWizardFormState,
  WizardStepErrors,
  WizardStepId,
} from './wizard-types';

export type WizardValidationContext = {
  form: PropertyWizardFormState;
  location: PropertyLocationValue;
  images: MediaAsset[];
  primaryId: string | null;
  /** Create flow requires owner; edit keeps existing owner. */
  requireOwner: boolean;
  isSale: boolean;
  isRent: boolean;
  /** PropertyType.code — drives which detail fields are validated. */
  propertyTypeCode?: string | null;
  /** When publishing (create publish or edit publish path). */
  requireMediaForPublish: boolean;
  /**
   * Description required (create + publish paths).
   * Defaults to true when omitted so draft/create/edit stay aligned with Web.
   */
  requireDescription?: boolean;
};

function parsePrice(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function validateWizardStep(
  stepId: WizardStepId,
  ctx: WizardValidationContext,
): WizardStepErrors {
  const errors: WizardStepErrors = {};
  const { form, location, images, primaryId } = ctx;
  const requireDescription = ctx.requireDescription !== false;

  if (stepId === 'basic') {
    if (ctx.requireOwner && !form.ownerId.trim()) {
      errors.ownerId = 'مالك العقار مطلوب.';
    }
    if (!form.title.trim()) {
      errors.title = 'العنوان مطلوب.';
    }
    if (requireDescription) {
      const description = form.description.trim();
      if (!description) {
        errors.description = 'الوصف مطلوب.';
      } else if (description.length < 10) {
        errors.description = 'الوصف يجب أن يكون 10 أحرف على الأقل.';
      }
    }
    if (!form.propertyTypeId.trim()) {
      errors.propertyTypeId = 'نوع العقار مطلوب.';
    }
    if (!form.transactionTypeId.trim()) {
      errors.transactionTypeId = 'نوع المعاملة مطلوب.';
    }
  }

  if (stepId === 'pricing') {
    const price = parsePrice(form.price);
    if (price === null || price <= 0) {
      errors.price = 'السعر مطلوب ويجب أن يكون أكبر من صفر.';
    }
    if (!form.currency.trim()) {
      errors.currency = 'العملة مطلوبة.';
    }

    if (ctx.isSale) {
      if (!form.paymentType) {
        errors.paymentType = 'طريقة الدفع مطلوبة.';
      } else if (form.paymentType === 'CASH') {
        if (form.downPayment.trim()) {
          errors.downPayment = 'المقدم غير مسموح مع الدفع النقدي.';
        }
        if (form.installmentYears.trim()) {
          errors.installmentYears = 'سنوات التقسيط غير مسموحة مع الدفع النقدي.';
        }
        if (form.monthlyInstallment.trim()) {
          errors.monthlyInstallment = 'القسط الشهري غير مسموح مع الدفع النقدي.';
        }
      } else if (form.paymentType === 'INSTALLMENT') {
        const down = parseOptionalNumber(form.downPayment);
        if (form.downPayment.trim() && (down === null || down < 0)) {
          errors.downPayment = 'المقدم يجب ألا يكون سالباً.';
        }

        const years = parseOptionalNumber(form.installmentYears);
        if (years === null || years < 1) {
          errors.installmentYears =
            'عدد سنوات التقسيط مطلوب ويجب أن يكون سنةً على الأقل.';
        }

        const monthly = parseOptionalNumber(form.monthlyInstallment);
        if (monthly === null || monthly <= 0) {
          errors.monthlyInstallment =
            'القسط الشهري مطلوب ويجب أن يكون أكبر من صفر.';
        }
      } else if (form.paymentType === 'CASH_OR_INSTALLMENT') {
        const down = parseOptionalNumber(form.downPayment);
        if (form.downPayment.trim() && (down === null || down < 0)) {
          errors.downPayment = 'المقدم يجب ألا يكون سالباً.';
        }

        if (form.installmentYears.trim()) {
          const years = parseOptionalNumber(form.installmentYears);
          if (years === null || years < 1) {
            errors.installmentYears =
              'عدد سنوات التقسيط يجب أن يكون سنةً على الأقل.';
          }
        }

        if (form.monthlyInstallment.trim()) {
          const monthly = parseOptionalNumber(form.monthlyInstallment);
          if (monthly === null || monthly <= 0) {
            errors.monthlyInstallment =
              'القسط الشهري يجب أن يكون أكبر من صفر عند إدخاله.';
          }
        }
      }
    }

    if (ctx.isRent && !form.rentPeriod) {
      errors.rentPeriod = 'فترة الإيجار مطلوبة.';
    }
  }

  if (stepId === 'details') {
    const typeCode = ctx.propertyTypeCode;

    if (isDetailFieldVisible('areaSqm', typeCode)) {
      const area = parseOptionalNumber(form.areaSqm);
      if (area === null || area <= 0) {
        errors.areaSqm = 'المساحة مطلوبة ويجب أن تكون أكبر من صفر.';
      }
    }

    if (isDetailFieldVisible('bedrooms', typeCode)) {
      const bedrooms = parseOptionalNumber(form.bedrooms);
      if (form.bedrooms.trim() && (bedrooms === null || bedrooms < 0)) {
        errors.bedrooms = 'عدد غرف النوم يجب أن يكون رقماً غير سالب.';
      }
    }

    if (isDetailFieldVisible('bathrooms', typeCode)) {
      const bathrooms = parseOptionalNumber(form.bathrooms);
      if (form.bathrooms.trim() && (bathrooms === null || bathrooms < 0)) {
        errors.bathrooms = 'عدد الحمامات يجب أن يكون رقماً غير سالب.';
      }
    }

    if (isDetailFieldVisible('floor', typeCode)) {
      const floor = parseOptionalNumber(form.floor);
      if (form.floor.trim() && (floor === null || floor < 0)) {
        errors.floor = 'رقم الدور يجب أن يكون رقماً غير سالب.';
      }
    }

    if (isDetailFieldVisible('yearBuilt', typeCode)) {
      const yearBuilt = parseOptionalNumber(form.yearBuilt);
      if (form.yearBuilt.trim()) {
        if (yearBuilt === null || yearBuilt < 0) {
          errors.yearBuilt = 'سنة البناء يجب أن تكون رقماً غير سالب.';
        } else if (yearBuilt < 1950 || yearBuilt > 2035) {
          errors.yearBuilt = 'سنة البناء غير صالحة.';
        }
      }
    }
  }

  if (stepId === 'location') {
    if (!location.countryId.trim()) {
      errors.countryId = 'الدولة مطلوبة.';
    }
    if (!location.cityId.trim()) {
      errors.cityId = 'المدينة مطلوبة.';
    }
    if (!location.areaId.trim()) {
      errors.areaId = 'المنطقة مطلوبة.';
    }

    const latRaw = location.latitude.trim();
    const lngRaw = location.longitude.trim();
    if (latRaw) {
      const lat = Number.parseFloat(latRaw);
      if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
        errors.latitude = 'خط العرض غير صالح (−90 إلى 90).';
      }
    }
    if (lngRaw) {
      const lng = Number.parseFloat(lngRaw);
      if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
        errors.longitude = 'خط الطول غير صالح (−180 إلى 180).';
      }
    }
    if ((latRaw && !lngRaw) || (!latRaw && lngRaw)) {
      errors.latitude = errors.latitude ?? 'أدخل خط العرض وخط الطول معاً.';
      errors.longitude = errors.longitude ?? 'أدخل خط العرض وخط الطول معاً.';
    }
  }

  if (stepId === 'media' && ctx.requireMediaForPublish) {
    if (images.length === 0) {
      errors.images = 'يلزم إرفاق صورة واحدة على الأقل قبل النشر.';
    } else {
      const primaryCount = images.filter((asset) => asset.id === primaryId).length;
      if (primaryCount !== 1) {
        errors.images = 'يجب تحديد صورة رئيسية واحدة.';
      }
    }
  }

  return errors;
}

export function isStepValid(
  stepId: WizardStepId,
  ctx: WizardValidationContext,
): boolean {
  return Object.keys(validateWizardStep(stepId, ctx)).length === 0;
}

/** Steps that gate forward navigation / completion scoring. */
export const REQUIRED_WIZARD_STEPS: WizardStepId[] = [
  'basic',
  'pricing',
  'details',
  'location',
];

/**
 * Completion % based on required field groups (not optional features/media).
 * Media counts only when publishing.
 */
export function calculateWizardCompletion(
  ctx: WizardValidationContext,
  options?: { includeMedia?: boolean },
): number {
  const checks: boolean[] = [
    isStepValid('basic', ctx),
    isStepValid('pricing', ctx),
    isStepValid('details', ctx),
    isStepValid('location', ctx),
  ];

  if (options?.includeMedia) {
    checks.push(isStepValid('media', { ...ctx, requireMediaForPublish: true }));
  }

  if (checks.length === 0) {
    return 0;
  }

  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

export function findFirstInvalidStep(
  ctx: WizardValidationContext,
  options?: { includeMedia?: boolean },
): WizardStepId | null {
  const steps: WizardStepId[] = [...REQUIRED_WIZARD_STEPS];
  if (options?.includeMedia) {
    steps.push('media');
  }

  for (const stepId of steps) {
    const stepCtx =
      stepId === 'media'
        ? { ...ctx, requireMediaForPublish: true }
        : ctx;
    if (!isStepValid(stepId, stepCtx)) {
      return stepId;
    }
  }

  return null;
}
