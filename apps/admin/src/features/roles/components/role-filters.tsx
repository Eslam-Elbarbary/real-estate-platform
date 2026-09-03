import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface RoleFiltersProps {
  search: string;
}

export function RoleFilters({ search }: RoleFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form
          method="get"
          className="grid gap-4 sm:grid-cols-[1fr_auto]"
        >
          <Input
            name="search"
            label="بحث"
            placeholder="ابحث بالاسم أو الرمز..."
            defaultValue={search}
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
