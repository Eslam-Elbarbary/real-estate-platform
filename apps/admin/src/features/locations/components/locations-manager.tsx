'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { hasPermission } from '@/features/auth/permissions';
import { toast } from '@/lib/toast';
import {
  createAreaAction,
  createCityAction,
  createCountryAction,
  createDistrictAction,
  deleteDistrictAction,
  listAreasAction,
  listCitiesAction,
  listCountriesAction,
  listDistrictsAction,
  updateAreaAction,
  updateCityAction,
  updateCountryAction,
  updateDistrictAction,
} from '../admin-actions';
import type { AdminArea, AdminCity, AdminCountry, AdminDistrict } from '../types';

interface LocationsManagerProps {
  permissions: string[];
  initialCountries: AdminCountry[];
}

type LocationRow = {
  id: string;
  code?: string;
  slug?: string;
  nameEn: string;
  nameAr: string | null;
  isActive: boolean;
};

type FormState = {
  open: boolean;
  editingId: string | null;
  key: string;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  open: false,
  editingId: null,
  key: '',
  nameEn: '',
  nameAr: '',
  isActive: true,
};

interface LocationColumnProps {
  title: string;
  keyLabel: string;
  keyPlaceholder: string;
  items: LocationRow[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
  loading: boolean;
  disabledMessage?: string;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete?: boolean;
  onSubmit: (form: FormState) => Promise<{ ok: boolean; error?: string }>;
  onDelete?: (id: string) => Promise<{ ok: boolean; error?: string; deleted?: boolean }>;
}

function LocationColumn({
  title,
  keyLabel,
  keyPlaceholder,
  items,
  selectedId,
  onSelect,
  loading,
  disabledMessage,
  canCreate,
  canUpdate,
  canDelete,
  onSubmit,
  onDelete,
}: LocationColumnProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setForm({ ...EMPTY_FORM, open: true });
  }

  function openEdit(item: LocationRow) {
    setForm({
      open: true,
      editingId: item.id,
      key: item.code ?? item.slug ?? '',
      nameEn: item.nameEn,
      nameAr: item.nameAr ?? '',
      isActive: item.isActive,
    });
  }

