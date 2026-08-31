import { Badge } from '@/components/ui/badge';
import type { PaymentStatus } from '../types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; variant: 'success' | 'warning' | 'danger' | 'brand' | 'default' }
> = {
  SUCCESS: { label: 'نجاح', variant: 'success' },
  PENDING: { label: 'قيد الانتظار', variant: 'warning' },
  FAILED: { label: 'فشل', variant: 'danger' },
  REFUNDED: { label: 'مسترجع', variant: 'brand' },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
