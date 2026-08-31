export function formatDeveloperName(developer: {
  nameAr: string | null;
  nameEn: string;
}): string {
  return developer.nameAr ?? developer.nameEn;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}
