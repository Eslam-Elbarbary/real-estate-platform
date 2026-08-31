export function formatUserName(user: {
  name: string | null;
  email: string;
}): string {
  return user.name ?? user.email;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatVerified(isVerified: boolean): string {
  return isVerified ? 'موثّق' : 'غير موثّق';
}
