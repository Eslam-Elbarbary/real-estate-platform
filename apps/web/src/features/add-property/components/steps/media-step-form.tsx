'use client';

import { useState, useTransition, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import {
  deleteListingMediaAction,
  saveMediaStepAction,
  setPrimaryListingMediaAction,
  uploadListingMediaAction,
} from '../../actions';
import { listingCopy } from '../../config';
import type { ListingDraft, ListingImageDraft } from '../../types';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp';

interface MediaStepFormProps {
  draft: ListingDraft;
}

type LocalImageEntry = ListingImageDraft & {
  uploadStatus: 'uploaded' | 'uploading' | 'failed';
};

function toLocalEntry(image: ListingImageDraft): LocalImageEntry {
  return { ...image, uploadStatus: 'uploaded' };
}

function applyServerImages(
  images: ListingImageDraft[],
): { entries: LocalImageEntry[]; previews: Record<string, string> } {
  const entries = images.map(toLocalEntry);
  const previews: Record<string, string> = {};
  for (const img of images) {
    previews[img.id] = img.url;
  }
  return { entries, previews };
}

export function MediaStepForm({ draft }: MediaStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const initial = applyServerImages(draft.media.images);
  const [images, setImages] = useState<LocalImageEntry[]>(initial.entries);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>(
    initial.previews,
  );

  const uploadingCount = images.filter((img) => img.uploadStatus === 'uploading').length;

  function syncFromServer(next: ListingImageDraft[]) {
    const applied = applyServerImages(next);
    setImages(applied.entries);
    setPreviewUrls(applied.previews);
  }

  async function uploadFile(file: File) {
    const tempId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const objectUrl = URL.createObjectURL(file);

    setPreviewUrls((prev) => ({ ...prev, [tempId]: objectUrl }));
    setImages((prev) => [
      ...prev,
      {
        id: tempId,
        url: '',
        name: file.name,
        size: file.size,
        order: prev.length,
        isCover: false,
        uploadStatus: 'uploading',
      },
    ]);

    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadListingMediaAction(draft.id, formData);

    URL.revokeObjectURL(objectUrl);

    if (!result.ok) {
      setImages((prev) => prev.filter((img) => img.id !== tempId));
      setPreviewUrls((prev) => {
        const copy = { ...prev };
        delete copy[tempId];
        return copy;
      });
      setError(result.error);
      return;
    }

    syncFromServer(result.data.images);
  }

  function onFilesSelected(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);

    const files = Array.from(fileList);

    void (async () => {
      for (const file of files) {
        if (!ACCEPT.split(',').includes(file.type)) {
          setError('يُسمح فقط بصور JPEG أو PNG أو WebP');
          return;
        }
        if (file.size > MAX_BYTES) {
          setError('حجم الملف كبير جدًا. الحد الأقصى 5 ميجابايت.');
          return;
        }
        await uploadFile(file);
      }
    })();
  }

  function removeImage(id: string) {
    if (id.startsWith('img-')) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteListingMediaAction(draft.id, id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      syncFromServer(result.data.images);
    });
  }

  function setAsCover(id: string) {
    if (id.startsWith('img-')) return;
    setError(null);
    startTransition(async () => {
      const result = await setPrimaryListingMediaAction(draft.id, id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      syncFromServer(result.data.images);
    });
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const uploadedImages = images
      .filter((img) => img.uploadStatus === 'uploaded' && img.url)
      .map(({ uploadStatus: _status, ...img }) => img);

    if (uploadingCount > 0) {
      setError('انتظر حتى اكتمال رفع الصور.');
      return;
    }

    if (uploadedImages.length < 1) {
      setError('أضف صورة واحدةً على الأقل');
      return;
    }

    startTransition(async () => {
      const result = await saveMediaStepAction(draft.id, {
        images: uploadedImages,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(result.data.href);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-semibold text-ink-800">
          {listingCopy.photos}
        </p>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#c9c9c9] bg-surface-50 px-4 py-10 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/30">
          <ImagePlus className="size-8 text-brand-600" aria-hidden />
          <span className="text-sm font-bold text-ink-800">
            {listingCopy.addPhotos}
          </span>
          <span className="text-xs text-ink-500">الحد الأقصى 5 ميجابايت لكل صورة</span>
          <input
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            disabled={pending || uploadingCount > 0}
            onChange={(e) => {
              onFilesSelected(e.target.files);
              e.target.value = '';
            }}
          />
        </label>

        {uploadingCount > 0 ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-600">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            جاري رفع {uploadingCount} {uploadingCount === 1 ? 'صورة' : 'صور'}...
          </p>
        ) : null}

        {images.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <li
                key={img.id}
                className="relative overflow-hidden rounded-lg border border-[#e5e5e5]"
              >
                <div className="relative aspect-[4/3]">
                  {previewUrls[img.id] ? (
                    <Image
                      src={previewUrls[img.id]}
                      alt=""
                      fill
                      unoptimized={previewUrls[img.id]?.startsWith('blob:')}
                      className="object-cover"
                      sizes="200px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-surface-100">
                      <Loader2 className="size-6 animate-spin text-brand-600" aria-hidden />
                    </div>
                  )}
                </div>
                {img.uploadStatus === 'uploading' ? (
                  <span className="absolute inset-x-2 bottom-2 rounded bg-ink-900/80 px-2 py-0.5 text-center text-[10px] font-bold text-white">
                    جاري الرفع...
                  </span>
                ) : null}
                {img.isCover && img.uploadStatus === 'uploaded' ? (
                  <span className="absolute start-2 top-2 rounded bg-ink-900/80 px-2 py-0.5 text-[10px] font-bold text-white">
                    غلاف
                  </span>
                ) : null}
                {!img.isCover && img.uploadStatus === 'uploaded' ? (
                  <button
                    type="button"
                    onClick={() => setAsCover(img.id)}
                    disabled={pending}
                    className="absolute start-2 top-2 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-ink-700 shadow disabled:opacity-50"
                  >
                    تعيين غلاف
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  disabled={img.uploadStatus === 'uploading' || pending}
                  className="absolute end-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow disabled:opacity-50"
                  aria-label="حذف الصورة"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="rounded-lg border border-[#e5e5e5] bg-surface-50 px-4 py-3">
        <p className="text-sm font-semibold text-ink-800">{listingCopy.videoUrl}</p>
        <p className="mt-1 text-xs text-ink-500">
          رفع أو ربط الفيديو غير متاح في هذه المرحلة. سيتم دعمه لاحقًا عندما يوفر
          الخادم واجهة إرفاق فيديو للإعلان.
        </p>
      </div>

      {error ? (
        <p className="text-sm font-semibold text-danger-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || uploadingCount > 0}
        className={getButtonClassName({
          className: 'h-12 min-w-[140px] rounded-lg px-8 text-base font-extrabold',
        })}
      >
        {listingCopy.continue}
      </button>
    </form>
  );
}
