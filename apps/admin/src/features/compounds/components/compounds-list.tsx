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
import { CompoundCreateDialog } from './compound-create-dialog';
import { CompoundEditDialog } from './compound-edit-dialog';
import { CompoundsTable } from './compounds-table';

interface CompoundsListProps {
  result: CompoundListResult;
  developers: Developer[];
  areaLabelsById: Map<string, string>;
  roles: string[];
  permissions: string[];
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
  areaLabelsById,
  roles,
  permissions,
  filters,
}: CompoundsListProps) {
  const router = useRouter();
  const { items, meta } = result;
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCompound, setEditingCompound] = useState<Compound | null>(null);
  const canCreate = hasPermission(permissions, 'compounds.create');

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

  function handleEdit(compound: Compound) {
    setEditingCompound(compound);
    setEditOpen(true);
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
              <Button type="button" size="small" onClick={() => setCreateOpen(true)}>
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
            areaLabelsById={areaLabelsById}
            permissions={permissions}
            onEdit={handleEdit}
          />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>

      <CompoundCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        permissions={permissions}
        onSuccess={() => {
          void handleSuccess();
        }}
      />

      {editingCompound ? (
        <CompoundEditDialog
          open={editOpen}
          onOpenChange={(nextOpen) => {
            setEditOpen(nextOpen);
            if (!nextOpen) {
              setEditingCompound(null);
            }
          }}
          compound={editingCompound}
          initialDeveloper={
            editingCompound.developerId
              ? developersById.get(editingCompound.developerId) ?? null
              : null
          }
          permissions={permissions}
          onSuccess={() => {
            void handleSuccess();
          }}
        />
      ) : null}
    </div>
  );
}
