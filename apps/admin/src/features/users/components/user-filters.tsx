import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, type SelectOption } from '@/components/ui/select';

interface UserFiltersProps {
  search: string;
  role: string;
  status: '' | 'true' | 'false';
  roleOptions: SelectOption[];
}

export function UserFilters({
  search,
  role,
  status,
  roleOptions,
}: UserFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form
          method="get"
          className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_auto_auto_auto]"
        >
          <Input
            name="search"
            label="بحث"
            placeholder="ابحث بالاسم أو البريد أو الهاتف..."
            defaultValue={search}
          />
          <Select
            name="role"
            label="الدور"
            placeholder="جميع الأدوار"
            options={roleOptions}
            defaultValue={role}
          />
          <Select
            name="status"
            label="الحالة"
            placeholder="جميع الحالات"
            options={[
              { value: 'true', label: 'نشط' },
              { value: 'false', label: 'غير نشط' },
            ]}
            defaultValue={status}
          />
          <div className="flex items-end lg:col-span-2 xl:col-span-1">
            <Button type="submit" className="w-full sm:w-auto">
              تطبيق
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
