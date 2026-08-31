'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { routes } from '@/config/routes';
import { updateUserStatusAction } from '../actions';
import { formatDate, formatUserName, formatVerified } from '../format';
import type { AdminUser } from '../types';
import { UserRolesBadges } from './user-role-badge';
import { UserStatusBadge } from './user-status-badge';

interface UsersTableProps {
  items: AdminUser[];
}

function UserStatusToggle({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const nextIsActive = !user.isActive;
  const displayName = formatUserName(user);

  async function handleConfirm() {
    setLoading(true);
    const result = await updateUserStatusAction(user.id, nextIsActive);
    if (result.ok) {
      setConfirmOpen(false);
      await router.refresh();
    }
    setLoading(false);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="small"
        disabled={loading}
        onClick={() => setConfirmOpen(true)}
      >
        {user.isActive ? 'تعطيل' : 'تفعيل'}
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!loading) {
            setConfirmOpen(open);
          }
        }}
        title={user.isActive ? 'تعطيل المستخدم' : 'تفعيل المستخدم'}
        description={
          user.isActive
            ? `هل تريد تعطيل حساب "${displayName}"؟`
            : `هل تريد تفعيل حساب "${displayName}"؟`
        }
        confirmLabel={user.isActive ? 'تعطيل' : 'تفعيل'}
        variant={user.isActive ? 'danger' : 'primary'}
        loading={loading}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export function UsersTable({ items }: UsersTableProps) {
  const columns = useMemo<DataTableColumn<AdminUser>[]>(
    () => [
      {
        key: 'avatar',
        label: 'الصورة',
        render: (user) =>
          user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={formatUserName(user)}
              className="size-10 rounded-md border border-border object-cover"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-surface-100 text-xs font-semibold text-ink-600">
              {formatUserName(user).slice(0, 1)}
            </div>
          ),
      },
      {
        key: 'name',
        label: 'الاسم',
        className: 'max-w-[180px]',
        render: (user) => (
          <span className="truncate font-medium text-ink-900">
            {formatUserName(user)}
          </span>
        ),
      },
      {
        key: 'email',
        label: 'البريد',
        className: 'max-w-[200px]',
        render: (user) => (
          <span className="truncate" dir="ltr">
            {user.email}
          </span>
        ),
      },
      {
        key: 'phone',
        label: 'الهاتف',
        render: (user) => user.phone ?? '—',
      },
      {
        key: 'roles',
        label: 'الأدوار',
        render: (user) => <UserRolesBadges roles={user.roles} />,
      },
      {
        key: 'status',
        label: 'الحالة',
        render: (user) => <UserStatusBadge isActive={user.isActive} />,
      },
      {
        key: 'verified',
        label: 'التحقق',
        render: (user) => (
          <Badge variant={user.isEmailVerified ? 'success' : 'default'}>
            {formatVerified(user.isEmailVerified)}
          </Badge>
        ),
      },
      {
        key: 'createdAt',
        label: 'تاريخ الإنشاء',
        render: (user) => formatDate(user.createdAt),
      },
      {
        key: 'actions',
        label: 'إجراء',
        render: (user) => (
          <div className="flex flex-wrap items-center gap-2">
            <Link href={routes.users.details(user.id)}>
              <Button variant="outline" size="small">
                التفاصيل
              </Button>
            </Link>
            <UserStatusToggle user={user} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage="لا يوجد مستخدمون مطابقون للبحث أو الفلتر الحالي."
    />
  );
}
