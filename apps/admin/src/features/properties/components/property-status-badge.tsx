import { Badge } from '@/components/ui/badge';
import type { PropertyStatus } from '@/types';

export const PROPERTY_STATUS_CONFIG: Record<
  PropertyStatus,
  { label: string; variant: 'default' | 'brand' | 'success' | 'warning' | 'danger' }
> = {
  DRAFT: { label: 'مسودة', variant: 'default' },
  PENDING_PAYMENT: { label: 'بانتظار الدفع', variant: 'warning' },
  PENDING_REVIEW: { label: 'بانتظار المراجعة', variant: 'warning' },
  PUBLISHED: { label: 'منشور', variant: 'success' },
  REJECTED: { label: 'مرفوض', variant: 'danger' },
  ARCHIVED: { label: 'مؤرشف', variant: 'default' },
  EXPIRED: { label: 'منتهي', variant: 'danger' },
};

interface PropertyStatusBadgeProps {
  status: PropertyStatus;
}

export function PropertyStatusBadge({ status }: PropertyStatusBadgeProps) {
  const config = PROPERTY_STATUS_CONFIG[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
