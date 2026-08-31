import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { PlanStatus } from '../types';

const STATUS_OPTIONS: Array<{ value: PlanStatus; label: string }> = [
  { value: 'ACTIVE', label: 'نشط' },
  { value: 'INACTIVE', label: 'غير نشط' },
];

interface PlanFiltersProps {
  search: string;
  status: string;
}

export function PlanFilters({ search, status }: PlanFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form
          method="get"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]"
        >
          <Input
            name="search"
            label="بحث"
            placeholder="ابحث بالاسم أو الرمز..."
            defaultValue={search}
          />
          <Select
            name="status"
            label="الحالة"
            placeholder="جميع الحالات"
            options={STATUS_OPTIONS}
            defaultValue={status}
          />
          <div className="flex items-end">
            <Button type="submit" className="w-full sm:w-auto">
              تطبيق
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
