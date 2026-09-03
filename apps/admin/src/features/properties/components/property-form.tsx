'use client';

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { MediaAsset } from '@/components/media-picker';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import type { UserRole } from '@/types';
import { createPropertyAction, updatePropertyAction } from '../actions';
import type {
  AdminPropertyDetails,
  CreatePropertyInput,
  PropertyFormCatalogs,
  PropertyImageInput,
  UpdatePropertyInput,
} from '../types';
import { PropertyFeaturesField } from './property-features-field';
import { PropertyImagesField } from './property-images-field';
import {
  PropertyLocationField,
  type PropertyLocationValue,
} from './property-location-field';
import { PropertyOwnerSelect } from './property-owner-select';

interface PropertyFormState {
  ownerId: string;
  title: string;
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

function formatCatalogLabel(item: { nameAr: string | null; nameEn: string }): string {
  return item.nameAr ?? item.nameEn;
}

function detailsToForm(property: AdminPropertyDetails): PropertyFormState {
  return {
    ownerId: property.owner.id,
    title: property.title ?? '',
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
  }));
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
  const [imagesDirty, setImagesDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<PropertyFormFieldErrors>({});

  useEffect(() => {
    if (isEdit && initialData) {
      setForm(detailsToForm(initialData));
      setLocation(detailsToLocation(initialData));
      setImages([]);
      setPrimaryId(null);
      setImagesDirty(false);
      setFieldErrors({});
      return;
    }

    setForm(EMPTY_FORM);
    setLocation(EMPTY_LOCATION);
    setImages([]);
    setPrimaryId(null);
    setImagesDirty(false);
    setFieldErrors({});
  }, [isEdit, initialData]);

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

  function updateField<K extends keyof PropertyFormState>(
    key: K,
    value: PropertyFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function handleImagesChange(assets: MediaAsset[]) {
    setImages(assets);
    setImagesDirty(true);

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

    if (images.length > 0) {
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
    const imagePayload =
      images.length > 0 ? buildImagePayload(images, primaryId) : undefined;

    if (isEdit && initialData) {
      const payload: UpdatePropertyInput = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        propertyTypeId: form.propertyTypeId,
        transactionTypeId: form.transactionTypeId,
        price,
        currency: form.currency.trim() || 'EGP',
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
        address: location.address.trim() || null,
        latitude: parseOptionalFloat(location.latitude) ?? null,
        longitude: parseOptionalFloat(location.longitude) ?? null,
        featureIds: form.featureIds,
      };

      if (imagesDirty && imagePayload) {
        payload.images = imagePayload;
      }

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

    const createPayload: CreatePropertyInput = {
      ownerId: form.ownerId.trim(),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      propertyTypeId: form.propertyTypeId,
      transactionTypeId: form.transactionTypeId,
      price,
      currency: form.currency.trim() || 'EGP',
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
      address: location.address.trim() || undefined,
      latitude: parseOptionalFloat(location.latitude),
      longitude: parseOptionalFloat(location.longitude),
      featureIds: form.featureIds.length > 0 ? form.featureIds : undefined,
      images: imagePayload,
    };

    if (process.env.NODE_ENV === 'development') {
      console.info('[admin:property-create:form-submit]', {
        ownerId: createPayload.ownerId,
        title: createPayload.title,
        areaId: createPayload.areaId,
        imageCount: createPayload.images?.length ?? 0,
      });
    }

    const result = await createPropertyAction(createPayload);

    if (result.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.info('[admin:property-create:form-success]', {
          id: result.data.id,
          status: result.data.status,
          title: result.data.title,
        });
      }

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

  return (
    <form
      id={formId}
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="max-h-[min(70vh,42rem)] space-y-6 overflow-y-auto pe-1"
    >
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-ink-900">المعلومات الأساسية</h3>

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
          label="عنوان الإعلان"
          placeholder="شقة فاخرة في…"
          value={form.title}
          disabled={formDisabled}
          error={fieldErrors.title}
          onChange={(event) => updateField('title', event.target.value)}
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
        <h3 className="text-sm font-semibold text-ink-900">تفاصيل العقار</h3>

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
            label="الطابق"
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

      <PropertyLocationField
        value={location}
        onChange={setLocation}
        disabled={formDisabled}
        areaError={fieldErrors.areaId}
      />

      <PropertyImagesField
        value={images}
        primaryId={primaryId}
        onChange={handleImagesChange}
        onPrimaryChange={setPrimaryId}
        existingImages={isEdit ? initialData?.images : undefined}
        permissions={permissions}
        disabled={formDisabled}
        error={fieldErrors.images}
      />

      <PropertyFeaturesField
        features={catalogs.features}
        value={form.featureIds}
        onChange={(featureIds) => updateField('featureIds', featureIds)}
        disabled={formDisabled}
      />
    </form>
  );
}
