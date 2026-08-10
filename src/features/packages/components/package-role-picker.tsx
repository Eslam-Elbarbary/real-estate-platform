import Link from 'next/link';
import { Building2, Building, Handshake, HardHat } from 'lucide-react';
import { Container } from '@/components/ui/container';
import type { PackageAudienceDefinition } from '../config/catalog';
import { packageRolePickerCopy } from '../config/catalog';
import { cn } from '@/lib/utils/cn';

const roleIcons = {
  owner: Building,
  marketer: Handshake,
  marketing_company: Building2,
  compound_developer: HardHat,
} as const;

interface PackageRolePickerProps {
  audiences: PackageAudienceDefinition[];
}

export function PackageRolePicker({ audiences }: PackageRolePickerProps) {
  return (
    <div className="bg-white pb-16">
      <div className="bg-brand-700">
        <Container className="py-12 sm:py-14">
          <h1 className="max-w-3xl text-2xl font-extrabold leading-10 text-white sm:text-4xl">
            {packageRolePickerCopy.pageTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
            {packageRolePickerCopy.pageSubtitle}
          </p>
        </Container>
      </div>

      <Container className="py-10 sm:py-12">
        <h2 className="text-2xl font-extrabold text-ink-950 sm:text-3xl">
          {packageRolePickerCopy.sectionTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-600">
          {packageRolePickerCopy.sectionSubtitle}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {audiences.map((audience) => {
            const Icon = roleIcons[audience.role];
            return (
              <Link
                key={audience.role}
                href={audience.href}
                className={cn(
                  'group flex flex-col rounded-2xl border border-[#e5e5e5] bg-white p-6 transition-all',
                  'hover:border-brand-200 hover:shadow-md',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                )}
              >
                <span className="inline-flex size-14 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
                  <Icon size={28} strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-ink-950">
                  {audience.label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-ink-600">
                  {audience.description}
                </p>
                <span className="mt-4 text-sm font-bold text-brand-700">
                  عرض الباقات ←
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
