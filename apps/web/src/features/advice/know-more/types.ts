import type { AppIconName } from '@/config/icons';

export type KnowMoreServiceStatus = 'live';

export interface KnowMoreService {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  icon: AppIconName;
  href: string;
  status: KnowMoreServiceStatus;
}
