'use client';

import { useState, useTransition, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { uploadPropertyImageAction } from '@/features/media/actions';
import { saveMediaStepAction } from '../../actions';
import { DEMO_PROPERTY_IMAGES, listingCopy } from '../../config';
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

export function MediaStepForm({ draft }: MediaStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<LocalImageEntry[]>(
    draft.media.images.map(toLocalEntry),
  );
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const img of draft.media.images) {
      map[img.id] = img.url;
    }
    return map;
  });
  const [videoUrl, setVideoUrl] = useState(draft.media.videoUrl ?? '');

  const uploadingCount = images.filter((img) => img.uploadStatus === 'uploading').length;

  async function uploadFile(file: File, order: number, isCover: boolean) {
    const tempId = `img-${Date.now()}-${order}`;
    const objectUrl = URL.createObjectURL(file);

    setPreviewUrls((prev) => ({ ...prev, [tempId]: objectUrl }));
    setImages((prev) => [
      ...prev,
      {
        id: tempId,
        url: '',
        name: file.name,
        size: file.size,
        order,
        isCover,
        uploadStatus: 'uploading',
      },
    ]);

    const formData = new FormData();
    formData.append('file', file);
    const result = await uploadPropertyImageAction(formData);

    if (!result.ok) {
      URL.revokeObjectURL(objectUrl);
      setPreviewUrls((prev) => {
        const copy = { ...prev };
        delete copy[tempId];
        return copy;
      });
      setImages((prev) => prev.filter((img) => img.id !== tempId));
      setError(result.error);
      return;
    }

    URL.revokeObjectURL(objectUrl);
    setPreviewUrls((prev) => ({ ...prev, [tempId]: result.data.url }));
    setImages((prev) =>
      prev.map((img) =>
        img.id === tempId
          ? {
              id: result.data.id,
              url: result.data.url,
              name: result.data.name,
              size: result.data.size,
              order: img.order,
              isCover: img.isCover,
              uploadStatus: 'uploaded',
            }
          : img,
      ),
    );
  }

  function onFilesSelected(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);

    const files = Array.from(fileList);
    const startOrder = images.filter((img) => img.uploadStatus !== 'failed').length;
    const shouldSetCover = startOrder === 0;

    void (async () => {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]!;
        if (!ACCEPT.split(',').includes(file.type)) {
          setError('يُسمح فقط بصور JPEG أو PNG أو WebP');
          return;
        }
        if (file.size > MAX_BYTES) {
          setError('حجم الملف كبير جدًا. الحد الأقصى 5 ميجابايت.');
          return;
        }

        await uploadFile(file, startOrder + index, shouldSetCover && index === 0);
      }
    })();
  }

  function removeImage(id: string) {
    const url = previewUrls[id];
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }

    const filtered = images
      .filter((img) => img.id !== id)
      .map((img, index) => ({
        ...img,
        order: index,
        isCover: index === 0,
      }));

    setImages(filtered);
    setPreviewUrls((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
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
      setError('أضف صورة واحدةًا على الأقل');
      return;
    }

    startTransition(async () => {
      const result = await saveMediaStepAction(draft.id, {
        images: uploadedImages,
        videoUrl,
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
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  disabled={img.uploadStatus === 'uploading'}
                  className="absolute end-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow disabled:opacity-50"
                  aria-label="حذف الصورة"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <button
            type="button"
            data-testid="demo-add-image"
            className="mt-3 text-sm font-bold text-brand-700 underline"
            onClick={() => {
              const demoPath = DEMO_PROPERTY_IMAGES[0];
              const id = `img-demo-${Date.now()}`;
              setImages([
                {
                  id,
                  url: demoPath,
                  name: 'demo-cover.webp',
                  size: 120_000,
                  order: 0,
                  isCover: true,
                  uploadStatus: 'uploaded',
                },
              ]);
              setPreviewUrls({ [id]: demoPath });
            }}
          >
            إضافة صورة تجريبية
          </button>
        )}
      </div>

      <div>
        <label
          htmlFor="video-url"
          className="mb-1.5 block text-sm font-semibold text-ink-800"
        >
          {listingCopy.videoUrl}
        </label>
        <input
          id="video-url"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder={listingCopy.videoPlaceholder}
          className="h-12 w-full rounded-lg border border-[#d9d9d9] bg-white px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          dir="ltr"
        />
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
