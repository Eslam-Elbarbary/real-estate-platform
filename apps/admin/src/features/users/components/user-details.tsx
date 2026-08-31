import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { routes } from '@/config/routes';
import { formatDate, formatUserName, formatVerified } from '../format';
import type { AdminUserDetails } from '../types';
import type { UserRole } from '@/types';
import { UserActions } from './user-actions';
import { UserRolesBadges } from './user-role-badge';
import { UserStatusBadge } from './user-status-badge';

interface UserDetailsProps {
  user: AdminUserDetails;
  roles: UserRole[];
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-medium text-ink-900 sm:max-w-[70%] sm:text-end">
        {value}
      </span>
    </div>
  );
}

export function UserDetails({ user, roles }: UserDetailsProps) {
  const displayName = formatUserName(user);

  return (
    <div>
      <PageHeader
        title={displayName}
        description={user.email}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <UserStatusBadge isActive={user.isActive} />
            <Link href={routes.users.root}>
              <Button variant="outline" size="small">
                العودة للقائمة
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mb-6">
        <UserActions
          userId={user.id}
          isActive={user.isActive}
          userName={displayName}
          roles={roles}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">معلومات الحساب</h2>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-3">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="size-16 rounded-md border border-border object-cover"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-md border border-border bg-surface-100 text-lg font-semibold text-ink-600">
                  {displayName.slice(0, 1)}
                </div>
              )}
              <div>
                <p className="font-medium text-ink-900">{displayName}</p>
                <p className="text-sm text-ink-600" dir="ltr">
                  {user.email}
                </p>
              </div>
            </div>
            <InfoRow label="الهاتف" value={user.phone ?? '—'} />
            <InfoRow label="تاريخ الإنشاء" value={formatDate(user.createdAt)} />
            <InfoRow label="آخر تحديث" value={formatDate(user.updatedAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-ink-900">الحالة والأدوار</h2>
          </CardHeader>
          <CardContent>
            <InfoRow
              label="الحالة"
              value={user.isActive ? 'نشط' : 'غير نشط'}
            />
            <div className="flex flex-col gap-1 border-b border-border py-3 sm:flex-row sm:items-start sm:justify-between">
              <span className="text-sm text-ink-500">التحقق من البريد</span>
              <Badge variant={user.isEmailVerified ? 'success' : 'default'}>
                {formatVerified(user.isEmailVerified)}
              </Badge>
            </div>
            <div className="flex flex-col gap-2 pt-3">
              <span className="text-sm text-ink-500">الأدوار</span>
              <UserRolesBadges roles={user.roles} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
