export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatBooleanFlag(value: boolean): string {
  return value ? 'نعم' : 'لا';
}

export function formatPriority(priority: number): string {
  return priority.toLocaleString('ar-EG');
}

export function formatCount(value: number): string {
  return value.toLocaleString('ar-EG');
}