  async function handleSubmit() {
    if (!form.key.trim() || !form.nameEn.trim()) {
      toast.error('الرمز والاسم الإنجليزي مطلوبان.');
      return;
    }
    setSaving(true);
    const result = await onSubmit(form);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? 'حدث خطأ غير متوقع.');
      return;
    }
    toast.success(form.editingId ? 'تم التحديث بنجاح' : 'تم الإنشاء بنجاح');
    setForm(EMPTY_FORM);
  }

  async function handleToggleActive(item: LocationRow) {
    setSaving(true);
    const result = await onSubmit({
      open: true,
      editingId: item.id,
      key: item.code ?? item.slug ?? '',
      nameEn: item.nameEn,
      nameAr: item.nameAr ?? '',
      isActive: !item.isActive,
    });
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? 'حدث خطأ غير متوقع.');
      return;
    }
    toast.success(item.isActive ? 'تم التعطيل' : 'تم التفعيل');
  }

  async function handleDelete(item: LocationRow) {
    if (!onDelete) return;
    setSaving(true);
    const result = await onDelete(item.id);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error ?? 'حدث خطأ غير متوقع.');
      return;
    }
    toast.success(
      result.deleted ? 'تم الحذف' : 'العنصر مستخدم في عقارات — تم تعطيله بدلاً من الحذف',
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          {canCreate && !disabledMessage ? (
            <Button type="button" size="small" variant="outline" onClick={openCreate}>
              إضافة
            </Button>
          ) : null}
        </div>

        {disabledMessage ? (
          <p className="text-xs text-ink-500">{disabledMessage}</p>
        ) : loading ? (
          <p className="text-xs text-ink-500">جاري التحميل…</p>
        ) : items.length === 0 ? (
          <EmptyState title="لا توجد عناصر" description="أضف عنصراً جديداً." />
        ) : (
          <div className="flex-1 space-y-1 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                  selectedId === item.id
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-transparent hover:border-border'
                }`}
              >
                <button
                  type="button"
                  className="flex w-full flex-col items-start gap-0.5 text-start"
                  onClick={() => onSelect?.(item.id)}
                  disabled={!onSelect}
                >
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink-900">
                      {item.nameAr ?? item.nameEn}
                    </span>
                    <Badge variant={item.isActive ? 'success' : 'default'}>
                      {item.isActive ? 'نشط' : 'معطّل'}
                    </Badge>
                  </span>
                  <span className="text-xs text-ink-500" dir="ltr">
                    {item.code ?? item.slug} · {item.nameEn}
                  </span>
                </button>
                {canUpdate ? (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <Button
                      type="button"
                      size="small"
                      variant="ghost"
                      disabled={saving}
                      onClick={() => openEdit(item)}
                    >
                      تعديل
                    </Button>
                    <Button
                      type="button"
                      size="small"
                      variant="ghost"
                      disabled={saving}
                      onClick={() => {
                        void handleToggleActive(item);
                      }}
                    >
                      {item.isActive ? 'تعطيل' : 'تفعيل'}
                    </Button>
                    {canDelete && onDelete ? (
                      <Button
                        type="button"
                        size="small"
                        variant="ghost"
                        disabled={saving}
                        onClick={() => {
                          void handleDelete(item);
                        }}
                      >
                        حذف
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog
        open={form.open}
        onOpenChange={(next) => {
          if (saving) return;
          setForm(next ? form : EMPTY_FORM);
        }}
        title={form.editingId ? `تعديل — ${title}` : `إضافة — ${title}`}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="small"
              disabled={saving}
              onClick={() => setForm(EMPTY_FORM)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              size="small"
              disabled={saving}
              onClick={() => {
                void handleSubmit();
              }}
            >
              {saving ? 'جاري الحفظ…' : 'حفظ'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label={keyLabel}
            value={form.key}
            onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))}
            placeholder={keyPlaceholder}
            dir="ltr"
            disabled={saving}
          />
          <Input
            label="الاسم بالإنجليزية"
            value={form.nameEn}
            onChange={(e) => setForm((prev) => ({ ...prev, nameEn: e.target.value }))}
            disabled={saving}
          />
          <Input
            label="الاسم بالعربية"
            value={form.nameAr}
            onChange={(e) => setForm((prev) => ({ ...prev, nameAr: e.target.value }))}
            disabled={saving}
          />
          <label className="flex items-center gap-2 text-sm text-ink-800">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
              disabled={saving}
            />
            نشط (يظهر في نماذج العقارات)
          </label>
        </div>
      </Dialog>
    </Card>
  );
}

export function LocationsManager({ permissions, initialCountries }: LocationsManagerProps) {
  const canCreate = hasPermission(permissions, 'catalogs.create') || hasPermission(permissions, 'locations.create');
  const canUpdate = hasPermission(permissions, 'catalogs.update') || hasPermission(permissions, 'locations.update');
  const canDelete = hasPermission(permissions, 'locations.delete') || hasPermission(permissions, 'catalogs.update');

  const [countries, setCountries] = useState<AdminCountry[]>(initialCountries);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  const [cities, setCities] = useState<AdminCity[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const [areas, setAreas] = useState<AdminArea[]>([]);
  const [areasLoading, setAreasLoading] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const [districts, setDistricts] = useState<AdminDistrict[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  function handleSelectCountry(id: string) {
    setSelectedCountryId(id);
    setCities([]);
    setSelectedCityId(null);
    setAreas([]);
    setSelectedAreaId(null);
    setDistricts([]);
  }

  function handleSelectCity(id: string) {
    setSelectedCityId(id);
    setAreas([]);
    setSelectedAreaId(null);
    setDistricts([]);
  }

  function handleSelectArea(id: string) {
    setSelectedAreaId(id);
    setDistricts([]);
  }

  useEffect(() => {
    if (!selectedCountryId) return;

    let cancelled = false;
    setCitiesLoading(true);
    void listCitiesAction(selectedCountryId).then((result) => {
      if (cancelled) return;
      setCitiesLoading(false);
      setCities(result.ok ? result.items : []);
      if (!result.ok) toast.error(result.error);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedCountryId]);

  useEffect(() => {
    if (!selectedCityId) return;

    let cancelled = false;
    setAreasLoading(true);
    void listAreasAction(selectedCityId).then((result) => {
      if (cancelled) return;
      setAreasLoading(false);
      setAreas(result.ok ? result.items : []);
      if (!result.ok) toast.error(result.error);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedCityId]);

  useEffect(() => {
    if (!selectedAreaId) return;

    let cancelled = false;
    setDistrictsLoading(true);
    void listDistrictsAction(selectedAreaId).then((result) => {
      if (cancelled) return;
      setDistrictsLoading(false);
      setDistricts(result.ok ? result.items : []);
      if (!result.ok) toast.error(result.error);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedAreaId]);

  return (
    <div className="grid gap-4 lg:grid-cols-4 lg:items-start">
      <LocationColumn
        title="الدول"
        keyLabel="الرمز (Code)"
        keyPlaceholder="EG"
        items={countries}
        selectedId={selectedCountryId}
        onSelect={handleSelectCountry}
        loading={false}
        canCreate={canCreate}
        canUpdate={canUpdate}
        onSubmit={async (form) => {
          const payload = {
            code: form.key.trim(),
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim() || undefined,
            isActive: form.isActive,
          };
          const result = form.editingId
            ? await updateCountryAction(form.editingId, payload)
            : await createCountryAction(payload);
          if (result.ok) {
            const refreshed = await listCountriesAction();
            if (refreshed.ok) setCountries(refreshed.items);
          }
          return result;
        }}
      />

      <LocationColumn
        title="المدن"
        keyLabel="المعرّف (Slug)"
        keyPlaceholder="cairo"
        items={cities}
        selectedId={selectedCityId}
        onSelect={handleSelectCity}
        loading={citiesLoading}
        disabledMessage={selectedCountryId ? undefined : 'اختر دولة أولاً'}
        canCreate={canCreate}
        canUpdate={canUpdate}
        onSubmit={async (form) => {
          if (!selectedCountryId) return { ok: false, error: 'اختر دولة أولاً' };
          const payload = {
            slug: form.key.trim(),
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim() || undefined,
            isActive: form.isActive,
          };
          const result = form.editingId
            ? await updateCityAction(form.editingId, payload)
            : await createCityAction(selectedCountryId, payload);
          if (result.ok) {
            const refreshed = await listCitiesAction(selectedCountryId);
            if (refreshed.ok) setCities(refreshed.items);
          }
          return result;
        }}
      />

      <LocationColumn
        title="المناطق"
        keyLabel="المعرّف (Slug)"
        keyPlaceholder="new-cairo"
        items={areas}
        selectedId={selectedAreaId}
        onSelect={handleSelectArea}
        loading={areasLoading}
        disabledMessage={selectedCityId ? undefined : 'اختر مدينة أولاً'}
        canCreate={canCreate}
        canUpdate={canUpdate}
        onSubmit={async (form) => {
          if (!selectedCityId) return { ok: false, error: 'اختر مدينة أولاً' };
          const payload = {
            slug: form.key.trim(),
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim() || undefined,
            isActive: form.isActive,
          };
          const result = form.editingId
            ? await updateAreaAction(form.editingId, payload)
            : await createAreaAction(selectedCityId, payload);
          if (result.ok) {
            const refreshed = await listAreasAction(selectedCityId);
            if (refreshed.ok) setAreas(refreshed.items);
          }
          return result;
        }}
      />

      <LocationColumn
        title="الأحياء"
        keyLabel="المعرّف (Slug)"
        keyPlaceholder="fifth-settlement"
        items={districts}
        selectedId={null}
        loading={districtsLoading}
        disabledMessage={selectedAreaId ? undefined : 'اختر منطقة أولاً'}
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
        onSubmit={async (form) => {
          if (!selectedAreaId) return { ok: false, error: 'اختر منطقة أولاً' };
          const payload = {
            slug: form.key.trim(),
            nameEn: form.nameEn.trim(),
            nameAr: form.nameAr.trim() || undefined,
            isActive: form.isActive,
          };
          const result = form.editingId
            ? await updateDistrictAction(form.editingId, payload)
            : await createDistrictAction(selectedAreaId, payload);
          if (result.ok) {
            const refreshed = await listDistrictsAction(selectedAreaId);
            if (refreshed.ok) setDistricts(refreshed.items);
          }
          return result;
        }}
        onDelete={async (id) => {
          const result = await deleteDistrictAction(id);
          if (result.ok && selectedAreaId) {
            const refreshed = await listDistrictsAction(selectedAreaId);
            if (refreshed.ok) setDistricts(refreshed.items);
          }
          return result;
        }}
      />
    </div>
  );
}
