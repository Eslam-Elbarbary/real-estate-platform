'use client';

import { ImageIcon } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import type { MediaPickerGridProps } from './types';
import { MediaPickerCard } from './media-picker-card';

export function MediaPickerGrid({
  items,
  selectedIds,
  onToggle,
  loading = false,
}: MediaPickerGridProps) {
  if (loading) {
    return <LoadingState label="جاري تحميل الوسائط…" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="لا توجد ملفات"
        description="جرّب تغيير البحث أو المجلد، أو ارفع ملفات جديدة"
        icon={<ImageIcon className="size-5" aria-hidden />}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {items.map((asset) => (
        <MediaPickerCard
          key={asset.id}
          asset={asset}
          selected={selectedIds.has(asset.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
