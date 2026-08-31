import { Badge } from '@/components/ui/badge';
import type { LeadStatus } from '../types';

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'brand' | 'default' }
> = {
  NEW: { label: 'جديد', variant: 'brand' },
  CONTACTED: { label: 'تم التواصل', variant: 'warning' },
  FOLLOW_UP: { label: 'متابعة', variant: 'warning' },
  INTERESTED: { label: 'مهتم', variant: 'success' },
  CLOSED: { label: 'مغلق', variant: 'default' },
  REJECTED: { label: 'مرفوض', variant: 'danger' },
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
