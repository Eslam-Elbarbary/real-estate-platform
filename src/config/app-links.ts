import { siteConfig } from '@/config/site';

export const appStoreLinks = {
  googlePlay: {
    href: process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ?? '#',
    label: 'Google Play',
    badgeSrc: '/assets/home/app/google-play.svg',
  },
  appStore: {
    href: process.env.NEXT_PUBLIC_APP_STORE_URL ?? '#',
    label: 'App Store',
    badgeSrc: '/assets/home/app/app-store.svg',
  },
  qr: {
    src: '/assets/home/app/qr.webp',
    href: siteConfig.url,
    caption: 'امسح للتطبيق',
  },
  phones: {
    src: '/assets/home/app/phones.webp',
    alt: 'لقطات من تطبيق عقارات مصر على الهاتف',
  },
} as const;

export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'youtube';

export interface SocialLinkConfig {
  id: SocialPlatform;
  label: string;
  href: string;
}

export const socialLinks: SocialLinkConfig[] = [
  {
    id: 'facebook',
    label: 'فيسبوك',
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? 'https://facebook.com',
  },
  {
    id: 'instagram',
    label: 'إنستغرام',
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://instagram.com',
  },
  {
    id: 'linkedin',
    label: 'لينكدإن',
    href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? 'https://linkedin.com',
  },
  {
    id: 'youtube',
    label: 'يوتيوب',
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? 'https://youtube.com',
  },
];
