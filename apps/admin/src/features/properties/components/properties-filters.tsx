import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { PropertyStatus } from '@/types';

const STATUS_OPTIONS: Array<{ value: PropertyStatus; label: string }> = [
  { value: 'PENDING_REVIEW', label: 'بانتظار المراجعة' },
  { value: 'DRAFT', label: 'مسودة' },
  { value: 'PENDING_PAYMENT', label: 'بانتظار الدفع' },
  { value: 'PUBLISHED', label: 'منشور' },
  { value: 'REJECTED', label: 'مرفوض' },
  { value: 'ARCHIVED', label: 'مؤرشف' },
  { value: 'EXPIRED', label: 'منتهي' },
];

interface PropertiesFiltersProps {
  status: PropertyStatus;
  search: string;
}

export function PropertiesFilters({ status, search }: PropertiesFiltersProps) {
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
            placeholder="ابحث بالعنوان أو الرابط..."
            defaultValue={search}
          />
          <Select
            name="status"
            label="الحالة"
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
