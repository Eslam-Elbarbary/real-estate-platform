import type { MediaAsset } from '@/features/media/types';

export type { MediaAsset };

export interface MediaPickerProps {
  value: MediaAsset[];
  onChange: (images: MediaAsset[]) => void;
  multiple?: boolean;
  maxItems?: number;
  folder?: string;
  disabled?: boolean;
  /** Required for permission checks (media.view / media.upload). */
  permissions: string[];
}

export interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: MediaAsset[];
  onConfirm: (images: MediaAsset[]) => void;
  multiple: boolean;
  maxItems?: number;
  folder?: string;
  permissions: string[];
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
