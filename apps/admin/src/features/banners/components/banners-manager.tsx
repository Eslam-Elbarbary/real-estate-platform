'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { hasPermission } from '@/features/auth/permissions';
import { toast } from '@/lib/toast';
import {
  deleteBannerAction,
  reorderBannersAction,
  updateBannerAction,
} from '../actions';
import { BANNER_POSITION_OPTIONS, type AdminBanner } from '../types';
import { BannerFormDialog } from './banner-form-dialog';
import { BannerPreviewDialog } from './banner-preview-dialog';

interface BannersManagerProps {
  items: AdminBanner[];
  permissions: string[];
}

function positionLabel(position: string) {
  return (
    BANNER_POSITION_OPTIONS.find((option) => option.value === position)?.label ??
    position
  );
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      dateStyle: 'medium',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function sortBanners(list: AdminBanner[]) {
  return [...list].sort((a, b) => {
    if (a.position !== b.position) {
      return a.position.localeCompare(b.position);
    }
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
}

function notifyCache(cacheInvalidated: boolean) {
  if (!cacheInvalidated) {
    toast.info(
      'تم الحفظ. إن لم يظهر التغيير فورًا على الموقع، تأكد من REVALIDATE_SECRET و WEB_APP_URL.',
    );
  }
}

export function BannersManager({ items, permissions }: BannersManagerProps) {
  const router = useRouter();
  const [rows, setRows] = useState(() => sortBanners(items));
  const [formOpen, setFormOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBanner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBanner | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setRows(sortBanners(items));
  }, [items]);

  const canCreate = hasPermission(permissions, 'banners.create');
  const canUpdate = hasPermission(permissions, 'banners.update');
  const canDelete = hasPermission(permissions, 'banners.delete');

  const activeCount = useMemo(
    () => rows.filter((banner) => banner.isActive).length,
    [rows],
  );
  const activeHeroCount = useMemo(
    () =>
      rows.filter(
        (banner) => banner.isActive && banner.position === 'HOME_HERO',
      ).length,
    [rows],
  );

  function refresh() {
    router.refresh();
  }

  function handleCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(banner: AdminBanner) {
    setEditing(banner);
    setFormOpen(true);
  }

  function toggleActive(banner: AdminBanner) {
    if (!canUpdate) return;
    const nextActive = !banner.isActive;

    setRows((current) =>
      current.map((row) =>
        row.id === banner.id ? { ...row, isActive: nextActive } : row,
      ),
    );

    startTransition(async () => {
      const result = await updateBannerAction(banner.id, {
        isActive: nextActive,
        position: banner.position,
      });
      if (!result.ok) {
        setRows((current) =>
          current.map((row) =>
            row.id === banner.id ? { ...row, isActive: banner.isActive } : row,
          ),
        );
        toast.error(result.error);
        return;
      }
      toast.success(nextActive ? 'تم تفعيل البنر' : 'تم إيقاف البنر');
      notifyCache(result.cacheInvalidated);
      refresh();
    });
  }

  function move(banner: AdminBanner, direction: -1 | 1) {
    if (!canUpdate) return;
    const samePosition = sortBanners(
      rows.filter((row) => row.position === banner.position),
    );
    const index = samePosition.findIndex((item) => item.id === banner.id);
    const swapWith = samePosition[index + direction];
    if (!swapWith) return;

    const previous = rows;
    const optimistic = rows.map((item) => {
      if (item.id === banner.id) {
        return { ...item, sortOrder: swapWith.sortOrder };
      }
      if (item.id === swapWith.id) {
        return { ...item, sortOrder: banner.sortOrder };
      }
      return item;
    });
    setRows(sortBanners(optimistic));

    const payload = samePosition.map((item) => {
      if (item.id === banner.id) {
        return { id: item.id, sortOrder: swapWith.sortOrder };
      }
      if (item.id === swapWith.id) {
        return { id: item.id, sortOrder: banner.sortOrder };
      }
      return { id: item.id, sortOrder: item.sortOrder };
    });

    startTransition(async () => {
      const result = await reorderBannersAction(payload, banner.position);
      if (!result.ok) {
        setRows(previous);
        toast.error(result.error);
        return;
      }
      toast.success('تم تحديث الترتيب.');
      notifyCache(result.cacheInvalidated);
      refresh();
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    const previous = rows;
    setRows((current) => current.filter((row) => row.id !== target.id));
    setDeleteTarget(null);

    startTransition(async () => {
      const result = await deleteBannerAction(target.id, target.position);
      if (!result.ok) {
        setRows(previous);
        toast.error(result.error);
        return;
      }
      toast.success('تم حذف البنر.');
      notifyCache(result.cacheInvalidated);
      refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">البنرات</h1>
          <p className="mt-1 text-sm text-ink-500">
            إدارة بنرات الصفحة الرئيسية وصفحة العقارات.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">
            {rows.length.toLocaleString('ar-EG')} بنر
          </Badge>
          <Badge variant="success">
            {activeCount.toLocaleString('ar-EG')} نشط
          </Badge>
          <Badge variant="default">
            Hero: {activeHeroCount.toLocaleString('ar-EG')}
          </Badge>
          <Button
            type="button"
            size="small"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
          >
            معاينة السلايدر
          </Button>
          {canCreate ? (
            <Button type="button" size="small" onClick={handleCreate}>
              إضافة بنر
            </Button>
          ) : null}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="لا توجد بنرات"
          description="أضف أول بنر ليظهر في الموقع العام."
          action={
            canCreate ? (
              <Button type="button" onClick={handleCreate}>
                إضافة بنر
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-50 text-ink-600">
              <tr>
                <th className="px-3 py-3 text-start font-semibold">الصورة</th>
                <th className="px-3 py-3 text-start font-semibold">العنوان</th>
                <th className="px-3 py-3 text-start font-semibold">الموضع</th>
                <th className="px-3 py-3 text-start font-semibold">الحالة</th>
                <th className="px-3 py-3 text-start font-semibold">الترتيب</th>
                <th className="px-3 py-3 text-start font-semibold">تاريخ الإنشاء</th>
                <th className="px-3 py-3 text-start font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((banner) => (
                <tr key={banner.id} className="border-t border-border">
                  <td className="px-3 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="h-12 w-20 rounded object-cover"
                    />
                  </td>
                  <td className="px-3 py-3 font-medium text-ink-900">
                    {banner.title}
                  </td>
                  <td className="px-3 py-3 text-ink-700">
                    {positionLabel(banner.position)}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={banner.isActive ? 'success' : 'default'}>
                      {banner.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <span className="min-w-6 text-ink-700">{banner.sortOrder}</span>
                      {canUpdate ? (
                        <>
                          <Button
                            type="button"
                            size="small"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => move(banner, -1)}
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            size="small"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => move(banner, 1)}
                          >
                            ↓
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-ink-600">
                    {formatDate(banner.createdAt)}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {canUpdate ? (
                        <>
                          <Button
                            type="button"
                            size="small"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => handleEdit(banner)}
                          >
                            تعديل
                          </Button>
                          <Button
                            type="button"
                            size="small"
                            variant="outline"
                            disabled={isPending}
                            onClick={() => toggleActive(banner)}
                          >
                            {banner.isActive ? 'إيقاف' : 'تفعيل'}
                          </Button>
                        </>
                      ) : null}
                      {canDelete ? (
                        <Button
                          type="button"
                          size="small"
                          variant="outline"
                          disabled={isPending}
                          onClick={() => setDeleteTarget(banner)}
                        >
                          حذف
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BannerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        permissions={permissions}
        banner={editing}
        onSuccess={refresh}
      />

      <BannerPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        banners={rows}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="حذف البنر"
        description="هل أنت متأكد من حذف هذا البنر؟ لا يمكن التراجع."
        confirmLabel="حذف"
        variant="danger"
        loading={isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
