import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPropertyTypeLabel } from '@/config/property-types';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';
import {
  getPropertyByIdAndSlug,
  getSimilarProperties,
} from '@/features/properties';
import { PropertyDetailsPage } from '@/features/property-details';
import { createPageMetadata } from '@/lib/seo/metadata';

interface PageProps {
  params: Promise<{ id: string; slug: string }>;
}

function buildListingDescription(args: {
  title: string;
  areaName: string;
  transactionType: 'sale' | 'rent';
  propertyTypeLabel: string;
}): string {
  const transactionLabel =
    args.transactionType === 'sale' ? uiLabels.forSale : uiLabels.forRent;

  return `${args.title} — ${args.propertyTypeLabel} ${transactionLabel} في ${args.areaName}. تصفّح التفاصيل والمزايا ومعلومات التواصل على عقارات مصر.`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, slug } = await params;
  const property = await getPropertyByIdAndSlug(id, slug);

  if (!property) {
    return createPageMetadata({
      title: uiLabels.listingPlaceholderTitle,
      description: uiLabels.listingPlaceholderBody,
      path: routes.listing(id, slug),
      noIndex: true,
    });
  }

  const propertyTypeLabel = getPropertyTypeLabel(property.propertyType);
  const cover =
    property.images.find((image) => image.isCover) ?? property.images[0];

  return createPageMetadata({
    title: property.title,
    description: buildListingDescription({
      title: property.title,
      areaName: property.location.areaName,
      transactionType: property.transactionType,
      propertyTypeLabel,
    }),
    path: routes.listing(property.id, property.slug),
    image: cover?.url,
    type: 'article',
  });
}

export default async function ListingDetailsPage({ params }: PageProps) {
  const { id, slug } = await params;
  const property = await getPropertyByIdAndSlug(id, slug);

  if (!property) {
    notFound();
  }

  const similarProperties = await getSimilarProperties(property.id, 5);

  return (
    <PropertyDetailsPage
      property={property}
      similarProperties={similarProperties}
    />
  );
}
