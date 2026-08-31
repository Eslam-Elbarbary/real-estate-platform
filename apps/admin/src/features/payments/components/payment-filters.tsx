import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { PaymentStatus } from '../types';

const STATUS_OPTIONS: Array<{ value: PaymentStatus; label: string }> = [
  { value: 'SUCCESS', label: 'نجاح' },
  { value: 'PENDING', label: 'قيد الانتظار' },
  { value: 'FAILED', label: 'فشل' },
  { value: 'REFUNDED', label: 'مسترجع' },
];

interface PaymentFiltersProps {
  search: string;
  status: string;
}

export function PaymentFilters({ search, status }: PaymentFiltersProps) {
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
            placeholder="ابحث بعنوان العقار أو بريد المالك أو مرجع الدفع..."
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
