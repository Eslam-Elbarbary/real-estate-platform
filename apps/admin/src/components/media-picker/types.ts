import type { MediaAsset } from '@/features/media/types';
import type { UserRole } from '@/types';

export type { MediaAsset };

export interface MediaPickerProps {
  value: MediaAsset[];
  onChange: (images: MediaAsset[]) => void;
  multiple?: boolean;
  maxItems?: number;
  folder?: string;
  disabled?: boolean;
  /** Required for permission checks (media.view / media.upload). */
  roles: UserRole[];
}

export interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: MediaAsset[];
  onConfirm: (images: MediaAsset[]) => void;
  multiple: boolean;
  maxItems?: number;
  folder?: string;
  roles: UserRole[];
}

export interface MediaPickerGridProps {
  items: MediaAsset[];
  selectedIds: Set<string>;
  onToggle: (asset: MediaAsset) => void;
  loading?: boolean;
}

export interface MediaPickerCardProps {
  asset: MediaAsset;
  selected: boolean;
  onToggle: (asset: MediaAsset) => void;
}
