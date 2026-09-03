'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { hasPermission } from '@/features/auth/permissions';
import type { AdminRole, RoleListResult } from '../types';
import { DeleteRoleDialog } from './delete-role-dialog';
import { RoleFilters } from './role-filters';
import { RoleFormDialog } from './role-form-dialog';
import { RolePermissionsDialog } from './role-permissions-dialog';
import { RolesTable } from './roles-table';

interface RolesListProps {
  result: RoleListResult;
  permissions: string[];
  filters: {
    page: number;
    limit: number;
    search: string;
  };
}

export function RolesList({ result, permissions, filters }: RolesListProps) {
  const router = useRouter();
  const { items, meta } = result;
  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<AdminRole | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [permissionsRole, setPermissionsRole] = useState<AdminRole | null>(
    null,
  );
  const canCreate = hasPermission(permissions, 'roles.create');

  function handleAdd() {
    setEditingRole(null);
    setFormOpen(true);
  }

  function handleEdit(role: AdminRole) {
    setEditingRole(role);
    setFormOpen(true);
  }

  function handleDelete(role: AdminRole) {
    setDeletingRole(role);
    setDeleteOpen(true);
  }

  function handleManagePermissions(role: AdminRole) {
    setPermissionsRole(role);
    setPermissionsOpen(true);
  }

  async function handleSuccess() {
    setEditingRole(null);
    setDeletingRole(null);
    setPermissionsRole(null);
    await router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="الأدوار"
        description="إدارة أدوار النظام وصلاحيات الوصول للوحة التحكم."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">
              {meta.total.toLocaleString('ar-EG')} دور
            </Badge>
            {canCreate ? (
              <Button type="button" size="small" onClick={handleAdd}>
                إضافة دور
              </Button>
            ) : null}
          </div>
        }
      />

      <RoleFilters search={filters.search} />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">قائمة الأدوار</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pb-4">
          <RolesTable
            items={items}
            permissions={permissions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManagePermissions={handleManagePermissions}
          />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>

      <RoleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        role={editingRole}
        permissions={permissions}
        onSuccess={() => {
          void handleSuccess();
        }}
      />

      <DeleteRoleDialog
        open={deleteOpen}
        role={deletingRole}
        loading={deleteLoading}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) {
            setDeletingRole(null);
          }
        }}
        onLoadingChange={setDeleteLoading}
        onSuccess={() => {
          void handleSuccess();
        }}
      />

      <RolePermissionsDialog
        open={permissionsOpen}
        role={permissionsRole}
        permissions={permissions}
        onOpenChange={(open) => {
          setPermissionsOpen(open);
          if (!open) {
            setPermissionsRole(null);
          }
        }}
        onSuccess={() => {
          void handleSuccess();
        }}
      />
    </div>
  );
}
