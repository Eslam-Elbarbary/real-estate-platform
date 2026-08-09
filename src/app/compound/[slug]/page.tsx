import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import {
  getCompoundBySlug,
  getCompoundUnitInventory,
} from '@/features/compounds';
import { CompoundDetailsPage } from '@/features/compound-details';
import { formatCurrency } from '@/lib/formatting/currency';
import { createPageMetadata } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ units?: string }>;
}

function buildDescription(args: {
  title: string;
  location: string;
  developerName: string;
  startingPrice?: number;
  currency: 'EGP';
}): string {
  const pricePart =
    args.startingPrice !== undefined
      ? ` يبدأ من ${formatCurrency(args.startingPrice, args.currency)}.`
      : '';

  return `${args.title} في ${args.location} من تطوير ${args.developerName}.${pricePart} تصفّح الوحدات والتفاصيل على عقارات مصر.`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const compound = await getCompoundBySlug(slug);

  if (!compound) {
    return createPageMetadata({
      title: uiLabels.compoundDetailsPlaceholderTitle,
      description: uiLabels.compoundDetailsPlaceholderBody,
      path: routes.compounds.details(slug),
      noIndex: true,
    });
  }

  const title = compound.nameEn
    ? `${compound.nameEn} - ${compound.nameAr}`
    : compound.nameAr || compound.name;
  const location = [compound.areaName, compound.cityName]
    .filter(Boolean)
    .join(' - ');
  const cover =
    compound.gallery?.[0]?.src ??
    compound.images.find((image) => image.isCover)?.url ??
    compound.coverImageUrl;

  return createPageMetadata({
    title,
    description: buildDescription({
      title,
      location,
      developerName: compound.developerName,
      startingPrice: compound.startingPrice ?? compound.minPrice,
      currency: compound.currency,
    }),
    path: routes.compounds.details(compound.slug),
    image: cover,
    type: 'article',
  });
}

export default async function CompoundDetailsRoutePage({
  params,
}: PageProps) {
  const { slug } = await params;
  const compound = await getCompoundBySlug(slug);

  if (!compound) {
    notFound();
  }

  const inventory = await getCompoundUnitInventory(compound.id);

  return (
    <CompoundDetailsPage compound={compound} inventory={inventory} />
  );
}
