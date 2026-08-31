export function formatCompoundName(compound: {
  nameAr: string | null;
  nameEn: string;
}): string {
  return compound.nameAr ?? compound.nameEn;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}
