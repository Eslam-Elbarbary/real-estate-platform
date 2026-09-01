'use client';

import { MediaPicker } from '@/components/media-picker';
import type { MediaAsset } from '@/components/media-picker';
import type { UserRole } from '@/types';
import { extractCloudinaryPublicId } from '../format';

export interface CompoundCoverValue {
  coverUrl: string;
  coverPublicId: string;
}

interface CompoundCoverFieldProps {
  value: CompoundCoverValue;
  onChange: (value: CompoundCoverValue) => void;
  roles: UserRole[];
  disabled?: boolean;
}

function toPickerAssets(value: CompoundCoverValue): MediaAsset[] {
  if (!value.coverUrl.trim()) {
    return [];
  }

  return [
    {
      id: value.coverPublicId.trim() || value.coverUrl,
      url: value.coverUrl,
      fileName: 'cover',
      mimeType: null,
      size: null,
      width: null,
      height: null,
      folder: 'compounds',
      createdAt: new Date(0).toISOString(),
    },
  ];
}

export function CompoundCoverField({
  value,
  onChange,
  roles,
  disabled = false,
}: CompoundCoverFieldProps) {
  function handleChange(assets: MediaAsset[]) {
    const asset = assets[0];
    if (!asset) {
      onChange({ coverUrl: '', coverPublicId: '' });
      return;
    }

    const publicId =
      value.coverUrl === asset.url && value.coverPublicId
        ? value.coverPublicId
        : extractCloudinaryPublicId(asset.url) ?? '';

    onChange({
      coverUrl: asset.url,
      coverPublicId: publicId,
    });
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium text-ink-800">صورة الغلاف</p>
        <p className="mt-1 text-xs text-ink-500">
          اختر صورة واحدة من مكتبة الوسائط.
        </p>
      </div>

      <MediaPicker
        value={toPickerAssets(value)}
        onChange={handleChange}
        multiple={false}
        maxItems={1}
        folder="compounds"
        disabled={disabled}
        roles={roles}
      />
    </div>
  );
}
