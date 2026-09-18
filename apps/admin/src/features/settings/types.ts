export interface AdminPlatformSettings {
  id: string;
  siteName: string;
  shortName: string;
  description: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpdatePlatformSettingsInput = {
  siteName: string;
  shortName: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
};
