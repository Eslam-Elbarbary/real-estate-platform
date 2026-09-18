export type BannerPosition =
  | 'HOME_HERO'
  | 'HOME_SECTION'
  | 'PROPERTIES_PAGE';

export interface AdminBanner {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormInput {
  title: string;
  description: string;
  imageUrl: string;
  mobileImageUrl: string;
  buttonText: string;
  buttonUrl: string;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
}

export const BANNER_POSITION_OPTIONS: Array<{
  value: BannerPosition;
  label: string;
}> = [
  { value: 'HOME_HERO', label: 'الرئيسية - Hero' },
  { value: 'HOME_SECTION', label: 'الرئيسية - قسم' },
  { value: 'PROPERTIES_PAGE', label: 'صفحة العقارات' },
];
