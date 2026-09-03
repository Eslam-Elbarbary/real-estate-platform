'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import {
  getRoleDetailsAction,
  listPermissionsAction,
  setRolePermissionsAction,
} from '../actions';
import type { AdminPermissionCatalogItem, AdminRole } from '../types';

interface RolePermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: AdminRole | null;
  permissions: string[];
  onSuccess: () => void;
}

interface PermissionGroup {
  key: string;
  label: string;
  items: AdminPermissionCatalogItem[];
}

const GROUP_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  users: 'Users',
  properties: 'Properties',
  leads: 'Leads',
  plans: 'Plans',
  payments: 'Payments',
  developers: 'Developers',
  compounds: 'Compounds',
  media: 'Media',
  roles: 'Roles',
};

function permissionPrefix(code: string): string {
  const dot = code.indexOf('.');
  return dot === -1 ? code : code.slice(0, dot);
}

function groupLabel(prefix: string): string {
  return (
    GROUP_LABELS[prefix] ??
    `${prefix.charAt(0).toUpperCase()}${prefix.slice(1)}`
  );
}

function groupPermissions(
  catalog: AdminPermissionCatalogItem[],
): PermissionGroup[] {
  const map = new Map<string, AdminPermissionCatalogItem[]>();

  for (const item of catalog) {
    const key = permissionPrefix(item.code);
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      map.set(key, [item]);
    }
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, items]) => ({
      key,
      label: groupLabel(key),
      items: items.slice().sort((a, b) => a.code.localeCompare(b.code)),
    }));
}

export function RolePermissionsDialog({
  open,
  onOpenChange,
  role,
  permissions,
  onSuccess,
}: RolePermissionsDialogProps) {
  const canManage = hasPermission(permissions, 'roles.manage_permissions');
  const [catalog, setCatalog] = useState<AdminPermissionCatalogItem[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const groups = useMemo(() => groupPermissions(catalog), [catalog]);

  useEffect(() => {
    if (!open || !role) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      setCatalog([]);
      setSelected(new Set());

      const [catalogResult, detailsResult] = await Promise.all([
        listPermissionsAction(),
        getRoleDetailsAction(role!.id),
      ]);

      if (cancelled) {
        return;
      }

      if (!catalogResult.ok) {
        setLoadError(getAdminErrorMessage(catalogResult.error));
        setLoading(false);
        return;
      }

      if (!detailsResult.ok) {
        setLoadError(getAdminErrorMessage(detailsResult.error));
        setLoading(false);
        return;
      }

      setCatalog(catalogResult.data);
      setSelected(new Set(detailsResult.data.permissions));
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [open, role]);

  function togglePermission(code: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(code);
      } else {
        next.delete(code);
      }
      return next;
    });
  }

  function setGroupSelected(codes: string[], checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      for (const code of codes) {
        if (checked) {
          next.add(code);
        } else {
          next.delete(code);
        }
      }
      return next;
    });
  }

  async function handleSave() {
    if (!role || !canManage) {
      return;
    }

    setSaving(true);
    const result = await setRolePermissionsAction(role.id, {
      permissionCodes: [...selected].sort((a, b) => a.localeCompare(b)),
    });

    if (result.ok) {
      toast.success('تم تحديث صلاحيات الدور بنجاح.');
      onOpenChange(false);
      onSuccess();
      setSaving(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setSaving(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (loading || saving) {
      return;
    }
    onOpenChange(nextOpen);
  }

  const busy = loading || saving;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={role ? `صلاحيات الدور: ${role.name}` : 'صلاحيات الدور'}
      description={
        role
          ? `اختر الصلاحيات المعينة لـ ${role.code}.`
          : 'اختر صلاحيات الدور.'
      }
      className="w-[min(100%-2rem,42rem)]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={busy}
            onClick={() => handleOpenChange(false)}
          >
            إلغاء
          </Button>
          {canManage ? (
            <Button
              type="button"
              variant="primary"
              size="small"
              disabled={busy || Boolean(loadError)}
              onClick={() => {
                void handleSave();
              }}
            >
              {saving ? 'جاري الحفظ…' : 'حفظ الصلاحيات'}
            </Button>
          ) : null}
        </>
      }
    >
      {loading ? (
        <p className="text-sm text-ink-500">جاري تحميل الصلاحيات…</p>
      ) : null}

      {!loading && loadError ? (
        <p className="text-sm text-danger-700">{loadError}</p>
      ) : null}

      {!loading && !loadError ? (
        <div className="max-h-[min(60vh,28rem)] space-y-4 overflow-y-auto pe-1">
          {groups.length === 0 ? (
            <p className="text-sm text-ink-500">لا توجد صلاحيات في الكتالوج.</p>
          ) : (
            groups.map((group) => {
              const codes = group.items.map((item) => item.code);
              const selectedInGroup = codes.filter((code) =>
                selected.has(code),
              ).length;
              const allSelected =
                codes.length > 0 && selectedInGroup === codes.length;

              return (
                <section
                  key={group.key}
                  className="rounded-md border border-border p-3"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-ink-900">
                        {group.label}
                      </h3>
                      <p className="text-xs text-ink-500" dir="ltr">
                        {selectedInGroup.toLocaleString('en-US')} /{' '}
                        {codes.length.toLocaleString('en-US')}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="small"
                        disabled={busy || !canManage || allSelected}
                        onClick={() => setGroupSelected(codes, true)}
                      >
                        تحديد الكل
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="small"
                        disabled={busy || !canManage || selectedInGroup === 0}
                        onClick={() => setGroupSelected(codes, false)}
                      >
                        إلغاء الكل
                      </Button>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <label className="flex cursor-pointer items-start gap-2 text-sm text-ink-800">
                          <input
                            type="checkbox"
                            className="mt-0.5 size-4 shrink-0 rounded border-border text-brand-600 focus:ring-brand-200"
                            checked={selected.has(item.code)}
                            disabled={busy || !canManage}
                            onChange={(event) =>
                              togglePermission(item.code, event.target.checked)
                            }
                          />
                          <span className="min-w-0">
                            <span
                              className="block font-mono text-xs text-ink-900"
                              dir="ltr"
                            >
                              {item.code}
                            </span>
                            {item.name ? (
                              <span className="block text-xs text-ink-500">
                                {item.name}
                              </span>
                            ) : null}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
          )}
        </div>
      ) : null}
    </Dialog>
  );
}
