import type { ComponentType } from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from 'react-icons/fa6';
import { cn } from '@/lib/utils/cn';

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin';

export interface SocialLinkItem {
  id: SocialPlatform;
  label: string;
  href: string;
}

const socialIcons: Record<
  SocialPlatform,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaXTwitter,
  linkedin: FaLinkedinIn,
};

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
  links: SocialLinkItem[];
}

export function SocialLinks({
  className,
  iconClassName,
  links,
}: SocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div
      className={cn('flex items-center gap-3', className)}
      aria-label="حسابات التواصل"
    >
      {links.map((link) => {
        const Icon = socialIcons[link.id];
        return (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className={cn(
              'inline-flex text-white/90 transition-colors hover:text-white',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
              iconClassName,
            )}
          >
            <Icon className="size-4" aria-hidden />
          </a>
        );
      })}
    </div>
  );
}

export function buildSocialLinksFromSettings(settings: {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
}): SocialLinkItem[] {
  const entries: Array<{ id: SocialPlatform; label: string; href: string | null | undefined }> = [
    { id: 'facebook', label: 'فيسبوك', href: settings.facebookUrl },
    { id: 'instagram', label: 'إنستغرام', href: settings.instagramUrl },
    { id: 'twitter', label: 'تويتر', href: settings.twitterUrl },
    { id: 'linkedin', label: 'لينكدإن', href: settings.linkedinUrl },
  ];

  return entries
    .filter((entry) => Boolean(entry.href?.trim()))
    .map((entry) => ({
      id: entry.id,
      label: entry.label,
      href: entry.href!.trim(),
    }));
}
