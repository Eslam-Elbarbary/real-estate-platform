'use client';

import { DataTable, type DataTableColumn } from '@/components/data';
import { Button } from '@/components/ui/button';
import { hasPermission } from '@/features/auth/permissions';
import { formatCount } from '../format';
import type { AdminRole } from '../types';
import { RoleFlagBadge } from './role-status-badges';

interface RolesTableProps {
  items: AdminRole[];
  permissions: string[];
  onEdit: (role: AdminRole) => void;
  onDelete: (role: AdminRole) => void;
  onManagePermissions: (role: AdminRole) => void;
}

function canDeleteRole(role: AdminRole): boolean {
  return !role.isSystem && role.userCount === 0;
}

export function RolesTable({
  items,
  permissions,
  onEdit,
  onDelete,
  onManagePermissions,
}: RolesTableProps) {
  const canUpdate = hasPermission(permissions, 'roles.update');
  const canDelete = hasPermission(permissions, 'roles.delete');
  const canManagePermissions = hasPermission(
    permissions,
    'roles.manage_permissions',
  );

  const columns: DataTableColumn<AdminRole>[] = [
    {
      key: 'name',
      label: 'الاسم',
      className: 'font-medium text-ink-900',
      render: (role) => (
        <div className="min-w-0">
          <p className="truncate">{role.name}</p>
          {role.description ? (
            <p className="truncate text-xs text-ink-500">{role.description}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'code',
      label: 'الرمز',
      render: (role) => (
        <span className="font-mono text-xs text-ink-800" dir="ltr">
          {role.code}
        </span>
      ),
    },
    {
      key: 'isAdmin',
      label: 'مدير',
      render: (role) => (
        <RoleFlagBadge active={role.isAdmin} label="مدير" variant="success" />
      ),
    },
    {
      key: 'isSuperAdmin',
      label: 'مدير عام',
      render: (role) => (
        <RoleFlagBadge
          active={role.isSuperAdmin}
          label="مدير عام"
          variant="danger"
        />
      ),
    },
    {
      key: 'isSystem',
      label: 'نظام',
      render: (role) => (
        <RoleFlagBadge active={role.isSystem} label="نظام" variant="warning" />
      ),
    },
    {
      key: 'userCount',
      label: 'المستخدمون',
      render: (role) => formatCount(role.userCount),
    },
    {
      key: 'permissionCount',
      label: 'الصلاحيات',
      render: (role) => formatCount(role.permissionCount),
    },
    {
      key: 'actions',
      label: 'إجراء',
      render: (role) => {
        const showEdit = canUpdate;
        const showPermissions = canManagePermissions;
        const showDelete = canDelete && canDeleteRole(role);
        const deleteDisabled = canDelete && !canDeleteRole(role);

        if (!showEdit && !showPermissions && !canDelete) {
          return '—';
        }

        return (
          <div className="flex flex-wrap items-center gap-2">
            {showEdit ? (
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => onEdit(role)}
              >
                تعديل
              </Button>
            ) : null}
            {showPermissions ? (
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => onManagePermissions(role)}
              >
                صلاحيات
              </Button>
            ) : null}
            {showDelete ? (
              <Button
                type="button"
                variant="danger"
                size="small"
                onClick={() => onDelete(role)}
              >
                حذف
              </Button>
            ) : null}
            {deleteDisabled ? (
              <Button type="button" variant="outline" size="small" disabled>
                حذف
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage="لا توجد أدوار"
    />
  );
}
