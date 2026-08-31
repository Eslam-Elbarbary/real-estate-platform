import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { LeadStatus } from '../types';

const STATUS_OPTIONS: Array<{ value: LeadStatus; label: string }> = [
  { value: 'NEW', label: 'جديد' },
  { value: 'CONTACTED', label: 'تم التواصل' },
  { value: 'FOLLOW_UP', label: 'متابعة' },
  { value: 'INTERESTED', label: 'مهتم' },
  { value: 'CLOSED', label: 'مغلق' },
  { value: 'REJECTED', label: 'مرفوض' },
];

interface LeadFiltersProps {
  search: string;
  status: string;
}

export function LeadFilters({ search, status }: LeadFiltersProps) {
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
            placeholder="ابحث ببريد العميل أو البائع أو عنوان العقار أو الهاتف..."
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
