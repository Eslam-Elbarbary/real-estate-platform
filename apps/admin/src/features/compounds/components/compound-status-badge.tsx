import { Badge } from '@/components/ui/badge';

interface CompoundStatusBadgeProps {
  isActive: boolean;
}

export function CompoundStatusBadge({ isActive }: CompoundStatusBadgeProps) {
  if (isActive) {
    return <Badge variant="success">نشط</Badge>;
  }

  return <Badge variant="default">غير نشط</Badge>;
}
