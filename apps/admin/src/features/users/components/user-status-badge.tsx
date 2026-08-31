import { Badge } from '@/components/ui/badge';

interface UserStatusBadgeProps {
  isActive: boolean;
}

export function UserStatusBadge({ isActive }: UserStatusBadgeProps) {
  if (isActive) {
    return <Badge variant="success">نشط</Badge>;
  }

  return <Badge variant="default">غير نشط</Badge>;
}
