'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import type { AdminPlan, PlanListResult } from '../types';
import { PlanFilters } from './plan-filters';
import { PlanFormDialog } from './plan-form-dialog';
import { PlansTable } from './plans-table';

interface PlansListProps {
  result: PlanListResult;
  roles: string[];
  permissions: string[];
  filters: {
    page: number;
    limit: number;
    search: string;
    status: string;
  };
}

export function PlansList({ result, roles, permissions, filters }: PlansListProps) {
  const router = useRouter();
  const { items, meta } = result;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);
  const canCreate = hasPermission(permissions, 'plans.create');

  function handleAdd() {
    setEditingPlan(null);
    setDialogOpen(true);
  }

  function handleEdit(plan: AdminPlan) {
    setEditingPlan(plan);
    setDialogOpen(true);
  }

  async function handleSuccess() {
    setEditingPlan(null);
    await router.refresh();
  }

  return (
    <div>
      <PageHeader
        title="الخطط"
        description="إدارة خطط الاشتراك وحدود الإعلانات والميزات المرتبطة بكل خطة."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">
              {meta.total.toLocaleString('ar-EG')} خطة
            </Badge>
            {canCreate ? (
              <Button type="button" size="small" onClick={handleAdd}>
                إضافة خطة
              </Button>
            ) : null}
          </div>
        }
      />

      <PlanFilters search={filters.search} status={filters.status} />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">قائمة الخطط</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pb-4">
          <PlansTable items={items} permissions={permissions} onEdit={handleEdit} />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>

      <PlanFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        plan={editingPlan}
        permissions={permissions}
        onSuccess={() => {
          void handleSuccess();
        }}
      />
    </div>
  );
}
