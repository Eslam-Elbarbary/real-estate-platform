import type { ComponentType } from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa6';
import { socialLinks, type SocialPlatform } from '@/config/app-links';
import { cn } from '@/lib/utils/cn';

const socialIcons: Record<
  SocialPlatform,
  ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
};

interface SocialLinksProps {
  className?: string;
  iconClassName?: string;
}

export function SocialLinks({ className, iconClassName }: SocialLinksProps) {
  return (
    <div
      className={cn('flex items-center gap-3', className)}
      aria-label="حسابات التواصل"
    >
      {socialLinks.map((link) => {
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
