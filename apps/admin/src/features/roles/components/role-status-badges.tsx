import { Badge } from '@/components/ui/badge';
import type { AdminRole } from '../types';

interface RoleStatusBadgesProps {
  role: Pick<AdminRole, 'isAdmin' | 'isSuperAdmin' | 'isSystem'>;
}

export function RoleStatusBadges({ role }: RoleStatusBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {role.isAdmin ? <Badge variant="success">مدير</Badge> : null}
      {role.isSuperAdmin ? <Badge variant="danger">مدير عام</Badge> : null}
      {role.isSystem ? <Badge variant="warning">نظام</Badge> : null}
      {!role.isAdmin && !role.isSuperAdmin && !role.isSystem ? (
        <span className="text-sm text-ink-500">—</span>
      ) : null}
    </div>
  );
}

interface RoleFlagBadgeProps {
  active: boolean;
  label: string;
  variant?: 'default' | 'brand' | 'success' | 'warning' | 'danger';
}

export function RoleFlagBadge({
  active,
  label,
  variant = 'default',
}: RoleFlagBadgeProps) {
  if (!active) {
    return <span className="text-sm text-ink-400">—</span>;
  }

  return <Badge variant={variant}>{label}</Badge>;
}
