'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { uploadMediaAction } from '../actions';
import {
  MEDIA_FOLDER_OPTIONS,
  MEDIA_IMAGE_MIME_TYPES,
  MEDIA_MAX_FILE_BYTES,
} from '../types';

interface SelectedFile {
  id: string;
  file: File;
  previewUrl: string;
}

import type { MediaAsset } from '../types';

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultFolder?: string;
  onSuccess?: (uploaded?: MediaAsset[]) => void | Promise<void>;
}

function validateFile(file: File): string | null {
  if (!MEDIA_IMAGE_MIME_TYPES.has(file.type)) {
    return 'نوع الملف غير مدعوم. المسموح: JPEG و PNG و WebP.';
  }

  if (file.size > MEDIA_MAX_FILE_BYTES) {
    return 'حجم الملف يجب ألا يتجاوز 5 م.ب.';
  }

  return null;
}

export function MediaUploadDialog({
  open,
  onOpenChange,
  defaultFolder = 'aqarmap/library',
  onSuccess,
}: MediaUploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [folder, setFolder] = useState(defaultFolder);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setSelectedFiles((current) => {
      for (const item of current) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return [];
    });
    setFolder(defaultFolder);
    setDragActive(false);
    setError(null);
  }, [defaultFolder]);

  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }

    setFolder(defaultFolder);
  }, [open, defaultFolder, resetState]);

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);
    const nextError = incoming.map(validateFile).find(Boolean) ?? null;

    if (nextError) {
      setError(nextError);
      return;
    }

    setError(null);
    setSelectedFiles((current) => [
      ...current,
      ...incoming.map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }

  function removeFile(id: string) {
    setSelectedFiles((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  }

  async function handleUpload() {
    if (!selectedFiles.length || uploading) {
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    for (const item of selectedFiles) {
      formData.append('files', item.file, item.file.name);
    }
    formData.append('folder', folder);

    const result = await uploadMediaAction(formData);

    if (result.ok) {
      toast.success('تم رفع الملفات بنجاح');
      onOpenChange(false);
      await onSuccess?.(result.data);
      setUploading(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setError(result.error);
    setUploading(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!uploading) {
          onOpenChange(nextOpen);
        }
      }}
      title="رفع ملفات"
      description="اسحب الصور أو اخترها من جهازك. المسموح: JPEG و PNG و WebP حتى 5 م.ب."
      className="w-[min(100%-2rem,36rem)]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={uploading}
            onClick={() => onOpenChange(false)}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            size="small"
            disabled={uploading || selectedFiles.length === 0}
            onClick={() => {
              void handleUpload();
            }}
          >
            {uploading ? 'جاري الرفع…' : 'رفع الملفات'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          name="folder"
          label="المجلد"
          value={folder}
          onChange={(event) => setFolder(event.target.value)}
          options={MEDIA_FOLDER_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />

        <div
          className={[
            'rounded-xl border border-dashed px-4 py-8 text-center transition-colors',
            dragActive
              ? 'border-accent-500 bg-accent-50/50'
              : 'border-border bg-surface-50',
          ].join(' ')}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragActive(false);
            if (event.dataTransfer.files.length > 0) {
              addFiles(event.dataTransfer.files);
            }
          }}
        >
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-white ring-1 ring-border">
            <Upload className="size-5 text-ink-500" aria-hidden />
          </div>
          <p className="text-sm font-medium text-ink-900">اسحب الصور هنا</p>
          <p className="mt-1 text-xs text-ink-500">أو اختر ملفات متعددة من جهازك</p>
          <Button
            type="button"
            variant="outline"
            size="small"
            className="mt-4"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            اختيار الملفات
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(event) => {
              if (event.target.files?.length) {
                addFiles(event.target.files);
                event.target.value = '';
              }
            }}
          />
        </div>

        {selectedFiles.length > 0 ? (
          <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
            {selectedFiles.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg border border-border bg-surface-50"
              >
                <div className="relative aspect-square">
                  <Image
                    src={item.previewUrl}
                    alt={item.file.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  className="absolute end-1 top-1 rounded-full bg-white/90 p-1 text-ink-700 shadow-sm"
                  aria-label={`إزالة ${item.file.name}`}
                  onClick={() => removeFile(item.id)}
                >
                  <X className="size-3.5" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {error ? <p className="text-sm text-danger-600">{error}</p> : null}
      </div>
    </Dialog>
  );
}
