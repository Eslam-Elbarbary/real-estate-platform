import { BannerPosition, PrismaClient } from '../generated/prisma-client';
import { demoImage } from './properties.seed';

type BannerSeed = {
  title: string;
  description?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
};

// Banner has no natural unique key besides `id`, so (title, position) is used as the seed's own
// idempotency key below — good enough since both are fixed per seed entry.
const BANNERS: BannerSeed[] = [
  {
    title: 'Find your dream home in New Cairo',
    description: 'Discover top compounds and verified listings across New Cairo.',
    imageUrl: demoImage('samples/landscapes/architecture-signs'),
    mobileImageUrl: demoImage('samples/landscapes/architecture-signs'),
    buttonText: 'Browse properties',
    buttonUrl: '/properties/sale',
    position: BannerPosition.HOME_HERO,
    sortOrder: 0,
    isActive: true,
  },
  {
    title: 'Summer 2025 sale campaign',
    description: 'Archived hero banner kept for reference.',
    imageUrl: demoImage('samples/landscapes/nature-mountains'),
    position: BannerPosition.HOME_HERO,
    sortOrder: 1,
    isActive: false,
  },
  {
    title: 'Chalets on the North Coast',
    description: 'Book your seaside getaway before summer.',
    imageUrl: demoImage('samples/landscapes/beach-boat'),
    buttonText: 'View chalets',
    buttonUrl: '/properties/rent?propertyType=CHALET',
    position: BannerPosition.HOME_SECTION,
    sortOrder: 0,
    isActive: true,
  },
  {
    title: 'List your property for free',
    description: 'Reach thousands of buyers and tenants.',
    imageUrl: demoImage('samples/people/kitchen-bar'),
    buttonText: 'Get started',
    buttonUrl: '/properties/new',
    position: BannerPosition.PROPERTIES_PAGE,
    sortOrder: 0,
    isActive: true,
  },
];

export async function seedBanners(prisma: PrismaClient): Promise<void> {
  for (const banner of BANNERS) {
    const existing = await prisma.banner.findFirst({
      where: { title: banner.title, position: banner.position },
    });

    const data = {
      title: banner.title,
      description: banner.description ?? null,
      imageUrl: banner.imageUrl,
      mobileImageUrl: banner.mobileImageUrl ?? null,
      buttonText: banner.buttonText ?? null,
      buttonUrl: banner.buttonUrl ?? null,
      position: banner.position,
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    };

    if (existing) {
      await prisma.banner.update({ where: { id: existing.id }, data });
    } else {
      await prisma.banner.create({ data });
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`  banners: ${BANNERS.length} upserted`);
  }
}
