import Link from 'next/link';
import { StoreBadges } from '@/components/ui/app-store-badges';
import { Container } from '@/components/ui/container';
import {
  SocialLinks,
  buildSocialLinksFromSettings,
} from '@/components/ui/social-links';
import {
  footerAttribution,
  footerLegalLinks,
  footerSections,
} from '@/config/footer';
import { uiLabels } from '@/config/labels';
import type { PublicPlatformSettings } from '@/features/settings';
import { resolveSiteName } from '@/features/settings';
import { BrandLogo } from './brand-logo';

interface FooterProps {
  settings: PublicPlatformSettings;
}

export function Footer({ settings }: FooterProps) {
  const linkSections = footerSections.slice(0, 3);
  const { companyName, companyUrl, copyrightYear, rightsReserved, creditLine } =
    footerAttribution;
  const siteName = resolveSiteName(settings);
  const socialLinks = buildSocialLinksFromSettings(settings);
  const contactLines = [
    settings.email,
    settings.phone,
    settings.whatsapp ? `WhatsApp: ${settings.whatsapp}` : null,
    settings.address,
  ].filter((value): value is string => Boolean(value?.trim()));

  return (
    <footer className="mt-auto bg-brand-600 text-white">
      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_2fr_0.9fr]">
          <div className="max-w-sm space-y-4">
            <BrandLogo
              tone="inverse"
              siteName={siteName}
              logoUrl={settings.logoUrl}
              className="text-white"
            />
            {settings.description ? (
              <p className="text-xs leading-6 text-white/85 sm:text-[13px]">
                {settings.description}
              </p>
            ) : null}
            <SocialLinks links={socialLinks} />
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
              {contactLines.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-white/80 sm:text-[13px]">
                  {contactLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-white/80 sm:text-[13px]">{siteName}</p>
              )}
            </div>
            <div>
              <p className="mb-2.5 text-sm font-semibold">
                {uiLabels.downloadAppHeading}
              </p>
              <StoreBadges size="compact" />
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-2 py-3 text-[11px] text-white/75 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1 text-center sm:text-start">
            <p>
              © {copyrightYear} {siteName}. {rightsReserved}
            </p>
            <p>
              <Link
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {creditLine}
              </Link>
              {' · '}
              {companyName}
            </p>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
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
