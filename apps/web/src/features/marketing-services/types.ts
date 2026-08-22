import type { CommercialAccountRole } from '@/features/credits/types';
import type { LucideIcon } from 'lucide-react';

export interface MarketingStat {
  id: string;
  value: string;
  label: string;
  /** Demo metrics — not live marketplace claims. */
  demo: true;
}

export interface MarketingServiceSectionConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  imageSrc: string;
  imageAlt: string;
  mediaKind: 'image' | 'video';
  reversed: boolean;
  ctaLabel: string;
  ctaHref: string;
}

export interface MarketingTestimonial {
  id: string;
  quote: string;
  name: string;
  company: string;
  role?: string;
  avatarSrc: string;
  rating: 5;
}

export interface MarketingPartner {
  id: string;
  name: string;
  logoSrc: string;
}

export interface MarketingLeadInput {
  name: string;
  phone: string;
  email: string;
  company: string;
  businessType: CommercialAccountRole;
  address: string;
}
