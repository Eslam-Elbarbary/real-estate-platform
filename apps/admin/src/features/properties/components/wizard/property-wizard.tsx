'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MediaAsset } from '@/components/media-picker';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { routes } from '@/config/routes';
import { hasPermission } from '@/features/auth/permissions';
import type { AdminUserSelectItem } from '@/features/users/types';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import {
  createPropertyAction,
  getPropertyContactAction,
  publishPropertyAction,
  updatePropertyAction,
  upsertPropertyContactAction,
} from '../../actions';
import { formatPrice } from '../../format';
import {
  getPropertyTypeFieldConfig,
  isDetailFieldVisible,
} from '../../property-type-fields';
import type {
  AdminPropertyDetails,
  CreatePropertyInput,
  FinishingType,
  PaymentType,
  PropertyFormCatalogs,
  PropertyImageInput,
  RentPeriod,
  UpdatePropertyInput,
} from '../../types';
import { PropertyFeaturesField } from '../property-features-field';
import { PropertyImagesField } from '../property-images-field';
import {
  PropertyLocationField,
  type PropertyLocationValue,
} from '../property-location-field';
import { PropertyMediaManager } from '../property-media-manager';
import { PropertyOwnerCard } from '../property-owner-card';
import { PropertyOwnerSelect } from '../property-owner-select';
import {
  EMPTY_CONTACT_FORM,
  PropertyContactStep,
  contactDtoToForm,
  contactFormToPayload,
  validateContactForm,
  type PropertyContactFormState,
} from '../property-contact-step';
import { useUnsavedChangesGuard } from './use-unsaved-changes-guard';
import { useWizardAutosave } from './use-wizard-autosave';
import {
  calculateWizardCompletion,
  findFirstInvalidStep,
  validateWizardStep,
  type WizardValidationContext,
} from './validation';
import { WizardReview } from './wizard-review';
import { WizardStepper } from './wizard-stepper';
import {
  EMPTY_WIZARD_FORM,
  EMPTY_WIZARD_LOCATION,
  WIZARD_STEPS,
  parseWizardStepIndex,
  wizardStepIndex,
  type PropertyWizardFormState,
  type WizardStepErrors,
  type WizardStepId,
} from './wizard-types';

export interface PropertyWizardProps {
  mode: 'create' | 'edit';
  initialData?: AdminPropertyDetails;
  catalogs: PropertyFormCatalogs;
  permissions: string[];
}

const PAYMENT_TYPE_OPTIONS = [
  { value: '', label: 'غير محدد' },
  { value: 'CASH', label: 'نقدي' },
  { value: 'INSTALLMENT', label: 'تقسيط' },
  { value: 'CASH_OR_INSTALLMENT', label: 'نقدي أو تقسيط' },
];

const FINISHING_TYPE_OPTIONS = [
  { value: '', label: 'غير محدد' },
  { value: 'UNFINISHED', label: 'بدون تشطيب' },
  { value: 'SEMI_FINISHED', label: 'نصف تشطيب' },
  { value: 'FINISHED', label: 'تشطيب كامل' },
  { value: 'LUX', label: 'فاخر' },
  { value: 'SUPER_LUX', label: 'فاخر جداً' },
];

const RENT_PERIOD_OPTIONS = [
  { value: '', label: 'غير محدد' },
  { value: 'MONTHLY', label: 'شهري' },
  { value: 'YEARLY', label: 'سنوي' },
  { value: 'DAILY', label: 'يومي' },
];

function formatCatalogLabel(item: { nameAr: string | null; nameEn: string }): string {
  return item.nameAr ?? item.nameEn;
}

function showsInstallmentFields(paymentType: PaymentType | ''): boolean {
  return paymentType === 'INSTALLMENT' || paymentType === 'CASH_OR_INSTALLMENT';
}

/** Clear numeric detail fields that are hidden for the newly selected type. */
function pruneHiddenDetailFields(
  form: PropertyWizardFormState,
  propertyTypeCode: string,
): PropertyWizardFormState {
  const next = { ...form };
  if (!isDetailFieldVisible('bedrooms', propertyTypeCode)) {
    next.bedrooms = '';
  }
  if (!isDetailFieldVisible('bathrooms', propertyTypeCode)) {
    next.bathrooms = '';
  }
  if (!isDetailFieldVisible('floor', propertyTypeCode)) {
    next.floor = '';
  }
  if (!isDetailFieldVisible('yearBuilt', propertyTypeCode)) {
    next.yearBuilt = '';
  }
  if (!isDetailFieldVisible('finishingType', propertyTypeCode)) {
    next.finishingType = '';
  }
  if (!isDetailFieldVisible('furnished', propertyTypeCode)) {
    next.furnished = false;
  }
  if (!isDetailFieldVisible('propertyViews', propertyTypeCode)) {
    next.propertyViewIds = [];
  }
  if (!isDetailFieldVisible('legalStatus', propertyTypeCode)) {
    next.legalStatusId = '';
  }
  return next;
}

function detailsToForm(property: AdminPropertyDetails): PropertyWizardFormState {
  return {
    ownerId: property.owner.id,
    title: property.title ?? '',
    referenceNumber: property.referenceNumber ?? '',
    description: property.description ?? '',
    propertyTypeId: property.propertyType?.id ?? '',
    transactionTypeId: property.transactionType?.id ?? '',
    price: property.price != null ? String(property.price) : '',
    currency: property.currency || 'EGP',
    areaSqm: property.areaSqm != null ? String(property.areaSqm) : '',
    bedrooms: property.bedrooms != null ? String(property.bedrooms) : '',
    bathrooms: property.bathrooms != null ? String(property.bathrooms) : '',
    floor: property.floor != null ? String(property.floor) : '',
    yearBuilt: property.yearBuilt != null ? String(property.yearBuilt) : '',
    furnished: property.furnished ?? false,
    rentPeriod: property.rentPeriod ?? '',
    paymentType: property.paymentType ?? '',
    downPayment: property.downPayment != null ? String(property.downPayment) : '',
    installmentYears:
      property.installmentYears != null ? String(property.installmentYears) : '',
    monthlyInstallment:
      property.monthlyInstallment != null ? String(property.monthlyInstallment) : '',
    finishingType: property.finishingType ?? '',
    propertyViewIds: (property.propertyViews ?? []).map((view) => view.id),
    legalStatusId: property.legalStatus?.id ?? '',
    compoundId: property.compound?.id ?? '',
    featureIds: property.features.map((feature) => feature.id),
  };
}

