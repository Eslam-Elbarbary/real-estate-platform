import { Badge } from '@/components/ui/badge';
import { formatRoleLabel } from '../format';

/** Display-only fallbacks for well-known role codes. */
const ROLE_VARIANT_FALLBACK: Record<
  string,
  'default' | 'brand' | 'success' | 'warning' | 'danger'
> = {
  USER: 'default',
  BROKER: 'brand',
  DEVELOPER: 'brand',
  MODERATOR: 'warning',
  ADMIN: 'success',
  SUPER_ADMIN: 'danger',
};

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const variant = ROLE_VARIANT_FALLBACK[role] ?? 'default';
  return <Badge variant={variant}>{formatRoleLabel(role)}</Badge>;
}

interface UserRolesBadgesProps {
  roles: string[];
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
