'use client';

import { useState, useTransition, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImagePlus, X } from 'lucide-react';
import { getButtonClassName } from '@/components/ui/button';
import { saveMediaStepAction } from '../../actions';
import { DEMO_PROPERTY_IMAGES, listingCopy } from '../../config';
import type { ListingDraft, ListingImageDraft } from '../../types';

const MAX_BYTES = 30 * 1024 * 1024;
const ACCEPT = 'image/jpeg,image/png,image/webp';

interface MediaStepFormProps {
  draft: ListingDraft;
}

export function MediaStepForm({ draft }: MediaStepFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ListingImageDraft[]>(draft.media.images);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const img of draft.media.images) {
      map[img.id] = img.previewUrl;
    }
    return map;
  });
  const [videoUrl, setVideoUrl] = useState(draft.media.videoUrl ?? '');

  function onFilesSelected(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);
    const next = [...images];
    const nextPreviews = { ...previewUrls };

    Array.from(fileList).forEach((file) => {
      if (!ACCEPT.split(',').includes(file.type)) {
        setError('يُسمح فقط بصور JPEG أو PNG أو WebP');
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(listingCopy.maxSize);
        return;
      }
      const order = next.length;
      const id = `img-${Date.now()}-${order}`;
      const demoPath =
        DEMO_PROPERTY_IMAGES[order % DEMO_PROPERTY_IMAGES.length];
      const objectUrl = URL.createObjectURL(file);
      nextPreviews[id] = objectUrl;
      next.push({
        id,
        previewUrl: demoPath,
        name: file.name,
        size: file.size,
        order,
        isCover: order === 0,
      });
    });

    setImages(next);
    setPreviewUrls(nextPreviews);
  }

  function removeImage(id: string) {
    const url = previewUrls[id];
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
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
    if (images.length < 1) {
      setError('أضف صورة واحدةًا على الأقل');
      return;
    }
    startTransition(async () => {
      const result = await saveMediaStepAction(draft.id, {
        images,
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
          <span className="text-xs text-ink-500">{listingCopy.maxSize}</span>
          <input
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(e) => {
              onFilesSelected(e.target.files);
              e.target.value = '';
            }}
          />
        </label>

        {images.length > 0 ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((img) => (
              <li
                key={img.id}
                className="relative overflow-hidden rounded-lg border border-[#e5e5e5]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={previewUrls[img.id] ?? img.previewUrl}
                    alt=""
                    fill
                    unoptimized={Boolean(previewUrls[img.id]?.startsWith('blob:'))}
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                {img.isCover ? (
                  <span className="absolute start-2 top-2 rounded bg-ink-900/80 px-2 py-0.5 text-[10px] font-bold text-white">
                    غلاف
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute end-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow"
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
                  previewUrl: demoPath,
                  name: 'demo-cover.webp',
                  size: 120_000,
                  order: 0,
                  isCover: true,
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
        disabled={pending}
        className={getButtonClassName({
          className: 'h-12 min-w-[140px] rounded-lg px-8 text-base font-extrabold',
        })}
      >
        {listingCopy.continue}
      </button>
    </form>
  );
}
