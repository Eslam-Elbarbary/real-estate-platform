'use client';

import { MediaPicker } from '@/components/media-picker';
import type { MediaAsset } from '@/components/media-picker';
import type { UserRole } from '@/types';
import { extractCloudinaryPublicId } from '../format';

export interface DeveloperLogoValue {
  logoUrl: string;
  logoPublicId: string;
}

interface DeveloperLogoFieldProps {
  value: DeveloperLogoValue;
  onChange: (value: DeveloperLogoValue) => void;
  permissions: string[];
  disabled?: boolean;
}

function toPickerAssets(value: DeveloperLogoValue): MediaAsset[] {
  if (!value.logoUrl.trim()) {
    return [];
  }

  return [
    {
      id: value.logoPublicId.trim() || value.logoUrl,
      url: value.logoUrl,
      fileName: 'logo',
      mimeType: null,
      size: null,
      width: null,
      height: null,
      folder: 'developers',
      createdAt: new Date(0).toISOString(),
    },
  ];
}

export function DeveloperLogoField({
  value,
  onChange,
  permissions,
  disabled = false,
}: DeveloperLogoFieldProps) {
  function handleChange(assets: MediaAsset[]) {
    const asset = assets[0];
    if (!asset) {
      onChange({ logoUrl: '', logoPublicId: '' });
      return;
    }

    const publicId =
      value.logoUrl === asset.url && value.logoPublicId
        ? value.logoPublicId
        : extractCloudinaryPublicId(asset.url) ?? '';

    onChange({
      logoUrl: asset.url,
      logoPublicId: publicId,
    });
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium text-ink-800">الشعار</p>
        <p className="mt-1 text-xs text-ink-500">
          اختر صورة واحدة من مكتبة الوسائط.
        </p>
      </div>

      <MediaPicker
        value={toPickerAssets(value)}
        onChange={handleChange}
        multiple={false}
        maxItems={1}
        folder="developers"
        disabled={disabled}
        permissions={permissions}
      />
    </div>
  );
}
