'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/layout/page-header';
import type { Developer } from '@/features/developers/types';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import type { Compound, CompoundListResult } from '../types';
import { CompoundFormDialog } from './compound-form-dialog';
import { CompoundsTable } from './compounds-table';

interface CompoundsListProps {
  result: CompoundListResult;
  developers: Developer[];
  roles: UserRole[];
  filters: {
    page: number;
    limit: number;
    search: string;
    developerId: string;
    areaId: string;
    isActive: '' | 'true' | 'false';
  };
}

export function CompoundsList({
  result,
  developers,
  roles,
  filters,
}: CompoundsListProps) {
  const router = useRouter();
  const { items, meta } = result;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompound, setEditingCompound] = useState<Compound | null>(null);
  const canCreate = hasPermission(roles, 'compounds.create');

  const developersById = useMemo(
    () => new Map(developers.map((developer) => [developer.id, developer])),
    [developers],
  );

  const developerFilterOptions = useMemo(
    () =>
      developers.map((developer) => ({
        value: developer.id,
        label: developer.nameAr ?? developer.nameEn,
      })),
    [developers],
  );

  function handleAdd() {
    setEditingCompound(null);
    setDialogOpen(true);
  }

  function handleEdit(compound: Compound) {
    setEditingCompound(compound);
    setDialogOpen(true);
  }

  async function handleSuccess() {
    setEditingCompound(null);
    await router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="المشاريع"
        description="إدارة الكمبوندات والوحدات المرتبطة بها."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">
              {meta.total.toLocaleString('ar-EG')} مشروع
            </Badge>
            {canCreate ? (
              <Button type="button" size="small" onClick={handleAdd}>
                إضافة مشروع
              </Button>
            ) : null}
          </div>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form
            method="get"
            className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto_auto]"
          >
            <Input
              name="search"
              label="بحث"
              placeholder="ابحث بالاسم أو الرابط..."
              defaultValue={filters.search}
            />
            <Select
              name="developerId"
              label="المطور"
              placeholder="جميع المطورين"
              options={developerFilterOptions}
              defaultValue={filters.developerId}
            />
            <Input
              name="areaId"
              label="معرّف المنطقة"
              placeholder="Area ID"
              dir="ltr"
              className="text-start"
              defaultValue={filters.areaId}
            />
            <Select
              name="isActive"
              label="الحالة"
              options={[
                { value: 'true', label: 'نشط' },
                { value: 'false', label: 'غير نشط' },
              ]}
              placeholder="جميع الحالات"
              defaultValue={filters.isActive}
            />
            <div className="flex items-end lg:col-span-2 xl:col-span-1">
              <Button type="submit" className="w-full sm:w-auto">
                تطبيق
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">قائمة المشاريع</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pb-4">
          <CompoundsTable
            items={items}
            developersById={developersById}
            roles={roles}
            onEdit={handleEdit}
          />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>

      <CompoundFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        compound={editingCompound}
        developers={developers}
        roles={roles}
        onSuccess={() => {
          void handleSuccess();
        }}
      />
    </div>
  );
}
