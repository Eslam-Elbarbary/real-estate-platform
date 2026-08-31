import type { AdminLeadUser, LeadStatus, LeadType } from './types';

export function formatDate(iso: string | null): string {
  if (!iso) {
    return '—';
  }

  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatUserName(user: AdminLeadUser): string {
  return user.name ?? user.email;
}

export function formatLeadStatus(status: LeadStatus): string {
  switch (status) {
    case 'NEW':
      return 'جديد';
    case 'CONTACTED':
      return 'تم التواصل';
    case 'FOLLOW_UP':
      return 'متابعة';
    case 'INTERESTED':
      return 'مهتم';
    case 'CLOSED':
      return 'مغلق';
    case 'REJECTED':
      return 'مرفوض';
    default:
      return status;
  }
}

export function formatLeadType(type: LeadType): string {
  switch (type) {
    case 'PHONE':
      return 'هاتف';
    case 'WHATSAPP':
      return 'واتساب';
    case 'CONTACT_FORM':
      return 'نموذج تواصل';
    default:
      return type;
  }
}
