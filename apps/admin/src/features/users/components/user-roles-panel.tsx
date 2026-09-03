'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Select } from '@/components/ui/select';
import { hasPermission } from '@/features/auth/permissions';
import type { AdminRole } from '@/features/roles/types';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import {
  assignUserRoleAction,
  removeUserRoleAction,
} from '../actions';
import { formatDate } from '../format';
import type { AdminUserRole } from '../types';

interface UserRolesPanelProps {
  userId: string;
  permissions: string[];
  assignedRoles: AdminUserRole[];
  availableRoles: AdminRole[];
}

export function UserRolesPanel({
  userId,
  permissions,
  assignedRoles,
  availableRoles,
}: UserRolesPanelProps) {
  const router = useRouter();
  const canManage = hasPermission(permissions, 'users.manage_roles');
  const [selectedCode, setSelectedCode] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [removingCode, setRemovingCode] = useState<string | null>(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const assignedCodes = useMemo(
    () => new Set(assignedRoles.map((role) => role.code)),
    [assignedRoles],
  );

  const assignOptions = useMemo(
    () =>
      availableRoles
        .filter((role) => !assignedCodes.has(role.code))
        .map((role) => ({
          value: role.code,
          label: `${role.name} (${role.code})`,
        })),
    [availableRoles, assignedCodes],
  );

  const rolePendingRemove = assignedRoles.find(
    (role) => role.code === removingCode,
  );

  async function handleAssign() {
    if (!canManage || !selectedCode) {
      return;
    }

    setAssigning(true);
    const result = await assignUserRoleAction(userId, selectedCode);

    if (result.ok) {
      toast.success('تم تعيين الدور بنجاح.');
      setSelectedCode('');
      await router.refresh();
      setAssigning(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setAssigning(false);
  }

  async function handleRemoveConfirm() {
    if (!canManage || !removingCode) {
      return;
    }

    setRemoveLoading(true);
    const result = await removeUserRoleAction(userId, removingCode);

    if (result.ok) {
      toast.success('تم إزالة الدور بنجاح.');
      setRemovingCode(null);
      await router.refresh();
      setRemoveLoading(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setRemoveLoading(false);
  }

  const busy = assigning || removeLoading;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-ink-900">أدوار المستخدم</h2>
              <p className="text-sm text-ink-500">
                الأدوار المعيّنة حالياً وصلاحيات الإدارة.
              </p>
            </div>
            <Badge variant="brand">
              {assignedRoles.length.toLocaleString('ar-EG')} دور
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignedRoles.length === 0 ? (
            <p className="text-sm text-ink-500">لا توجد أدوار معيّنة لهذا المستخدم.</p>
          ) : (
            <ul className="divide-y divide-border rounded-md border border-border">
              {assignedRoles.map((role) => (
                <li
                  key={role.id}
                  className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-ink-900">{role.name}</p>
                    <p className="font-mono text-xs text-ink-600" dir="ltr">
                      {role.code}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {role.isSystem ? (
                        <Badge variant="warning">نظام</Badge>
                      ) : null}
                      {role.isAdmin ? (
                        <Badge variant="success">مدير</Badge>
                      ) : null}
                      {role.isSuperAdmin ? (
                        <Badge variant="danger">مدير عام</Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-ink-500">
                      منذ {formatDate(role.assignedAt)}
                    </p>
                  </div>
                  {canManage ? (
                    <Button
                      type="button"
                      variant="danger"
                      size="small"
                      disabled={busy}
                      onClick={() => setRemovingCode(role.code)}
                    >
                      إزالة
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          {canManage ? (
            <div className="flex flex-col gap-3 rounded-md border border-border bg-surface-50 p-3 sm:flex-row sm:items-end">
              <Select
                name="roleCode"
                label="تعيين دور"
                placeholder="اختر دوراً…"
                options={assignOptions}
                value={selectedCode}
                disabled={busy || assignOptions.length === 0}
                onChange={(event) => setSelectedCode(event.target.value)}
                className="sm:min-w-[16rem]"
              />
              <Button
                type="button"
                variant="primary"
                size="small"
                disabled={busy || !selectedCode}
                onClick={() => {
                  void handleAssign();
                }}
              >
                {assigning ? 'جاري التعيين…' : 'تعيين'}
              </Button>
            </div>
          ) : null}

          {canManage && assignOptions.length === 0 && availableRoles.length > 0 ? (
            <p className="text-xs text-ink-500">
              جميع الأدوار المتاحة معيّنة بالفعل لهذا المستخدم.
            </p>
          ) : null}

          {canManage && availableRoles.length === 0 ? (
            <p className="text-xs text-ink-500">
              لا توجد أدوار متاحة للتعيين. تأكد من صلاحية عرض الأدوار.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={Boolean(removingCode)}
        onOpenChange={(open) => {
          if (!removeLoading && !open) {
            setRemovingCode(null);
          }
        }}
        title="إزالة الدور"
        description={
          rolePendingRemove
            ? `هل تريد إزالة الدور "${rolePendingRemove.name}" (${rolePendingRemove.code}) من هذا المستخدم؟`
            : undefined
        }
        confirmLabel="إزالة"
        variant="danger"
        loading={removeLoading}
        onConfirm={handleRemoveConfirm}
      />
    </>
  );
}
