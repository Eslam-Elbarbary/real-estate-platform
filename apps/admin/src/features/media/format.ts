export function formatMediaFileName(fileName: string | null): string {
  return fileName?.trim() || 'بدون اسم';
}

export function formatMediaFolder(folder: string | null): string {
  return folder?.trim() || 'غير محدد';
}

export function formatMediaSize(bytes: number | null): string {
  if (bytes === null || bytes <= 0) {
    return '—';
  }

  if (bytes < 1024) {
    return `${bytes.toLocaleString('ar-EG')} بايت`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toLocaleString('ar-EG', { maximumFractionDigits: 1 })} ك.ب`;
  }

  return `${(bytes / (1024 * 1024)).toLocaleString('ar-EG', { maximumFractionDigits: 2 })} م.ب`;
}

export function formatMediaDimensions(
  width: number | null,
  height: number | null,
): string {
  if (!width || !height) {
    return '—';
  }

  return `${width.toLocaleString('ar-EG')} × ${height.toLocaleString('ar-EG')}`;
}

export function formatMediaDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}
