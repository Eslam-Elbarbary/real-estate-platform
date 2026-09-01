export function formatCompoundName(compound: {
  nameAr: string | null;
  nameEn: string;
}): string {
  return compound.nameAr ?? compound.nameEn;
}

export function formatNamedRef(ref: {
  nameAr: string | null;
  nameEn: string;
} | null | undefined): string {
  if (!ref) {
    return '—';
  }
  return ref.nameAr ?? ref.nameEn;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

/** Best-effort Cloudinary public_id from a delivery URL. */
export function extractCloudinaryPublicId(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    const marker = '/upload/';
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) {
      return undefined;
    }

    const afterUpload = parsed.pathname.slice(index + marker.length);
    const withoutVersion = afterUpload.replace(/^v\d+\//, '');
    const withoutExtension = withoutVersion.replace(/\.[a-zA-Z0-9]+$/, '');
    const publicId = decodeURIComponent(withoutExtension).replace(/^\/+|\/+$/g, '');
    return publicId || undefined;
  } catch {
    return undefined;
  }
}

export function buildAreaLabelMap(
  areas: Array<{ id: string; nameAr: string | null; nameEn: string }>,
): Map<string, string> {
  return new Map(
    areas.map((area) => [area.id, area.nameAr ?? area.nameEn]),
  );
}