function detailsToLocation(property: AdminPropertyDetails): PropertyLocationValue {
  return {
    countryId: property.location.country?.id ?? '',
    cityId: property.location.city?.id ?? '',
    areaId: property.location.area?.id ?? '',
    districtId: property.location.district?.id ?? '',
    compoundId: property.compound?.id ?? '',
    countryName:
      property.location.country?.nameAr ??
      property.location.country?.nameEn ??
      '',
    cityName:
      property.location.city?.nameAr ?? property.location.city?.nameEn ?? '',
    areaName:
      property.location.area?.nameAr ?? property.location.area?.nameEn ?? '',
    districtName:
      property.location.district?.nameAr ??
      property.location.district?.nameEn ??
      '',
    compoundName:
      property.compound?.nameAr ?? property.compound?.nameEn ?? '',
    address: property.address ?? '',
    latitude: property.latitude != null ? String(property.latitude) : '',
    longitude: property.longitude != null ? String(property.longitude) : '',
  };
}

function parseOptionalInt(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalFloat(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildImagePayload(
  assets: MediaAsset[],
  primaryId: string | null,
): PropertyImageInput[] {
  return assets.map((asset, index) => ({
    mediaAssetId: asset.id,
    sortOrder: index,
    isPrimary: asset.id === primaryId,
    type: 'IMAGE',
  }));
}

function autosaveStatusLabel(
  status: 'idle' | 'saving' | 'saved' | 'error',
): string | null {
  if (status === 'saving') {
    return 'جاري الحفظ';
  }
  if (status === 'saved') {
    return 'تم الحفظ ✓';
  }
  if (status === 'error') {
    return 'فشل الحفظ';
  }
  return null;
}

/**
 * API create requires owner/title/type/transaction/price/areaId.
 * Used to bootstrap a DRAFT without empty records.
 */
function canBootstrapServerDraft(
  form: PropertyWizardFormState,
  location: PropertyLocationValue,
): boolean {
  const price = Number.parseFloat(form.price.trim());
  return Boolean(
    form.ownerId.trim() &&
      form.title.trim() &&
      form.propertyTypeId.trim() &&
      form.transactionTypeId.trim() &&
      location.areaId.trim() &&
      Number.isFinite(price) &&
      price > 0,
  );
}

export function PropertyWizard({
  mode,
  initialData,
  catalogs,
  permissions,
}: PropertyWizardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEdit = mode === 'edit';
  const canCreate = hasPermission(permissions, 'properties.create');
  const canUpdate = hasPermission(permissions, 'properties.update');
  const canPublish = hasPermission(permissions, 'properties.publish');

  const [stepIndex, setStepIndex] = useState(() =>
    parseWizardStepIndex(searchParams.get('step')),
  );
  const [form, setForm] = useState<PropertyWizardFormState>(EMPTY_WIZARD_FORM);
  const [location, setLocation] =
    useState<PropertyLocationValue>(EMPTY_WIZARD_LOCATION);
  const [images, setImages] = useState<MediaAsset[]>([]);
  const [primaryId, setPrimaryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<WizardStepErrors>({});
  const [selectedOwner, setSelectedOwner] = useState<AdminUserSelectItem | null>(
    null,
  );
  const [contact, setContact] =
    useState<PropertyContactFormState>(EMPTY_CONTACT_FORM);
  const [contactLoading, setContactLoading] = useState(false);
  const [autosaveRevision, setAutosaveRevision] = useState(0);
  const [serverDraftId, setServerDraftId] = useState<string | null>(
    initialData?.id ?? null,
  );
  const [draftBootstrapStatus, setDraftBootstrapStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const draftBootstrapInFlightRef = useRef(false);
  const hydratedPropertyIdRef = useRef<string | null>(null);
  const stepIndexRef = useRef(stepIndex);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  const syncStepToUrl = useCallback(
    (index: number) => {
      const stepId = WIZARD_STEPS[index]?.id;
      if (!stepId) {
        return;
      }
      const params = new URLSearchParams(searchParams.toString());
      if (params.get('step') === stepId) {
        return;
      }
      params.set('step', stepId);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const setWizardStep = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, WIZARD_STEPS.length - 1));
      setStepIndex(clamped);
      syncStepToUrl(clamped);
    },
    [syncStepToUrl],
  );

  const hasServerDraft = Boolean(serverDraftId);
  const isDraftContext =
    (isEdit && initialData?.status === 'DRAFT') ||
    (!isEdit && hasServerDraft);
  const canSubmit = isEdit || hasServerDraft ? canUpdate || canCreate : canCreate;

  useEffect(() => {
    if (isEdit && initialData) {
      const isNewProperty = hydratedPropertyIdRef.current !== initialData.id;
      if (!isNewProperty) {
        return;
      }

      hydratedPropertyIdRef.current = initialData.id;
      setForm(detailsToForm(initialData));
      setLocation(detailsToLocation(initialData));
      setImages([]);
      setPrimaryId(null);
      setFieldErrors({});
      setDirty(false);
      setAutosaveRevision(0);
      setServerDraftId(initialData.id);
      setDraftBootstrapStatus('idle');
      setSelectedOwner({
        id: initialData.owner.id,
        name: initialData.owner.name,
        email: initialData.owner.email,
        phone: initialData.owner.phone,
      });
      setContact(EMPTY_CONTACT_FORM);
      setContactLoading(true);
      // Keep URL step when present; otherwise stay on current (usually 0).
      setWizardStep(parseWizardStepIndex(searchParams.get('step')));
      void getPropertyContactAction(initialData.id)
        .then((result) => {
          if (!result.ok) return;
          setContact(contactDtoToForm(result.data));
        })
        .finally(() => setContactLoading(false));
      return;
    }

    if (hydratedPropertyIdRef.current !== null) {
      hydratedPropertyIdRef.current = null;
      setForm(EMPTY_WIZARD_FORM);
      setLocation(EMPTY_WIZARD_LOCATION);
      setImages([]);
      setPrimaryId(null);
      setFieldErrors({});
      setDirty(false);
      setAutosaveRevision(0);
      setServerDraftId(null);
      setDraftBootstrapStatus('idle');
      setSelectedOwner(null);
      setContact(EMPTY_CONTACT_FORM);
      setContactLoading(false);
      setWizardStep(0);
    }
  }, [isEdit, initialData, searchParams, setWizardStep]);

  const propertyTypeOptions = useMemo(
    () =>
      catalogs.propertyTypes.map((type) => ({
        value: type.id,
        label: formatCatalogLabel(type),
      })),
    [catalogs.propertyTypes],
  );

  const transactionTypeOptions = useMemo(
    () =>
      catalogs.transactionTypes.map((type) => ({
        value: type.id,
        label: formatCatalogLabel(type),
      })),
    [catalogs.transactionTypes],
  );

  const legalStatusOptions = useMemo(
    () => [
      { value: '', label: 'غير محدد' },
      ...catalogs.legalStatuses.map((status) => ({
        value: status.id,
        label: formatCatalogLabel(status),
      })),
    ],
    [catalogs.legalStatuses],
  );

  function togglePropertyView(viewId: string) {
    updateField(
      'propertyViewIds',
      form.propertyViewIds.includes(viewId)
        ? form.propertyViewIds.filter((id) => id !== viewId)
        : [...form.propertyViewIds, viewId],
    );
  }

  const selectedPropertyType = catalogs.propertyTypes.find(
    (type) => type.id === form.propertyTypeId,
  );
  const selectedTransactionType = catalogs.transactionTypes.find(
    (type) => type.id === form.transactionTypeId,
  );

  const transactionCode = selectedTransactionType?.code ?? '';
  const propertyTypeCode = selectedPropertyType?.code ?? '';
  const detailFieldConfig = getPropertyTypeFieldConfig(propertyTypeCode);
  const isRent = transactionCode === 'RENT';
  const isSale = transactionCode === 'SALE';
  const showInstallment = isSale && showsInstallmentFields(form.paymentType);
  const showRentPeriod = isRent;
  const floorLabel = detailFieldConfig.floorLabel ?? 'الدور';

  const currentStep = WIZARD_STEPS[stepIndex] ?? WIZARD_STEPS[0];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;
  const formDisabled = loading || draftBootstrapStatus === 'saving';

  const cancelHref = serverDraftId
    ? routes.properties.details(serverDraftId)
    : isEdit && initialData
      ? routes.properties.details(initialData.id)
      : routes.properties.root;

  function markDirty() {
    setDirty(true);
    setAutosaveRevision((current) => current + 1);
  }

  const validationContext = useMemo<WizardValidationContext>(
    () => ({
      form,
      location,
      images,
      primaryId,
      requireOwner: !isEdit && !hasServerDraft,
      isSale,
      isRent,
      propertyTypeCode,
      requireMediaForPublish: false,
    }),
    [form, location, images, primaryId, isEdit, hasServerDraft, isSale, isRent, propertyTypeCode],
  );

  const completionPercent = useMemo(
    () => calculateWizardCompletion(validationContext),
    [validationContext],
  );

  const buildUpdatePayload = useCallback((): UpdatePropertyInput => {
    const price = Number.parseFloat(form.price.trim());
    const includeInstallment = isSale && showsInstallmentFields(form.paymentType);

    return {
      title: form.title.trim(),
      description: form.description.trim() || null,
      referenceNumber: form.referenceNumber.trim() || null,
      propertyTypeId: form.propertyTypeId,
      transactionTypeId: form.transactionTypeId,
      price: Number.isFinite(price) ? price : 0,
      currency: form.currency.trim() || 'EGP',
      paymentType: isSale ? form.paymentType || null : null,
      downPayment: includeInstallment
        ? parseOptionalFloat(form.downPayment) ?? null
        : null,
      installmentYears: includeInstallment
        ? parseOptionalInt(form.installmentYears) ?? null
        : null,
      monthlyInstallment: includeInstallment
        ? parseOptionalFloat(form.monthlyInstallment) ?? null
        : null,
      finishingType: form.finishingType || null,
      propertyViewIds: form.propertyViewIds,
      legalStatusId: form.legalStatusId || null,
      rentPeriod: isRent ? form.rentPeriod || null : null,
      furnished: form.furnished,
      bedrooms: parseOptionalInt(form.bedrooms) ?? null,
      bathrooms: parseOptionalInt(form.bathrooms) ?? null,
      areaSqm: parseOptionalInt(form.areaSqm) ?? null,
      floor: parseOptionalInt(form.floor) ?? null,
      yearBuilt: parseOptionalInt(form.yearBuilt) ?? null,
      countryId: location.countryId || undefined,
      cityId: location.cityId || undefined,
      areaId: location.areaId,
      districtId: location.districtId || null,
      compoundId: form.compoundId || null,
      address: location.address.trim() || null,
      latitude: parseOptionalFloat(location.latitude) ?? null,
      longitude: parseOptionalFloat(location.longitude) ?? null,
      featureIds: form.featureIds,
    };
  }, [form, location, isSale, isRent]);

  const runAutosave = useCallback(
    async (payload: UpdatePropertyInput) => {
      const propertyId = serverDraftId ?? initialData?.id;
      if (!propertyId) {
        return { ok: false as const, error: 'لا يوجد عقار للحفظ.' };
      }
      const result = await updatePropertyAction(propertyId, payload);
      if (!result.ok) {
        return result;
      }
      const contactResult = await upsertPropertyContactAction(
        propertyId,
        contactFormToPayload(contact),
      );
      if (!contactResult.ok) {
        return { ok: false as const, error: contactResult.error };
      }
      return { ok: true as const };
    },
    [serverDraftId, initialData?.id, contact],
  );

  const autosaveStatus = useWizardAutosave({
    enabled: Boolean(
      isDraftContext &&
        serverDraftId &&
        (canUpdate || canCreate) &&
        !loading &&
        draftBootstrapStatus !== 'saving',
    ),
    dirty,
    revision: autosaveRevision,
    debounceMs: 6000,
    buildPayload: buildUpdatePayload,
    save: runAutosave,
    onSaved: () => {
      setDirty(false);
    },
  });

  useUnsavedChangesGuard(
    dirty,
    'لديك تغييرات غير محفوظة. هل تريد مغادرة الصفحة؟',
    {
      isSaving:
        draftBootstrapStatus === 'saving' || autosaveStatus === 'saving',
    },
  );

  const buildCreateDraftPayload = useCallback((): CreatePropertyInput => {
    const price = Number.parseFloat(form.price.trim());
    const includeInstallment = isSale && showsInstallmentFields(form.paymentType);
    const imagePayload =
      images.length > 0 ? buildImagePayload(images, primaryId) : undefined;

    return {
      ownerId: form.ownerId.trim(),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      referenceNumber: form.referenceNumber.trim() || undefined,
      propertyTypeId: form.propertyTypeId,
      transactionTypeId: form.transactionTypeId,
      price: Number.isFinite(price) ? price : 0,
      currency: form.currency.trim() || 'EGP',
      paymentType: isSale ? form.paymentType || undefined : undefined,
      downPayment: includeInstallment
        ? parseOptionalFloat(form.downPayment)
        : undefined,
      installmentYears: includeInstallment
        ? parseOptionalInt(form.installmentYears)
        : undefined,
      monthlyInstallment: includeInstallment
        ? parseOptionalFloat(form.monthlyInstallment)
        : undefined,
      finishingType: form.finishingType || undefined,
      propertyViewIds:
        form.propertyViewIds.length > 0 ? form.propertyViewIds : undefined,
      legalStatusId: form.legalStatusId || undefined,
      rentPeriod: isRent ? form.rentPeriod || undefined : undefined,
      furnished: form.furnished,
      bedrooms: parseOptionalInt(form.bedrooms),
      bathrooms: parseOptionalInt(form.bathrooms),
      areaSqm: parseOptionalInt(form.areaSqm),
      floor: parseOptionalInt(form.floor),
      yearBuilt: parseOptionalInt(form.yearBuilt),
      countryId: location.countryId || undefined,
      cityId: location.cityId || undefined,
      areaId: location.areaId,
      districtId: location.districtId || undefined,
      compoundId: form.compoundId || undefined,
      address: location.address.trim() || undefined,
      latitude: parseOptionalFloat(location.latitude),
      longitude: parseOptionalFloat(location.longitude),
      featureIds: form.featureIds.length > 0 ? form.featureIds : undefined,
      images: imagePayload,
      publish: false,
    };
  }, [form, location, images, primaryId, isSale, isRent]);

  useEffect(() => {
    if (isEdit || hasServerDraft || !canCreate || loading) {
      return;
    }
    if (!canBootstrapServerDraft(form, location)) {
      return;
    }
    if (draftBootstrapInFlightRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (draftBootstrapInFlightRef.current || serverDraftId) {
        return;
      }

      draftBootstrapInFlightRef.current = true;
      setDraftBootstrapStatus('saving');

      void (async () => {
        try {
          const result = await createPropertyAction(buildCreateDraftPayload());
          if (!result.ok) {
            setDraftBootstrapStatus('error');
            toast.error(getAdminErrorMessage(result.error));
            return;
          }

          const contactResult = await upsertPropertyContactAction(
            result.data.id,
            contactFormToPayload(contact),
          );
          if (!contactResult.ok) {
            toast.error(contactResult.error);
          }

          setServerDraftId(result.data.id);
          setImages([]);
          setPrimaryId(null);
          setDirty(false);
          setDraftBootstrapStatus('saved');
          const stepId =
            WIZARD_STEPS[stepIndexRef.current]?.id ?? 'basic';
          window.history.replaceState(
            null,
            '',
            `${routes.properties.edit(result.data.id)}?step=${stepId}`,
          );
        } catch {
          setDraftBootstrapStatus('error');
        } finally {
          draftBootstrapInFlightRef.current = false;
        }
      })();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [
    isEdit,
    hasServerDraft,
    serverDraftId,
    canCreate,
    loading,
    form,
    location,
    buildCreateDraftPayload,
    contact,
  ]);

  function updateField<K extends keyof PropertyWizardFormState>(
    key: K,
    value: PropertyWizardFormState[K],
  ) {
    markDirty();
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === 'paymentType' && value === 'CASH') {
        next.downPayment = '';
        next.installmentYears = '';
        next.monthlyInstallment = '';
      }

      if (key === 'transactionTypeId') {
        const nextType = catalogs.transactionTypes.find(
          (type) => type.id === value,
        );
        if (nextType?.code === 'RENT') {
          next.paymentType = '';
          next.downPayment = '';
          next.installmentYears = '';
          next.monthlyInstallment = '';
        }
        if (nextType?.code === 'SALE') {
          next.rentPeriod = '';
        }
      }

      if (key === 'propertyTypeId') {
        const nextType = catalogs.propertyTypes.find(
          (type) => type.id === value,
        );
        return pruneHiddenDetailFields(next, nextType?.code ?? '');
      }

      return next;
    });

    if (key in fieldErrors) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function handleLocationChange(next: PropertyLocationValue) {
    markDirty();
    setLocation(next);
    setForm((current) =>
      current.compoundId === next.compoundId
        ? current
        : { ...current, compoundId: next.compoundId },
    );
    setFieldErrors((current) => ({
      ...current,
      countryId: next.countryId.trim() ? undefined : current.countryId,
      cityId: next.cityId.trim() ? undefined : current.cityId,
      areaId: next.areaId.trim() ? undefined : current.areaId,
      latitude: undefined,
      longitude: undefined,
    }));
  }

  function handleImagesChange(assets: MediaAsset[]) {
    markDirty();
    setImages(assets);

    if (assets.length === 0) {
      setPrimaryId(null);
      setFieldErrors((current) => ({ ...current, images: undefined }));
      return;
    }

    if (!primaryId || !assets.some((asset) => asset.id === primaryId)) {
      setPrimaryId(assets[0]?.id ?? null);
    }
  }

  function handlePrimaryChange(id: string) {
    markDirty();
    setPrimaryId(id);
    setFieldErrors((current) => ({ ...current, images: undefined }));
  }

  function applyStepValidation(
    stepId: WizardStepId,
    options?: { requireMediaForPublish?: boolean },
  ): boolean {
    const errors = validateWizardStep(stepId, {
      ...validationContext,
      requireMediaForPublish: options?.requireMediaForPublish ?? false,
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateAllRequired(options?: { includeMedia?: boolean }): boolean {
    const firstInvalid = findFirstInvalidStep(validationContext, {
      includeMedia: options?.includeMedia,
    });
    if (firstInvalid) {
      applyStepValidation(firstInvalid, {
        requireMediaForPublish: options?.includeMedia,
      });
      setWizardStep(wizardStepIndex(firstInvalid));
      return false;
    }

    const contactErrors = validateContactForm(contact);
    if (Object.keys(contactErrors).length > 0) {
      setFieldErrors(contactErrors as WizardStepErrors);
      setWizardStep(wizardStepIndex('contact'));
      return false;
    }

    setFieldErrors({});
    return true;
  }

  function goToStep(targetId: WizardStepId) {
    const targetIndex = wizardStepIndex(targetId);
    if (targetIndex < 0) {
      return;
    }

    if (targetIndex <= stepIndex) {
      setFieldErrors({});
      setWizardStep(targetIndex);
      return;
    }

    let cursor = stepIndex;
    while (cursor < targetIndex) {
      const stepId = WIZARD_STEPS[cursor]?.id;
      if (!stepId) {
        break;
      }
      if (!applyStepValidation(stepId)) {
        setWizardStep(cursor);
        return;
      }
      cursor += 1;
    }

    setFieldErrors({});
    setWizardStep(targetIndex);
  }

  function goNext() {
    if (!currentStep) {
      return;
    }
    if (currentStep.id === 'contact') {
      const contactErrors = validateContactForm(contact);
      setFieldErrors(contactErrors as WizardStepErrors);
      if (Object.keys(contactErrors).length > 0) {
        return;
      }
    } else if (!applyStepValidation(currentStep.id)) {
      return;
    }
    setWizardStep(Math.min(stepIndex + 1, WIZARD_STEPS.length - 1));
  }

  function goBack() {
    setFieldErrors({});
    setWizardStep(Math.max(stepIndex - 1, 0));
  }

  async function submitWizard(options: { publish?: boolean } = {}) {
    if (!canSubmit || loading) {
      return;
    }

    const publishing = options.publish === true;
    if (
      !validateAllRequired({
        includeMedia: publishing && !isEdit && !hasServerDraft,
      })
    ) {
      return;
    }

    setLoading(true);

    try {
      const propertyId = serverDraftId ?? initialData?.id;

      if (propertyId) {
        const result = await updatePropertyAction(
          propertyId,
          buildUpdatePayload(),
        );

        if (!result.ok) {
          toast.error(getAdminErrorMessage(result.error));
          return;
        }

        const contactResult = await upsertPropertyContactAction(
          propertyId,
          contactFormToPayload(contact),
        );
        if (!contactResult.ok) {
          toast.error(contactResult.error);
          return;
        }

        if (publishing && canPublish) {
          const publishResult = await publishPropertyAction(propertyId);
          if (!publishResult.ok) {
            toast.error(getAdminErrorMessage(publishResult.error));
            return;
          }
        }

        setDirty(false);
        toast.success(
          publishing
            ? 'تم حفظ العقار ونشره بنجاح.'
            : isEdit
              ? 'تم حفظ تعديلات العقار بنجاح.'
              : 'تم حفظ العقار كمسودة بنجاح.',
        );
        router.push(routes.properties.details(propertyId));
        router.refresh();
        return;
      }

      const result = await createPropertyAction({
        ...buildCreateDraftPayload(),
        publish: options.publish ?? false,
      });

      if (!result.ok) {
        toast.error(getAdminErrorMessage(result.error));
        return;
      }

      const contactResult = await upsertPropertyContactAction(
        result.data.id,
        contactFormToPayload(contact),
      );
      if (!contactResult.ok) {
        toast.error(contactResult.error);
        setDirty(false);
        router.push(routes.properties.edit(result.data.id));
        router.refresh();
        return;
      }

      setDirty(false);
      toast.success(
        options.publish
          ? 'تم إنشاء العقار ونشره بنجاح.'
          : 'تم حفظ العقار كمسودة بنجاح.',
      );
      router.push(routes.properties.details(result.data.id));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const pricePreview = Number.parseFloat(form.price.trim());
  const reviewPrice = Number.isFinite(pricePreview)
    ? formatPrice(pricePreview, form.currency.trim() || 'EGP')
    : '—';

  const selectedCompoundLabel =
    location.compoundName.trim() ||
    (initialData?.compound
      ? formatCatalogLabel(initialData.compound)
      : form.compoundId
        ? 'محدد'
        : '—');

  const saveStatus =
    draftBootstrapStatus === 'saving' || draftBootstrapStatus === 'error'
      ? draftBootstrapStatus
      : autosaveStatus;
  const autosaveLabel = autosaveStatusLabel(saveStatus);

  return (
    <div className="space-y-4">
      <PageHeader
        title={
          isEdit || hasServerDraft ? 'تعديل العقار' : 'إضافة عقار'
        }
        description={
          isEdit || hasServerDraft
            ? 'عدّل بيانات العقار عبر خطوات منظمة. يتم حفظ المسودة تلقائياً.'
            : 'أنشئ عقاراً جديداً عبر معالج من ثماني خطوات. تُنشأ المسودة تلقائياً بعد إدخال الحد الأدنى من البيانات.'
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            {autosaveLabel ? (
              <span
                className={cn(
                  'text-xs font-medium',
                  saveStatus === 'saving' && 'text-ink-500',
                  saveStatus === 'saved' && 'text-success-700',
                  saveStatus === 'error' && 'text-danger-600',
                )}
              >
                {autosaveLabel}
              </span>
            ) : null}
            <Link href={cancelHref}>
              <Button type="button" variant="outline" size="small">
                إلغاء
              </Button>
            </Link>
          </div>
        }
      />

      <Card>
        <CardHeader className="space-y-4">
          <WizardStepper
            currentStepId={currentStep.id}
            completionPercent={completionPercent}
            disabled={loading}
            onStepSelect={goToStep}
          />
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep.id === 'basic' ? (
            <section className="space-y-4">
              {!isEdit && !hasServerDraft ? (
                <PropertyOwnerSelect
                  value={form.ownerId}
                  selectedOwner={selectedOwner}
                  onChange={(ownerId, owner) => {
                    updateField('ownerId', ownerId);
                    setSelectedOwner(owner);
                  }}
                  disabled={formDisabled}
                  error={fieldErrors.ownerId}
                />
              ) : selectedOwner || initialData ? (
                <PropertyOwnerCard
                  owner={
                    selectedOwner
                      ? {
                          id: selectedOwner.id,
                          name: selectedOwner.name,
                          email: selectedOwner.email,
                          phone: selectedOwner.phone,
                          avatarUrl: null,
                        }
                      : initialData!.owner
                  }
                />
              ) : null}

              <Input
                name="title"
                label="العنوان"
                placeholder="شقة فاخرة في…"
                value={form.title}
                disabled={formDisabled}
                error={fieldErrors.title}
                onChange={(event) => updateField('title', event.target.value)}
              />

              <Input
                name="referenceNumber"
                label="الرقم المرجعي"
                placeholder="REF-1001"
                dir="ltr"
                className="text-start"
                value={form.referenceNumber}
                disabled={formDisabled}
                onChange={(event) =>
                  updateField('referenceNumber', event.target.value)
                }
              />

              <label
                className="flex w-full flex-col gap-1.5 text-sm"
                htmlFor="wizard-description"
              >
                <span className="font-medium text-ink-800">الوصف</span>
                <textarea
                  id="wizard-description"
                  name="description"
                  rows={4}
                  value={form.description}
                  disabled={formDisabled}
                  placeholder="وصف تفصيلي للعقار…"
                  aria-invalid={Boolean(fieldErrors.description)}
                  onChange={(event) =>
                    updateField('description', event.target.value)
                  }
                  className={cn(
                    'min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900',
                    'placeholder:text-ink-400',
                    'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
                    'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
                    fieldErrors.description &&
                      'border-danger-500 focus-visible:ring-danger-200',
                  )}
                />
                {fieldErrors.description ? (
                  <span className="text-xs text-danger-600">
                    {fieldErrors.description}
                  </span>
                ) : null}
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  name="propertyTypeId"
                  label="نوع العقار"
                  placeholder="اختر النوع"
                  options={propertyTypeOptions}
                  value={form.propertyTypeId}
                  disabled={formDisabled}
                  error={fieldErrors.propertyTypeId}
                  onChange={(event) =>
                    updateField('propertyTypeId', event.target.value)
                  }
                />
                <Select
                  name="transactionTypeId"
                  label="نوع المعاملة"
                  placeholder="اختر المعاملة"
                  options={transactionTypeOptions}
                  value={form.transactionTypeId}
                  disabled={formDisabled}
                  error={fieldErrors.transactionTypeId}
                  onChange={(event) =>
                    updateField('transactionTypeId', event.target.value)
                  }
                />
              </div>
            </section>
          ) : null}

          {currentStep.id === 'location' ? (
            <section className="space-y-4">
              <PropertyLocationField
                value={location}
                onChange={handleLocationChange}
                disabled={formDisabled}
                countryError={fieldErrors.countryId}
                cityError={fieldErrors.cityId}
                areaError={fieldErrors.areaId}
                latitudeError={fieldErrors.latitude}
                longitudeError={fieldErrors.longitude}
                title="الموقع"
              />
            </section>
          ) : null}

          {currentStep.id === 'details' ? (
            <section className="space-y-4">
              {!form.propertyTypeId ? (
                <p className="text-sm text-ink-500">
                  اختر نوع العقار أولاً لعرض الحقول المناسبة.
                </p>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                {isDetailFieldVisible('areaSqm', propertyTypeCode) ? (
                  <Input
                    name="areaSqm"
                    label="المساحة (م²)"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    dir="ltr"
                    className="text-start"
                    value={form.areaSqm}
                    disabled={formDisabled}
                    error={fieldErrors.areaSqm}
                    onChange={(event) =>
                      updateField('areaSqm', event.target.value)
                    }
                  />
                ) : null}

                {isDetailFieldVisible('bedrooms', propertyTypeCode) ? (
                  <Input
                    name="bedrooms"
                    label="غرف النوم"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    dir="ltr"
                    className="text-start"
                    value={form.bedrooms}
                    disabled={formDisabled}
                    error={fieldErrors.bedrooms}
                    onChange={(event) =>
                      updateField('bedrooms', event.target.value)
                    }
                  />
                ) : null}

                {isDetailFieldVisible('bathrooms', propertyTypeCode) ? (
                  <Input
                    name="bathrooms"
                    label="الحمامات"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    dir="ltr"
                    className="text-start"
                    value={form.bathrooms}
                    disabled={formDisabled}
                    error={fieldErrors.bathrooms}
                    onChange={(event) =>
                      updateField('bathrooms', event.target.value)
                    }
                  />
                ) : null}

                {isDetailFieldVisible('floor', propertyTypeCode) ? (
                  <Input
                    name="floor"
                    label={floorLabel}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    dir="ltr"
                    className="text-start"
                    value={form.floor}
                    disabled={formDisabled}
                    error={fieldErrors.floor}
                    onChange={(event) =>
                      updateField('floor', event.target.value)
                    }
                  />
                ) : null}

                {isDetailFieldVisible('yearBuilt', propertyTypeCode) ? (
                  <Input
                    name="yearBuilt"
                    label="سنة البناء"
                    type="number"
                    inputMode="numeric"
                    min={1800}
                    step={1}
                    dir="ltr"
                    className="text-start"
                    value={form.yearBuilt}
                    disabled={formDisabled}
                    error={fieldErrors.yearBuilt}
                    onChange={(event) =>
                      updateField('yearBuilt', event.target.value)
                    }
                  />
                ) : null}

                {isDetailFieldVisible('finishingType', propertyTypeCode) ? (
                  <Select
                    name="finishingType"
                    label="التشطيب"
                    options={FINISHING_TYPE_OPTIONS}
                    value={form.finishingType}
                    disabled={formDisabled}
                    onChange={(event) =>
                      updateField(
                        'finishingType',
                        event.target.value as FinishingType | '',
                      )
                    }
                  />
                ) : null}

                {isDetailFieldVisible('legalStatus', propertyTypeCode) ? (
                  <Select
                    name="legalStatusId"
                    label="الحالة القانونية"
                    options={legalStatusOptions}
                    value={form.legalStatusId}
                    disabled={formDisabled}
                    onChange={(event) =>
                      updateField('legalStatusId', event.target.value)
                    }
                  />
                ) : null}
              </div>

              {isDetailFieldVisible('propertyViews', propertyTypeCode) ? (
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-ink-800">
                    الإطلالات
                  </legend>
                  {catalogs.propertyViews.length === 0 ? (
                    <p className="text-sm text-ink-500">
                      لا توجد إطلالات متاحة حالياً.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {catalogs.propertyViews.map((view) => {
                        const selected = form.propertyViewIds.includes(view.id);
                        return (
                          <button
                            key={view.id}
                            type="button"
                            disabled={formDisabled}
                            aria-pressed={selected}
                            onClick={() => togglePropertyView(view.id)}
                            className={cn(
                              'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                              selected
                                ? 'border-brand-500 bg-brand-50 text-brand-800'
                                : 'border-border bg-white text-ink-700 hover:bg-surface-50',
                              formDisabled &&
                                'cursor-not-allowed opacity-60',
                            )}
                          >
                            {formatCatalogLabel(view)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </fieldset>
              ) : null}

              {isDetailFieldVisible('furnished', propertyTypeCode) ? (
                <Switch
                  name="furnished"
                  label="مفروش"
                  description="فعّل إذا كان العقار مفروشاً."
                  checked={form.furnished}
                  disabled={formDisabled}
                  onCheckedChange={(checked) =>
                    updateField('furnished', checked)
                  }
                />
              ) : null}
            </section>
          ) : null}

          {currentStep.id === 'pricing' ? (
            <section className="space-y-4">
              {!selectedTransactionType ? (
                <p className="text-sm text-ink-500">
                  اختر نوع المعاملة أولاً من خطوة البيانات الأساسية.
                </p>
              ) : null}

              {isSale ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      name="price"
                      label="السعر"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      dir="ltr"
                      className="text-start"
                      value={form.price}
                      disabled={formDisabled}
                      error={fieldErrors.price}
                      onChange={(event) =>
                        updateField('price', event.target.value)
                      }
                    />
                    <Input
                      name="currency"
                      label="العملة"
                      placeholder="EGP"
                      dir="ltr"
                      className="text-start"
                      value={form.currency}
                      disabled={formDisabled}
                      error={fieldErrors.currency}
                      onChange={(event) =>
                        updateField('currency', event.target.value)
                      }
                    />
                  </div>

                  <Select
                    name="paymentType"
                    label="طريقة الدفع"
                    options={PAYMENT_TYPE_OPTIONS}
                    value={form.paymentType}
                    disabled={formDisabled}
                    error={fieldErrors.paymentType}
                    onChange={(event) =>
                      updateField(
                        'paymentType',
                        event.target.value as PaymentType | '',
                      )
                    }
                  />

                  {showInstallment ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Input
                        name="downPayment"
                        label="المقدم"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        dir="ltr"
                        className="text-start"
                        value={form.downPayment}
                        disabled={formDisabled}
                        error={fieldErrors.downPayment}
                        onChange={(event) =>
                          updateField('downPayment', event.target.value)
                        }
                      />
                      <Input
                        name="installmentYears"
                        label="سنوات التقسيط"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        step={1}
                        dir="ltr"
                        className="text-start"
                        value={form.installmentYears}
                        disabled={formDisabled}
                        error={fieldErrors.installmentYears}
                        onChange={(event) =>
                          updateField('installmentYears', event.target.value)
                        }
                      />
                      <Input
                        name="monthlyInstallment"
                        label="القسط الشهري"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step="any"
                        dir="ltr"
                        className="text-start"
                        value={form.monthlyInstallment}
                        disabled={formDisabled}
                        error={fieldErrors.monthlyInstallment}
                        onChange={(event) =>
                          updateField('monthlyInstallment', event.target.value)
                        }
                      />
                    </div>
                  ) : null}
                </>
              ) : null}

              {showRentPeriod ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      name="price"
                      label="قيمة الإيجار"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      dir="ltr"
                      className="text-start"
                      value={form.price}
                      disabled={formDisabled}
                      error={fieldErrors.price}
                      onChange={(event) =>
                        updateField('price', event.target.value)
                      }
                    />
                    <Input
                      name="currency"
                      label="العملة"
                      placeholder="EGP"
                      dir="ltr"
                      className="text-start"
                      value={form.currency}
                      disabled={formDisabled}
                      error={fieldErrors.currency}
                      onChange={(event) =>
                        updateField('currency', event.target.value)
                      }
                    />
                  </div>
                  <Select
                    name="rentPeriod"
                    label="فترة الإيجار"
                    options={RENT_PERIOD_OPTIONS}
                    value={form.rentPeriod}
                    disabled={formDisabled}
                    error={fieldErrors.rentPeriod}
                    onChange={(event) =>
                      updateField(
                        'rentPeriod',
                        event.target.value as RentPeriod | '',
                      )
                    }
                  />
                </>
              ) : null}

              {selectedTransactionType && !isSale && !isRent ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    name="price"
                    label="السعر"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    dir="ltr"
                    className="text-start"
                    value={form.price}
                    disabled={formDisabled}
                    error={fieldErrors.price}
                    onChange={(event) => updateField('price', event.target.value)}
                  />
                  <Input
                    name="currency"
                    label="العملة"
                    placeholder="EGP"
                    dir="ltr"
                    className="text-start"
                    value={form.currency}
                    disabled={formDisabled}
                    error={fieldErrors.currency}
                    onChange={(event) =>
                      updateField('currency', event.target.value)
                    }
                  />
                </div>
              ) : null}
            </section>
          ) : null}

          {currentStep.id === 'features' ? (
              <PropertyFeaturesField
                features={catalogs.features}
                value={form.featureIds}
                onChange={(featureIds) => updateField('featureIds', featureIds)}
                disabled={formDisabled}
                title="المميزات"
                description="اختر المميزات التي تنطبق على هذا العقار"
                recommendedFeatureCodes={
                  detailFieldConfig.recommendedFeatureCodes
                }
              />
          ) : null}

          {currentStep.id === 'media' ? (
            hasServerDraft && serverDraftId ? (
              <PropertyMediaManager
                propertyId={serverDraftId}
                initialImages={initialData?.images ?? []}
                permissions={permissions}
                disabled={formDisabled}
                title="الوسائط"
              />
            ) : (
              <PropertyImagesField
                value={images}
                primaryId={primaryId}
                onChange={handleImagesChange}
                onPrimaryChange={handlePrimaryChange}
                permissions={permissions}
                disabled={formDisabled}
                error={fieldErrors.images}
                title="الوسائط"
              />
            )
          ) : null}

          {currentStep.id === 'contact' ? (
            <PropertyContactStep
              value={contact}
              onChange={(next) => {
                markDirty();
                setContact(next);
              }}
              ownerPreview={
                selectedOwner
                  ? {
                      name: selectedOwner.name,
                      phone: selectedOwner.phone,
                      email: selectedOwner.email,
                    }
                  : initialData?.owner
                    ? {
                        name: initialData.owner.name,
                        phone: initialData.owner.phone,
                        email: initialData.owner.email,
                      }
                    : null
              }
              disabled={formDisabled}
              loading={contactLoading}
              errors={
                fieldErrors as Partial<
                  Record<keyof PropertyContactFormState, string>
                >
              }
            />
          ) : null}

          {currentStep.id === 'review' ? (
            <WizardReview
              form={form}
              location={location}
              catalogs={catalogs}
              images={images}
              primaryId={primaryId}
              existingImages={initialData?.images}
              isEdit={isEdit || hasServerDraft}
              reviewPrice={reviewPrice}
              compoundLabel={selectedCompoundLabel}
              locationLabels={{
                country: location.countryName || null,
                city: location.cityName || null,
                area: location.areaName || null,
                district: location.districtName || null,
              }}
              propertyTypeCode={propertyTypeCode}
              isSale={isSale}
              isRent={isRent}
              contact={contact}
              ownerPreview={
                selectedOwner
                  ? {
                      name: selectedOwner.name,
                      phone: selectedOwner.phone,
                      email: selectedOwner.email,
                    }
                  : initialData?.owner
                    ? {
                        name: initialData.owner.name,
                        phone: initialData.owner.phone,
                        email: initialData.owner.email,
                      }
                    : null
              }
              onEditStep={goToStep}
            />
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex flex-wrap gap-2">
              {!isFirstStep ? (
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  disabled={loading}
                  onClick={goBack}
                >
                  السابق
                </Button>
              ) : null}
              <Link href={cancelHref}>
                <Button type="button" variant="ghost" size="small" disabled={loading}>
                  إلغاء
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {!isLastStep ? (
                <Button
                  type="button"
                  variant="primary"
                  size="small"
                  disabled={loading}
                  onClick={goNext}
                >
                  التالي
                </Button>
              ) : isEdit || hasServerDraft ? (
                <>
                  {(canUpdate || canCreate) ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="small"
                      disabled={loading}
                      onClick={() => {
                        void submitWizard({ publish: false });
                      }}
                    >
                      {loading ? 'جاري الحفظ…' : 'حفظ المسودة'}
                    </Button>
                  ) : null}
                  {(canUpdate || canCreate) && canPublish ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="small"
                      disabled={loading}
                      onClick={() => {
                        void submitWizard({ publish: true });
                      }}
                    >
                      {loading ? 'جاري النشر…' : 'حفظ ونشر'}
                    </Button>
                  ) : (canUpdate || canCreate) && isEdit && !canPublish ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="small"
                      disabled={loading}
                      onClick={() => {
                        void submitWizard();
                      }}
                    >
                      {loading ? 'جاري الحفظ…' : 'حفظ التعديلات'}
                    </Button>
                  ) : null}
                </>
              ) : (
                <>
                  {canCreate ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="small"
                      disabled={loading}
                      onClick={() => {
                        void submitWizard({ publish: false });
                      }}
                    >
                      {loading ? 'جاري الحفظ…' : 'حفظ كمسودة'}
                    </Button>
                  ) : null}
                  {canCreate && canPublish ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="small"
                      disabled={loading}
                      onClick={() => {
                        void submitWizard({ publish: true });
                      }}
                    >
                      {loading ? 'جاري النشر…' : 'حفظ ونشر'}
                    </Button>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
