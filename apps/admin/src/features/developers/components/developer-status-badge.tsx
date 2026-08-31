import { Badge } from '@/components/ui/badge';

interface DeveloperStatusBadgeProps {
  isActive: boolean;
}

export function DeveloperStatusBadge({ isActive }: DeveloperStatusBadgeProps) {
  if (isActive) {
    return <Badge variant="success">نشط</Badge>;
  }

  return <Badge variant="default">غير نشط</Badge>;
}
