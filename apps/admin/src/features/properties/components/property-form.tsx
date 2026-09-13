'use client';

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { MediaAsset } from '@/components/media-picker';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import {
  createPropertyAction,
  listPropertyCompoundsAction,
  updatePropertyAction,
  type CompoundSelectOption,
} from '../actions';
import {
  formatFinishingType,
  formatPaymentType,
  formatPrice,
  formatRentPeriod,
  formatTypeLabel,
} from '../format';
import type {
  AdminPropertyDetails,
  CreatePropertyInput,
  FinishingType,
  PaymentType,
  PropertyFormCatalogs,
  PropertyImageInput,
  RentPeriod,
  UpdatePropertyInput,
} from '../types';
import { PropertyFeaturesField } from './property-features-field';
import { PropertyImagesField } from './property-images-field';
import {
  PropertyLocationField,
  type PropertyLocationValue,
} from './property-location-field';
import { PropertyMediaManager } from './property-media-manager';
import { PropertyOwnerSelect } from './property-owner-select';

interface PropertyFormState {
  ownerId: string;
  title: string;
  referenceNumber: string;
  description: string;
  propertyTypeId: string;
  transactionTypeId: string;
  price: string;
  currency: string;
  areaSqm: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  yearBuilt: string;
  furnished: boolean;
  rentPeriod: RentPeriod | '';
  paymentType: PaymentType | '';
  downPayment: string;
  installmentYears: string;
  monthlyInstallment: string;
  finishingType: FinishingType | '';
  compoundId: string;
  featureIds: string[];
}

interface PropertyFormFieldErrors {
  ownerId?: string;
  title?: string;
  propertyTypeId?: string;
  transactionTypeId?: string;
  price?: string;
  areaId?: string;
  images?: string;
}

export interface PropertyFormProps {
  mode: 'create' | 'edit';
  initialData?: AdminPropertyDetails;
  catalogs: PropertyFormCatalogs;
  permissions: string[];
  onSuccess: (created?: { id: string; status: string; title: string }) => void;
  formId?: string;
  disabled?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

const EMPTY_FORM: PropertyFormState = {
  ownerId: '',
  title: '',
  referenceNumber: '',
  description: '',
  propertyTypeId: '',
  transactionTypeId: '',
  price: '',
  currency: 'EGP',
  areaSqm: '',
  bedrooms: '',
  bathrooms: '',
  floor: '',
  yearBuilt: '',
  furnished: false,
  rentPeriod: '',
  paymentType: '',
  downPayment: '',
  installmentYears: '',
  monthlyInstallment: '',
  finishingType: '',
  compoundId: '',
  featureIds: [],
};

const EMPTY_LOCATION: PropertyLocationValue = {
  countryId: '',
  cityId: '',
  areaId: '',
  districtId: '',
  address: '',
  latitude: '',
  longitude: '',
};

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

function detailsToForm(property: AdminPropertyDetails): PropertyFormState {
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-ink-900">{children}</h3>;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/70 py-2 text-sm last:border-b-0">
      <span className="text-ink-500">{label}</span>
      <span className="max-w-[65%] text-end font-medium text-ink-900">{value}</span>
    </div>
  );
}

