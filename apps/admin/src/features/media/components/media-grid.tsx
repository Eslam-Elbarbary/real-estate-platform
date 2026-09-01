'use client';

import { ImageIcon } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import type { MediaAsset } from '../types';
import { MediaCard } from './media-card';

interface MediaGridProps {
  items: MediaAsset[];
  canDelete: boolean;
  onPreview: (asset: MediaAsset) => void;
  onDelete: (asset: MediaAsset) => void;
}

export function MediaGrid({
  items,
  canDelete,
  onPreview,
  onDelete,
}: MediaGridProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="لا توجد ملفات"
        description="ابدأ برفع الصور لاستخدامها في المنصة"
        icon={<ImageIcon className="size-5" aria-hidden />}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {items.map((asset) => (
        <MediaCard
          key={asset.id}
          asset={asset}
          canDelete={canDelete}
          onPreview={onPreview}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
