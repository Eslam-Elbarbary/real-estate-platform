import { Pagination } from '@/components/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import type { UserListResult } from '../types';
import { UserFilters } from './user-filters';
import { UsersTable } from './users-table';

interface UsersListProps {
  result: UserListResult;
  filters: {
    page: number;
    limit: number;
    search: string;
    role: string;
    status: '' | 'true' | 'false';
  };
}

export function UsersList({ result, filters }: UsersListProps) {
  const { items, meta } = result;

  return (
    <div>
      <PageHeader
        title="المستخدمون"
        description="عرض وإدارة المستخدمين والأدوار."
        actions={
          <Badge variant="brand">
            {meta.total.toLocaleString('ar-EG')} مستخدم
          </Badge>
        }
      />

      <UserFilters
        search={filters.search}
        role={filters.role}
        status={filters.status}
      />

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-ink-900">قائمة المستخدمين</h2>
          <p className="text-sm text-ink-500">
            صفحة {meta.page.toLocaleString('ar-EG')} من{' '}
            {Math.max(meta.totalPages, 1).toLocaleString('ar-EG')}
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pb-4">
          <UsersTable items={items} />

          {meta.totalPages > 1 ? (
            <Pagination page={meta.page} totalPages={meta.totalPages} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
