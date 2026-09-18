'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { hasPermission } from '@/features/auth/permissions';
import { toast } from '@/lib/toast';
import {
  createFeatureAction,
  createPropertyLegalStatusAction,
  createPropertyTypeAction,
  createPropertyViewAction,
  createTransactionTypeAction,
  deleteFeatureAction,
  deletePropertyLegalStatusAction,
  deletePropertyViewAction,
  updateFeatureAction,
  updatePropertyLegalStatusAction,
  updatePropertyTypeAction,
  updatePropertyViewAction,
  updateTransactionTypeAction,
} from '../actions';
import type {
  AdminCatalogFeature,
  AdminCatalogPropertyLegalStatus,
  AdminCatalogPropertyType,
  AdminCatalogPropertyView,
  AdminCatalogTransactionType,
} from '../types';

type CatalogKind =
  | 'property-types'
  | 'transaction-types'
  | 'features'
  | 'property-views'
  | 'property-legal-statuses';

type CatalogItem =
  | AdminCatalogPropertyType
  | AdminCatalogTransactionType
  | AdminCatalogFeature
  | AdminCatalogPropertyView
  | AdminCatalogPropertyLegalStatus;

interface CatalogManagerProps {
  kind: CatalogKind;
  permissions: string[];
  items: CatalogItem[];
  title: string;
  description: string;
}

/** Dedicated permission prefix per catalog kind (catalogs.* stays an alias). */
const KIND_PERMISSION_PREFIX: Partial<Record<CatalogKind, string>> = {
  features: 'features',
  'property-views': 'property_views',
  'property-legal-statuses': 'property_legal_statuses',
};

const CODE_PLACEHOLDERS: Record<CatalogKind, string> = {
  'property-types': 'APARTMENT',
  'transaction-types': 'SALE',
  features: 'PARKING',
  'property-views': 'NILE',
  'property-legal-statuses': 'REGISTERED_MONTHLY',
};

const FEATURE_CATEGORIES = [
  { value: 'amenities', label: 'أساسية (amenities)' },
  { value: 'indoor', label: 'داخلية (indoor)' },
  { value: 'outdoor', label: 'خارجية (outdoor)' },
];

function labelOf(item: { nameAr: string | null; nameEn: string }) {
  return item.nameAr ?? item.nameEn;
}

