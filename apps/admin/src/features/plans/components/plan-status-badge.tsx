import { Badge } from '@/components/ui/badge';
import type { PlanStatus } from '../types';

interface PlanStatusBadgeProps {
  status: PlanStatus;
}

export function PlanStatusBadge({ status }: PlanStatusBadgeProps) {
  if (status === 'ACTIVE') {
    return <Badge variant="success">نشط</Badge>;
  }

  return <Badge variant="default">غير نشط</Badge>;
}