export function PropertyForm({
  mode,
  initialData,
  catalogs,
  permissions,
  onSuccess,
  formId = 'property-form',
  disabled = false,
  onLoadingChange,
}: PropertyFormProps) {
  const isEdit = mode === 'edit';
  const canSubmit = hasPermission(
    permissions,
    isEdit ? 'properties.update' : 'properties.create',
  );

  const [form, setForm] = useState<PropertyFormState>(EMPTY_FORM);
  const [location, setLocation] = useState<PropertyLocationValue>(EMPTY_LOCATION);
  const [images, setImages] = useState<MediaAsset[]>([]);
  const [primaryId, setPrimaryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<PropertyFormFieldErrors>({});
  const [compounds, setCompounds] = useState<CompoundSelectOption[]>([]);
  const [compoundsLoading, setCompoundsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && initialData) {
      setForm(detailsToForm(initialData));
      setLocation(detailsToLocation(initialData));
      setImages([]);
      setPrimaryId(null);
      setFieldErrors({});
      return;
    }

    setForm(EMPTY_FORM);
    setLocation(EMPTY_LOCATION);
    setImages([]);
    setPrimaryId(null);
    setFieldErrors({});
  }, [isEdit, initialData]);

  useEffect(() => {
    const areaId = location.areaId.trim();
    if (!areaId) {
      setCompounds([]);
      setForm((current) =>
        current.compoundId ? { ...current, compoundId: '' } : current,
      );
      return;
    }

    let cancelled = false;

    async function loadCompounds() {
      setCompoundsLoading(true);
      const result = await listPropertyCompoundsAction(areaId);
      if (cancelled) {
        return;
      }

      if (result.ok) {
        setCompounds(result.items);
      } else {
        setCompounds([]);
      }
      setCompoundsLoading(false);
    }

    void loadCompounds();

    return () => {
      cancelled = true;
    };
  }, [location.areaId]);

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

  const selectedPropertyType = catalogs.propertyTypes.find(
    (type) => type.id === form.propertyTypeId,
  );
  const selectedTransactionType = catalogs.transactionTypes.find(
    (type) => type.id === form.transactionTypeId,
  );
  const selectedFeatures = catalogs.features.filter((feature) =>
    form.featureIds.includes(feature.id),
  );

  const compoundOptions = useMemo(() => {
    const options = [
      { value: '', label: 'بدون كمباوند' },
      ...compounds.map((compound) => ({
        value: compound.id,
        label: formatCatalogLabel(compound),
      })),
    ];

    const selected = initialData?.compound;
    if (
      selected &&
      form.compoundId === selected.id &&
      !options.some((option) => option.value === selected.id)
    ) {
      options.splice(1, 0, {
        value: selected.id,
        label: formatCatalogLabel(selected),
      });
    }

    return options;
  }, [compounds, form.compoundId, initialData?.compound]);

  function updateField<K extends keyof PropertyFormState>(
    key: K,
    value: PropertyFormState[K],
  ) {
    setForm((current) => {
      const next = { ...current, [key]: value };

      if (key === 'paymentType' && value === 'CASH') {
        next.downPayment = '';
        next.installmentYears = '';
        next.monthlyInstallment = '';
      }

      return next;
    });

    if (key in fieldErrors) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function handleImagesChange(assets: MediaAsset[]) {
    setImages(assets);

    if (assets.length === 0) {
      setPrimaryId(null);
      return;
    }

    if (!primaryId || !assets.some((asset) => asset.id === primaryId)) {
      setPrimaryId(assets[0]?.id ?? null);
    }
  }

  function validateForm(): boolean {
    const nextErrors: PropertyFormFieldErrors = {};

    if (!isEdit && !form.ownerId.trim()) {
      nextErrors.ownerId = 'مالك العقار مطلوب.';
    }

    if (!form.title.trim()) {
      nextErrors.title = 'العنوان مطلوب.';
    }

    if (!form.propertyTypeId.trim()) {
      nextErrors.propertyTypeId = 'نوع العقار مطلوب.';
    }

    if (!form.transactionTypeId.trim()) {
      nextErrors.transactionTypeId = 'نوع المعاملة مطلوب.';
    }

    const price = Number.parseFloat(form.price.trim());
    if (!form.price.trim() || !Number.isFinite(price) || price < 0) {
      nextErrors.price = 'السعر مطلوب ويجب أن يكون رقماً صحيحاً.';
    }

    if (!location.areaId.trim()) {
      nextErrors.areaId = 'المنطقة مطلوبة.';
    }

    if (!isEdit && images.length > 0) {
      const primaryCount = images.filter((asset) => asset.id === primaryId).length;
      if (primaryCount !== 1) {
        nextErrors.images = 'يجب تحديد صورة رئيسية واحدة.';
      }
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || disabled) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    onLoadingChange?.(true);

    const price = Number.parseFloat(form.price.trim());
    const includeInstallment = showsInstallmentFields(form.paymentType);

    if (isEdit && initialData) {
      const payload: UpdatePropertyInput = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        referenceNumber: form.referenceNumber.trim() || null,
        propertyTypeId: form.propertyTypeId,
        transactionTypeId: form.transactionTypeId,
        price,
        currency: form.currency.trim() || 'EGP',
        paymentType: form.paymentType || null,
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
        rentPeriod: form.rentPeriod || null,
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

      const result = await updatePropertyAction(initialData.id, payload);

      if (result.ok) {
        toast.success('تم حفظ تعديلات العقار بنجاح.');
        onSuccess();
        setLoading(false);
        onLoadingChange?.(false);
        return;
      }

      toast.error(getAdminErrorMessage(result.error));
      setLoading(false);
      onLoadingChange?.(false);
      return;
    }

    const imagePayload =
      images.length > 0 ? buildImagePayload(images, primaryId) : undefined;

    const createPayload: CreatePropertyInput = {
      ownerId: form.ownerId.trim(),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      referenceNumber: form.referenceNumber.trim() || undefined,
      propertyTypeId: form.propertyTypeId,
      transactionTypeId: form.transactionTypeId,
      price,
      currency: form.currency.trim() || 'EGP',
      paymentType: form.paymentType || undefined,
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
      rentPeriod: form.rentPeriod || undefined,
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
    };

    const result = await createPropertyAction(createPayload);

    if (result.ok) {
      toast.success('تم إنشاء العقار بنجاح.');
      onSuccess(result.data);
      setLoading(false);
      onLoadingChange?.(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setLoading(false);
    onLoadingChange?.(false);
  }

  const formDisabled = disabled || loading;
  const showInstallment = showsInstallmentFields(form.paymentType);
  const pricePreview = Number.parseFloat(form.price.trim());
  const reviewPrice = Number.isFinite(pricePreview)
    ? formatPrice(pricePreview, form.currency.trim() || 'EGP')
    : '—';

  return (
    <form
      id={formId}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="max-h-[min(75vh,48rem)] space-y-8 overflow-y-auto pe-1"
    >
      <section className="space-y-4">
        <SectionTitle>01 — البيانات الأساسية</SectionTitle>

        {!isEdit ? (
          <PropertyOwnerSelect
            value={form.ownerId}
            onChange={(ownerId) => updateField('ownerId', ownerId)}
            disabled={formDisabled}
            error={fieldErrors.ownerId}
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
          onChange={(event) => updateField('referenceNumber', event.target.value)}
        />

        <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor="description">
          <span className="font-medium text-ink-800">الوصف</span>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            disabled={formDisabled}
            placeholder="وصف تفصيلي للعقار…"
            onChange={(event) => updateField('description', event.target.value)}
            className={cn(
              'min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900',
              'placeholder:text-ink-400',
              'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
              'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
            )}
          />
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
            onChange={(event) => updateField('propertyTypeId', event.target.value)}
          />
          <Select
            name="transactionTypeId"
            label="نوع المعاملة"
            placeholder="اختر المعاملة"
            options={transactionTypeOptions}
            value={form.transactionTypeId}
            disabled={formDisabled}
            error={fieldErrors.transactionTypeId}
            onChange={(event) => updateField('transactionTypeId', event.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>02 — السعر والدفع</SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="price"
            label="السعر"
            type="number"
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
            onChange={(event) => updateField('currency', event.target.value)}
          />
        </div>

        <Select
          name="paymentType"
          label="طريقة الدفع"
          options={PAYMENT_TYPE_OPTIONS}
          value={form.paymentType}
          disabled={formDisabled}
          onChange={(event) =>
            updateField('paymentType', event.target.value as PaymentType | '')
          }
        />

        <Select
          name="rentPeriod"
          label="فترة الإيجار"
          options={RENT_PERIOD_OPTIONS}
          value={form.rentPeriod}
          disabled={formDisabled}
          onChange={(event) =>
            updateField('rentPeriod', event.target.value as RentPeriod | '')
          }
        />

        {showInstallment ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="downPayment"
              label="المقدم"
              type="number"
              min={0}
              step="any"
              dir="ltr"
              className="text-start"
              value={form.downPayment}
              disabled={formDisabled}
              onChange={(event) => updateField('downPayment', event.target.value)}
            />
            <Input
              name="installmentYears"
              label="سنوات التقسيط"
              type="number"
              min={1}
              dir="ltr"
              className="text-start"
              value={form.installmentYears}
              disabled={formDisabled}
              onChange={(event) =>
                updateField('installmentYears', event.target.value)
              }
            />
            <Input
              name="monthlyInstallment"
              label="القسط الشهري"
              type="number"
              min={0}
              step="any"
              dir="ltr"
              className="text-start"
              value={form.monthlyInstallment}
              disabled={formDisabled}
              onChange={(event) =>
                updateField('monthlyInstallment', event.target.value)
              }
            />
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <SectionTitle>03 — تفاصيل العقار</SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="areaSqm"
            label="المساحة (م²)"
            type="number"
            min={0}
            dir="ltr"
            className="text-start"
            value={form.areaSqm}
            disabled={formDisabled}
            onChange={(event) => updateField('areaSqm', event.target.value)}
          />
          <Input
            name="bedrooms"
            label="غرف النوم"
            type="number"
            min={0}
            dir="ltr"
            className="text-start"
            value={form.bedrooms}
            disabled={formDisabled}
            onChange={(event) => updateField('bedrooms', event.target.value)}
          />
          <Input
            name="bathrooms"
            label="الحمامات"
            type="number"
            min={0}
            dir="ltr"
            className="text-start"
            value={form.bathrooms}
            disabled={formDisabled}
            onChange={(event) => updateField('bathrooms', event.target.value)}
          />
          <Input
            name="floor"
            label="الدور"
            type="number"
            dir="ltr"
            className="text-start"
            value={form.floor}
            disabled={formDisabled}
            onChange={(event) => updateField('floor', event.target.value)}
          />
          <Input
            name="yearBuilt"
            label="سنة البناء"
            type="number"
            min={1800}
            dir="ltr"
            className="text-start"
            value={form.yearBuilt}
            disabled={formDisabled}
            onChange={(event) => updateField('yearBuilt', event.target.value)}
          />
          <Select
            name="finishingType"
            label="التشطيب"
            options={FINISHING_TYPE_OPTIONS}
            value={form.finishingType}
            disabled={formDisabled}
            onChange={(event) =>
              updateField('finishingType', event.target.value as FinishingType | '')
            }
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-ink-800">
          <input
            type="checkbox"
            checked={form.furnished}
            disabled={formDisabled}
            className="size-4 rounded border-border text-brand-600 focus:ring-brand-200"
            onChange={(event) => updateField('furnished', event.target.checked)}
          />
          مفروش
        </label>
      </section>

      <section className="space-y-4">
        <PropertyLocationField
          value={location}
          onChange={setLocation}
          disabled={formDisabled}
          areaError={fieldErrors.areaId}
          title="04 — الموقع"
        />

        <Select
          name="compoundId"
          label="الكمبوند"
          options={compoundOptions}
          value={form.compoundId}
          disabled={formDisabled || !location.areaId || compoundsLoading}
          onChange={(event) => updateField('compoundId', event.target.value)}
        />
        {!location.areaId ? (
          <p className="text-xs text-ink-500">اختر المنطقة أولاً لعرض الكمبوندات.</p>
        ) : compoundsLoading ? (
          <p className="text-xs text-ink-500">جاري تحميل الكمبوندات…</p>
        ) : null}
      </section>

      <PropertyFeaturesField
        features={catalogs.features}
        value={form.featureIds}
        onChange={(featureIds) => updateField('featureIds', featureIds)}
        disabled={formDisabled}
        title="05 — المميزات"
      />

      {isEdit && initialData ? (
        <PropertyMediaManager
          propertyId={initialData.id}
          initialImages={initialData.images}
          permissions={permissions}
          disabled={formDisabled}
          title="06 — الوسائط"
        />
      ) : (
        <PropertyImagesField
          value={images}
          primaryId={primaryId}
          onChange={handleImagesChange}
          onPrimaryChange={setPrimaryId}
          permissions={permissions}
          disabled={formDisabled}
          error={fieldErrors.images}
          title="06 — الوسائط"
        />
      )}

      <section className="space-y-3 rounded-xl border border-border bg-surface-50/60 p-4">
        <SectionTitle>07 — مراجعة</SectionTitle>
        <p className="text-xs text-ink-500">
          راجع البيانات قبل الإرسال. التحقق النهائي يتم عبر واجهة الـ API.
        </p>
        <div>
          <ReviewRow label="العنوان" value={form.title.trim() || '—'} />
          <ReviewRow
            label="الرقم المرجعي"
            value={form.referenceNumber.trim() || '—'}
          />
          <ReviewRow
            label="نوع العقار"
            value={
              selectedPropertyType
                ? formatCatalogLabel(selectedPropertyType)
                : '—'
            }
          />
          <ReviewRow
            label="نوع المعاملة"
            value={
              selectedTransactionType
                ? formatCatalogLabel(selectedTransactionType)
                : '—'
            }
          />
          <ReviewRow label="السعر" value={reviewPrice} />
          <ReviewRow
            label="طريقة الدفع"
            value={formatPaymentType(form.paymentType || null)}
          />
          <ReviewRow
            label="فترة الإيجار"
            value={formatRentPeriod(form.rentPeriod || null)}
          />
          <ReviewRow
            label="التشطيب"
            value={formatFinishingType(form.finishingType || null)}
          />
          <ReviewRow
            label="المميزات"
            value={
              selectedFeatures.length > 0
                ? selectedFeatures
                    .map((feature) => feature.nameAr ?? feature.nameEn)
                    .join('، ')
                : '—'
            }
          />
          <ReviewRow
            label="الوسائط"
            value={
              isEdit
                ? `${(initialData?.images.length ?? 0).toLocaleString('ar-EG')} عنصر (إدارة منفصلة)`
                : `${images.length.toLocaleString('ar-EG')} صورة جاهزة للإرفاق`
            }
          />
          {isEdit ? (
            <ReviewRow
              label="المالك"
              value={
                initialData
                  ? initialData.owner.name ?? initialData.owner.email
                  : '—'
              }
            />
          ) : null}
          <ReviewRow
            label="الموقع"
            value={location.areaId ? 'تم تحديد المنطقة' : 'لم تُحدد المنطقة بعد'}
          />
          {initialData?.compound || form.compoundId ? (
            <ReviewRow
              label="الكمبوند"
              value={
                formatTypeLabel(
                  compounds.find((compound) => compound.id === form.compoundId) ??
                    initialData?.compound ??
                    null,
                )
              }
            />
          ) : null}
        </div>
      </section>
    </form>
  );
}
