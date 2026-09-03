'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Pagination } from '@/components/data';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { hasPermission } from '@/features/auth/permissions';
import { listMediaAction } from '@/features/media/actions';
import { MediaUploadDialog } from '@/features/media/components/media-upload-dialog';
import { MEDIA_FOLDER_OPTIONS } from '@/features/media/types';
import { normalizeMediaAsset } from '@/features/media/normalize';
import type { MediaAsset } from '@/features/media/types';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import type { MediaPickerDialogProps } from './types';
import { MediaPickerGrid } from './media-picker-grid';

export function MediaPickerDialog({
  open,
  onOpenChange,
  value,
  onConfirm,
  multiple,
  maxItems,
  folder: defaultFolder,
  permissions,
}: MediaPickerDialogProps) {
  const canUpload = hasPermission(permissions, 'media.upload');

  const [items, setItems] = useState<MediaAsset[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState(defaultFolder ?? '');
  const [pendingIds, setPendingIds] = useState<Set<string>>(
    () => new Set(value.map((asset) => asset.id)),
  );
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadMedia = useCallback(async () => {
    setLoading(true);

    const result = await listMediaAction({
      page,
      limit: 20,
      search: search.trim() || undefined,
      folder: folder.trim() || undefined,
    });

    if (result.ok) {
      setItems(result.data.items.map(normalizeMediaAsset));
      setTotalPages(result.data.meta.totalPages);
      setLoading(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setLoading(false);
  }, [folder, page, search]);

  useEffect(() => {
    if (open) {
      setPendingIds(new Set(value.map((asset) => asset.id)));
    } else {
      setSearch('');
      setFolder(defaultFolder ?? '');
      setPage(1);
    }
  }, [open, value, defaultFolder]);

  useEffect(() => {
    if (!open) {
      return;
    }

    void loadMedia();
  }, [open, loadMedia]);

  function handleToggle(asset: MediaAsset) {
    if (!multiple) {
      onConfirm([asset]);
      closePicker();
      return;
    }

    setPendingIds((current) => {
      const next = new Set(current);
      if (next.has(asset.id)) {
        next.delete(asset.id);
        return next;
      }

      if (maxItems !== undefined && next.size >= maxItems) {
        toast.error(`يمكنك اختيار ${maxItems.toLocaleString('ar-EG')} صورة كحد أقصى.`);
        return next;
      }

      next.add(asset.id);
      return next;
    });
  }

  function handleConfirmMultiple(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const selectedMap = new Map<string, MediaAsset>();

    for (const asset of value) {
      if (pendingIds.has(asset.id)) {
        selectedMap.set(asset.id, asset);
      }
    }

    for (const asset of items) {
      if (pendingIds.has(asset.id)) {
        selectedMap.set(asset.id, asset);
      }
    }

    onConfirm(Array.from(selectedMap.values()));
    closePicker(event);
  }

  async function handleUploadSuccess(uploaded?: MediaAsset[]) {
    await loadMedia();

    if (!uploaded?.length) {
      return;
    }

    if (!multiple) {
      onConfirm([uploaded[0]!]);
      closePicker();
      setUploadOpen(false);
      return;
    }

    setPendingIds((current) => {
      const next = new Set(current);
      for (const asset of uploaded) {
        if (maxItems !== undefined && next.size >= maxItems) {
          break;
        }
        next.add(asset.id);
      }
      return next;
    });

    setUploadOpen(false);
  }

  function closePicker(event?: React.SyntheticEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    onOpenChange(false);
  }

  function handlePickerOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      closePicker();
      return;
    }
    onOpenChange(true);
  }

  const dialogTree = (
    <>
      <Dialog
        open={open}
        onOpenChange={handlePickerOpenChange}
        title="اختيار من مكتبة الوسائط"
        description="ابحث واختر الصور المناسبة للنموذج"
        className="w-[min(100%-2rem,52rem)]"
        footer={
          multiple ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={closePicker}
              >
                إلغاء
              </Button>
              <Button
                type="button"
                size="small"
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleConfirmMultiple}
              >
                تأكيد الاختيار
              </Button>
            </>
          ) : undefined
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[12rem] flex-1">
              <Input
                name="picker-search"
                label="بحث"
                placeholder="ابحث باسم الملف..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="min-w-[10rem] flex-1">
              <Select
                name="picker-folder"
                label="المجلد"
                value={folder}
                onChange={(event) => {
                  setFolder(event.target.value);
                  setPage(1);
                }}
                options={[
                  { value: '', label: 'الكل' },
                  ...MEDIA_FOLDER_OPTIONS.map((option) => ({
                    value: option.value,
                    label: option.label,
                  })),
                ]}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="small"
              onClick={() => {
                void loadMedia();
              }}
            >
              تطبيق
            </Button>
            {canUpload ? (
              <Button
                type="button"
                size="small"
                onClick={() => setUploadOpen(true)}
              >
                رفع ملفات جديدة
              </Button>
            ) : null}
          </div>

          <MediaPickerGrid
            items={items}
            selectedIds={pendingIds}
            onToggle={handleToggle}
            loading={loading}
          />

          {totalPages > 1 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      </Dialog>

      {canUpload ? (
        <MediaUploadDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          defaultFolder={defaultFolder ?? 'aqarmap/library'}
          onSuccess={handleUploadSuccess}
        />
      ) : null}
    </>
  );

  if (!mounted) {
    return null;
  }

  return createPortal(dialogTree, document.body);
}
