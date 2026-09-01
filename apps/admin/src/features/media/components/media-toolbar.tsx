'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { MEDIA_FOLDER_OPTIONS } from '../types';

interface MediaToolbarProps {
  search: string;
  folder: string;
  limit: number;
}

export function MediaToolbar({ search, folder, limit }: MediaToolbarProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form
          method="get"
          className="grid gap-4 lg:grid-cols-[1fr_minmax(0,14rem)_auto]"
        >
          <Input
            name="search"
            label="البحث في الصور"
            placeholder="ابحث باسم الملف..."
            defaultValue={search}
          />
          <Select
            name="folder"
            label="المجلد"
            defaultValue={folder}
            options={[
              { value: '', label: 'الكل' },
              ...MEDIA_FOLDER_OPTIONS.map((option) => ({
                value: option.value,
                label: option.label,
              })),
            ]}
          />
          <input type="hidden" name="limit" value={String(limit)} />
          <div className="flex items-end">
            <Button type="submit" className="w-full lg:w-auto">
              تطبيق
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
