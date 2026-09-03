'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { hasPermission } from '@/features/auth/permissions';
import { getAdminErrorMessage } from '@/lib/errors';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils/cn';
import { createRoleAction, updateRoleAction } from '../actions';
import type { AdminRole } from '../types';

interface RoleFormState {
  code: string;
  name: string;
  description: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  priority: string;
}

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: AdminRole | null;
  permissions: string[];
  onSuccess: () => void;
}

const EMPTY_FORM: RoleFormState = {
  code: '',
  name: '',
  description: '',
  isAdmin: false,
  isSuperAdmin: false,
  priority: '0',
};

function roleToForm(role: AdminRole): RoleFormState {
  return {
    code: role.code,
    name: role.name,
    description: role.description ?? '',
    isAdmin: role.isAdmin,
    isSuperAdmin: role.isSuperAdmin,
    priority: String(role.priority),
  };
}

function parsePriority(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  permissions,
  onSuccess,
}: RoleFormDialogProps) {
  const isEdit = Boolean(role);
  const canSubmit = hasPermission(
    permissions,
    isEdit ? 'roles.update' : 'roles.create',
  );
  const flagsLocked = Boolean(role?.isSystem);
  const [form, setForm] = useState<RoleFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    code?: string;
    name?: string;
    priority?: string;
  }>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(role ? roleToForm(role) : EMPTY_FORM);
    setFieldErrors({});
  }, [open, role]);

  function updateField<K extends keyof RoleFormState>(
    key: K,
    value: RoleFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    if (key in fieldErrors) {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function validateForm(): boolean {
    const nextErrors: typeof fieldErrors = {};

    if (!isEdit && !form.code.trim()) {
      nextErrors.code = 'رمز الدور مطلوب.';
    } else if (!isEdit && !/^[A-Z0-9_]+$/.test(form.code.trim())) {
      nextErrors.code = 'استخدم أحرفًا إنجليزية كبيرة وأرقامًا وشرطة سفلية فقط.';
    }

    if (!form.name.trim()) {
      nextErrors.name = 'اسم الدور مطلوب.';
    }

    const priority = parsePriority(form.priority);
    if (priority === undefined || priority < 0 || priority > 1000) {
      nextErrors.priority = 'الأولوية يجب أن تكون رقمًا بين 0 و 1000.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const priority = parsePriority(form.priority)!;
    const description = form.description.trim();

    const result =
      isEdit && role
        ? await updateRoleAction(role.id, {
            name: form.name.trim(),
            description,
            priority,
            ...(flagsLocked
              ? {}
              : {
                  isAdmin: form.isAdmin,
                  isSuperAdmin: form.isSuperAdmin,
                }),
          })
        : await createRoleAction({
            code: form.code.trim().toUpperCase(),
            name: form.name.trim(),
            description: description || undefined,
            isAdmin: form.isAdmin,
            isSuperAdmin: form.isSuperAdmin,
            priority,
          });

    if (result.ok) {
      toast.success(isEdit ? 'تم حفظ التعديلات بنجاح.' : 'تمت إضافة الدور بنجاح.');
      onOpenChange(false);
      onSuccess();
      setLoading(false);
      return;
    }

    toast.error(getAdminErrorMessage(result.error));
    setLoading(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (loading) {
      return;
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? 'تعديل دور' : 'إضافة دور'}
      description={
        isEdit
          ? 'حدّث بيانات الدور ثم احفظ التغييرات.'
          : 'أدخل بيانات الدور الجديد.'
      }
      className="w-[min(100%-2rem,36rem)]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={loading}
            onClick={() => handleOpenChange(false)}
          >
            إلغاء
          </Button>
          {canSubmit ? (
            <Button
              type="button"
              variant="primary"
              size="small"
              disabled={loading}
              onClick={() => {
                void handleSubmit();
              }}
            >
              {loading ? 'جاري الحفظ…' : isEdit ? 'حفظ التعديلات' : 'إضافة'}
            </Button>
          ) : null}
        </>
      }
    >
      <div className="space-y-4">
        <Input
          name="code"
          label="رمز الدور"
          placeholder="CUSTOM_ROLE"
          dir="ltr"
          className="text-start uppercase"
          value={form.code}
          disabled={loading || isEdit}
          error={fieldErrors.code}
          onChange={(event) =>
            updateField('code', event.target.value.toUpperCase())
          }
        />

        <Input
          name="name"
          label="اسم الدور"
          placeholder="دور مخصص"
          value={form.name}
          disabled={loading}
          error={fieldErrors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />

        <label className="flex w-full flex-col gap-1.5 text-sm" htmlFor="role-description">
          <span className="font-medium text-ink-800">الوصف</span>
          <textarea
            id="role-description"
            name="description"
            rows={3}
            value={form.description}
            disabled={loading}
            placeholder="وصف مختصر للدور..."
            onChange={(event) => updateField('description', event.target.value)}
            className={cn(
              'min-h-20 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-ink-900',
              'placeholder:text-ink-400',
              'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200',
              'disabled:cursor-not-allowed disabled:bg-surface-50 disabled:opacity-60',
            )}
          />
        </label>

        <Input
          name="priority"
          label="الأولوية"
          placeholder="0"
          dir="ltr"
          className="text-start"
          value={form.priority}
          disabled={loading}
          error={fieldErrors.priority}
          onChange={(event) => updateField('priority', event.target.value)}
        />

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-ink-900">خصائص الدور</h3>
          {flagsLocked ? (
            <p className="text-xs text-ink-500">
              لا يمكن تعديل خصائص أدوار النظام من الواجهة.
            </p>
          ) : null}
          <label className="inline-flex items-center gap-2 text-sm text-ink-800">
            <input
              type="checkbox"
              checked={form.isAdmin}
              disabled={loading || flagsLocked}
              className="size-4 rounded border-border text-brand-600 focus:ring-brand-200"
              onChange={(event) => updateField('isAdmin', event.target.checked)}
            />
            دور إداري (isAdmin)
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-ink-800">
            <input
              type="checkbox"
              checked={form.isSuperAdmin}
              disabled={loading || flagsLocked}
              className="size-4 rounded border-border text-brand-600 focus:ring-brand-200"
              onChange={(event) =>
                updateField('isSuperAdmin', event.target.checked)
              }
            />
            مدير عام (isSuperAdmin)
          </label>
        </section>
      </div>
    </Dialog>
  );
}
