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

/** Display-only labels for known role codes; unknown codes render as-is. */
const ROLE_LABEL_FALLBACK: Record<string, string> = {
  USER: 'مستخدم',
  BROKER: 'وسيط',
  DEVELOPER: 'مطور',
  MODERATOR: 'مشرف',
  ADMIN: 'مدير',
  SUPER_ADMIN: 'مدير عام',
};

export function formatRoleLabel(code: string): string {
  return ROLE_LABEL_FALLBACK[code] ?? code;
}
