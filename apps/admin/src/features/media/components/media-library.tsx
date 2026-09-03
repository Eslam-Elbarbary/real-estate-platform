'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/layout/page-header';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import type { UserRole } from '@/types';
import { deleteMediaAction } from '../actions';
import type { MediaAsset, MediaListResult } from '../types';
import { MediaGrid } from './media-grid';
import { MediaPreviewDialog } from './media-preview-dialog';
import { MediaToolbar } from './media-toolbar';
import { MediaUploadDialog } from './media-upload-dialog';

interface MediaLibraryProps {
  result: MediaListResult;
  permissions: string[];
  filters: {
    page: number;
    limit: number;
    search: string;
    folder: string;
  };
}

export function MediaLibrary({ result, permissions, filters }: MediaLibraryProps) {
  const router = useRouter();
  const { items, meta } = result;

  const canUpload = hasPermission(permissions, 'media.upload');
  const canDelete = hasPermission(permissions, 'media.delete');

  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleRefresh() {
    await router.refresh();
  }

  function handlePreview(asset: MediaAsset) {
    setPreviewAsset(asset);
    setPreviewOpen(true);
  }

  function handleDeleteRequest(asset: MediaAsset) {
    setDeleteTarget(asset);
    setDeleteOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);
    const result = await deleteMediaAction(deleteTarget.id);

    if (result.ok) {
      toast.success('تم حذف الصورة بنجاح');
      setDeleteOpen(false);
      setDeleteTarget(null);
      await handleRefresh();
      setDeleting(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setDeleting(false);
  }

  return (
    <div>
      <PageHeader
        title="الوسائط"
        description="إدارة جميع الصور والملفات المستخدمة داخل المنصة"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">
              {meta.total.toLocaleString('ar-EG')} ملف
            </Badge>
            {canUpload ? (
              <Button type="button" size="small" onClick={() => setUploadOpen(true)}>
                رفع ملفات
              </Button>
            ) : null}
          </div>
        }
      />

      <MediaToolbar
        search={filters.search}
        folder={filters.folder}
        limit={filters.limit}
      />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">مكتبة الوسائط</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <MediaGrid
            items={items}
            canDelete={canDelete}
            onPreview={handlePreview}
            onDelete={handleDeleteRequest}
          />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>

      {canUpload ? (
        <MediaUploadDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          onSuccess={handleRefresh}
        />
      ) : null}

      <MediaPreviewDialog
        asset={previewAsset}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      {canDelete ? (
        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={(open) => {
            if (!deleting) {
              setDeleteOpen(open);
            }
          }}
          title="حذف الصورة"
          description="هل أنت متأكد من حذف هذه الصورة؟"
          confirmLabel="حذف"
          variant="danger"
          loading={deleting}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  );
}