export function CatalogManager({
  kind,
  permissions,
  items,
  title,
  description,
}: CatalogManagerProps) {
  const router = useRouter();
  const permissionPrefix = KIND_PERMISSION_PREFIX[kind];
  const canCreate =
    hasPermission(permissions, 'catalogs.create') ||
    (permissionPrefix
      ? hasPermission(permissions, `${permissionPrefix}.create`)
      : false);
  const canUpdate =
    hasPermission(permissions, 'catalogs.update') ||
    (permissionPrefix
      ? hasPermission(permissions, `${permissionPrefix}.update`)
      : false);
  const canDelete =
    Boolean(permissionPrefix) &&
    (hasPermission(permissions, `${permissionPrefix}.delete`) ||
      hasPermission(permissions, 'catalogs.update'));
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [category, setCategory] = useState('amenities');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  function resetForm() {
    setEditingId(null);
    setCode('');
    setNameEn('');
    setNameAr('');
    setCategory('amenities');
    setSortOrder('0');
    setIsActive(true);
  }

  function openCreate() {
    resetForm();
    setOpen(true);
  }

  function openEdit(item: CatalogItem) {
    setEditingId(item.id);
    setCode(item.code);
    setNameEn(item.nameEn);
    setNameAr(item.nameAr ?? '');
    setIsActive(item.isActive);
    if (kind === 'property-types' && 'sortOrder' in item) {
      setSortOrder(String(item.sortOrder));
    }
    if (kind === 'features' && 'category' in item) {
      const raw = (item.category ?? 'amenities').toLowerCase();
      setCategory(
        raw === 'indoor' || raw === 'outdoor' || raw === 'amenities'
          ? raw
          : 'amenities',
      );
    }
    setOpen(true);
  }

  async function handleSubmit() {
    if (!code.trim() || !nameEn.trim()) {
      toast.error('الرمز والاسم الإنجليزي مطلوبان.');
      return;
    }

    setLoading(true);
    let result;

    if (kind === 'property-types') {
      const payload = {
        code: code.trim(),
        nameEn: nameEn.trim(),
        nameAr: nameAr.trim() || undefined,
        sortOrder: Number.parseInt(sortOrder, 10) || 0,
        isActive,
      };
      result = editingId
        ? await updatePropertyTypeAction(editingId, payload)
        : await createPropertyTypeAction(payload);
    } else if (kind === 'transaction-types') {
      const payload = {
        code: code.trim(),
        nameEn: nameEn.trim(),
        nameAr: nameAr.trim() || undefined,
        isActive,
      };
      result = editingId
        ? await updateTransactionTypeAction(editingId, payload)
        : await createTransactionTypeAction(payload);
    } else if (kind === 'property-views') {
      const payload = {
        code: code.trim(),
        nameEn: nameEn.trim(),
        nameAr: nameAr.trim() || undefined,
        isActive,
      };
      result = editingId
        ? await updatePropertyViewAction(editingId, payload)
        : await createPropertyViewAction(payload);
    } else if (kind === 'property-legal-statuses') {
      const payload = {
        code: code.trim(),
        nameEn: nameEn.trim(),
        nameAr: nameAr.trim() || undefined,
        isActive,
      };
      result = editingId
        ? await updatePropertyLegalStatusAction(editingId, payload)
        : await createPropertyLegalStatusAction(payload);
    } else {
      const payload = {
        code: code.trim(),
        nameEn: nameEn.trim(),
        nameAr: nameAr.trim() || undefined,
        category: category.trim() || undefined,
        isActive,
      };
      result = editingId
        ? await updateFeatureAction(editingId, payload)
        : await createFeatureAction(payload);
    }

    setLoading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(editingId ? 'تم التحديث بنجاح' : 'تم الإنشاء بنجاح');
    setOpen(false);
    resetForm();
    router.refresh();
  }

  async function toggleActive(item: CatalogItem) {
    if (!canUpdate) return;
    setLoading(true);
    const patch = { isActive: !item.isActive };
    let result;
    if (kind === 'property-types') {
      result = await updatePropertyTypeAction(item.id, patch);
    } else if (kind === 'transaction-types') {
      result = await updateTransactionTypeAction(item.id, patch);
    } else if (kind === 'property-views') {
      result = await updatePropertyViewAction(item.id, patch);
    } else if (kind === 'property-legal-statuses') {
      result = await updatePropertyLegalStatusAction(item.id, patch);
    } else {
      result = await updateFeatureAction(item.id, patch);
    }
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(item.isActive ? 'تم التعطيل' : 'تم التفعيل');
    router.refresh();
  }

  async function handleDelete(item: CatalogItem) {
    if (!canDelete) return;
    setLoading(true);
    const result =
      kind === 'property-views'
        ? await deletePropertyViewAction(item.id)
        : kind === 'property-legal-statuses'
          ? await deletePropertyLegalStatusAction(item.id)
          : await deleteFeatureAction(item.id);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(
      result.deleted
        ? 'تم الحذف'
        : 'العنصر مستخدم في عقارات — تم تعطيله بدلاً من الحذف',
    );
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-ink-900">{title}</h2>
          <p className="text-sm text-ink-500">{description}</p>
        </div>
        {canCreate ? (
          <Button type="button" size="small" onClick={openCreate}>
            إضافة
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="لا توجد عناصر"
          description="أضف عنصراً جديداً ليظهر في نماذج إنشاء العقارات."
        />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ink-900">{labelOf(item)}</p>
                    <Badge variant={item.isActive ? 'success' : 'default'}>
                      {item.isActive ? 'نشط' : 'معطّل'}
                    </Badge>
                    {kind === 'features' && 'category' in item && item.category ? (
                      <Badge variant="brand">{item.category}</Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-ink-500" dir="ltr">
                    {item.code} · {item.nameEn}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canUpdate ? (
                    <>
                      <Button
                        type="button"
                        size="small"
                        variant="outline"
                        disabled={loading}
                        onClick={() => openEdit(item)}
                      >
                        تعديل
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        variant="ghost"
                        disabled={loading}
                        onClick={() => {
                          void toggleActive(item);
                        }}
                      >
                        {item.isActive ? 'تعطيل' : 'تفعيل'}
                      </Button>
                      {canDelete ? (
                        <Button
                          type="button"
                          size="small"
                          variant="ghost"
                          disabled={loading}
                          onClick={() => {
                            void handleDelete(item);
                          }}
                        >
                          حذف
                        </Button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (loading) return;
          setOpen(next);
          if (!next) resetForm();
        }}
        title={editingId ? 'تعديل العنصر' : 'إضافة عنصر'}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="small"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              size="small"
              disabled={loading}
              onClick={() => {
                void handleSubmit();
              }}
            >
              {loading ? 'جاري الحفظ…' : 'حفظ'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="الرمز (Code)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={CODE_PLACEHOLDERS[kind]}
            dir="ltr"
            disabled={loading}
          />
          <Input
            label="الاسم بالإنجليزية"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            disabled={loading}
          />
          <Input
            label="الاسم بالعربية"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            disabled={loading}
          />
          {kind === 'property-types' ? (
            <Input
              label="ترتيب العرض"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              disabled={loading}
            />
          ) : null}
          {kind === 'features' ? (
            <Select
              label="التصنيف"
              options={FEATURE_CATEGORIES}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            />
          ) : null}
          <label className="flex items-center gap-2 text-sm text-ink-800">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={loading}
            />
            نشط (يظهر في نماذج العقارات)
          </label>
        </div>
      </Dialog>
    </div>
  );
}
