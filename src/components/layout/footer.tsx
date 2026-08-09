import Link from 'next/link';
import { AppStoreBadges } from '@/components/ui/app-store-badges';
import { Container } from '@/components/ui/container';
import { SocialLinks } from '@/components/ui/social-links';
import {
  footerLegalLinks,
  footerSections,
} from '@/config/footer';
import { uiLabels } from '@/config/labels';
import { siteConfig } from '@/config/site';
import { BrandLogo } from './brand-logo';

export function Footer() {
  const year = new Date().getFullYear();
  const linkSections = footerSections.slice(0, 3);

  return (
    <footer className="mt-auto bg-brand-600 text-white">
      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr_0.9fr]">
          <div className="max-w-sm space-y-4">
            <BrandLogo tone="inverse" />
            <p className="text-xs leading-6 text-white/85 sm:text-[13px]">
              {siteConfig.description}
            </p>
            <SocialLinks />
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {linkSections.map((section) => (
              <nav key={section.id} aria-label={section.title}>
                <p className="mb-2.5 text-sm font-semibold text-white">
                  {section.title}
                </p>
                <ul className="space-y-1.5">
                  {section.links.slice(0, 5).map((link) => (
                    <li key={`${section.id}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-xs text-white/80 transition-colors hover:text-white sm:text-[13px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2.5 text-sm font-semibold">تواصل معنا</p>
              <p className="text-xs text-white/80 sm:text-[13px]">
                {siteConfig.contactEmail}
              </p>
            </div>
            <div>
              <p className="mb-2.5 text-sm font-semibold">
                {uiLabels.downloadAppHeading}
              </p>
              <AppStoreBadges size="sm" />
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-2 py-3 text-[11px] text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. جميع الحقوق محفوظة.
          </p>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {footerLegalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
