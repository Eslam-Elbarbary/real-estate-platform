'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/layout/page-header';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import type { Developer, DeveloperListResult } from '../types';
import { DeveloperCreateDialog } from './developer-create-dialog';
import { DeveloperEditDialog } from './developer-edit-dialog';
import { DevelopersTable } from './developers-table';

interface DevelopersListProps {
  result: DeveloperListResult;
  roles: UserRole[];
  filters: {
    page: number;
    limit: number;
    search: string;
  };
}

export function DevelopersList({ result, roles, filters }: DevelopersListProps) {
  const router = useRouter();
  const { items, meta } = result;
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const canCreate = hasPermission(roles, 'developers.create');

  function handleEdit(developer: Developer) {
    setEditingDeveloper(developer);
    setEditOpen(true);
  }

  async function handleSuccess() {
    setEditingDeveloper(null);
    await router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="المطورون"
        description="إدارة ملفات المطورين والتحقق من بياناتهم قبل الظهور في المنصة."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">
              {meta.total.toLocaleString('ar-EG')} مطور
            </Badge>
            {canCreate ? (
              <Button type="button" size="small" onClick={() => setCreateOpen(true)}>
                إضافة مطور
              </Button>
            ) : null}
          </div>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form
            method="get"
            className="grid gap-4 sm:grid-cols-[1fr_auto]"
          >
            <Input
              name="search"
              label="بحث"
              placeholder="ابحث بالاسم أو الرابط..."
              defaultValue={filters.search}
            />
            <div className="flex items-end">
              <Button type="submit" className="w-full sm:w-auto">
                تطبيق
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">قائمة المطورين</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pb-4">
          <DevelopersTable items={items} roles={roles} onEdit={handleEdit} />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>

      <DeveloperCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        roles={roles}
        onSuccess={() => {
          void handleSuccess();
        }}
      />

      {editingDeveloper ? (
        <DeveloperEditDialog
          open={editOpen}
          onOpenChange={(nextOpen) => {
            setEditOpen(nextOpen);
            if (!nextOpen) {
              setEditingDeveloper(null);
            }
          }}
          developer={editingDeveloper}
          roles={roles}
          onSuccess={() => {
            void handleSuccess();
          }}
        />
      ) : null}
    </div>
  );
}
