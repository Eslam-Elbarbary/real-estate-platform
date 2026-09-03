import type { MediaAsset } from './types';

type RawMediaAsset = Partial<MediaAsset> & {
  previewUrl?: string | null;
  name?: string | null;
};

/** Single source of truth — API returns `url`; legacy/demo data may use `previewUrl`. */
export function normalizeMediaAsset(raw: RawMediaAsset): MediaAsset {
  const url = (raw.url ?? raw.previewUrl ?? '').trim();
  const fileName = raw.fileName ?? raw.name ?? null;

  return {
    id: raw.id ?? '',
    url,
    fileName,
    mimeType: raw.mimeType ?? null,
    size: raw.size ?? null,
    width: raw.width ?? null,
    height: raw.height ?? null,
    folder: raw.folder ?? null,
    createdAt: raw.createdAt ?? new Date(0).toISOString(),
    uploadedBy: raw.uploadedBy ?? null,
  };
}

export function getMediaImageUrl(asset: Pick<MediaAsset, 'url'> | RawMediaAsset): string {
  return normalizeMediaAsset(asset).url;
}

export function isValidMediaAsset(asset: RawMediaAsset): asset is MediaAsset {
  const normalized = normalizeMediaAsset(asset);
  return Boolean(normalized.id && normalized.url);
}
