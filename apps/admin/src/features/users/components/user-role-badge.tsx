import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types';

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; variant: 'default' | 'brand' | 'success' | 'warning' | 'danger' }
> = {
  USER: { label: 'مستخدم', variant: 'default' },
  BROKER: { label: 'وسيط', variant: 'brand' },
  DEVELOPER: { label: 'مطور', variant: 'brand' },
  MODERATOR: { label: 'مشرف', variant: 'warning' },
  ADMIN: { label: 'مدير', variant: 'success' },
  SUPER_ADMIN: { label: 'مدير عام', variant: 'danger' },
};

interface UserRoleBadgeProps {
  role: UserRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const config = ROLE_CONFIG[role];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

interface UserRolesBadgesProps {
  roles: UserRole[];
}

export function UserRolesBadges({ roles }: UserRolesBadgesProps) {
  if (roles.length === 0) {
    return <span className="text-sm text-ink-500">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) => (
        <UserRoleBadge key={role} role={role} />
      ))}
    </div>
  );
}
