import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type { TransactionType } from '@/types';
import {
  getNeighborhoodRepository,
  toChildSummary,
  type NeighborhoodRepository,
} from './repository';
import type {
  Neighborhood,
  NeighborhoodDetailsView,
  NeighborhoodDirectoryView,
  NeighborhoodPropertyLink,
} from './types';

export class NeighborhoodService {
  constructor(private readonly repository: NeighborhoodRepository = getNeighborhoodRepository()) {}

  async getDirectory(
    transaction: TransactionType = 'sale',
  ): Promise<NeighborhoodDirectoryView> {
    const popularNodes = await this.repository.getPopular();
    const all = await this.repository.listAll();

    const popular = popularNodes.map(toChildSummary);
    const cityLinks: NeighborhoodPropertyLink[] = all
      .filter((n) => n.level === 'region' || n.level === 'city')
      .flatMap((n) => {
        const links = (n.relatedPropertyLinks ?? []).filter(
          (link) => link.transaction === transaction && !link.propertyType,
        );
        if (links.length) return links;
        // Fall back: one city-level link using first related or constructed
        const sample = (n.relatedPropertyLinks ?? []).find(
          (link) => link.transaction === transaction,
        );
        return [
          {
            label: `${n.nameAr}${sample?.count != null ? ` (${sample.count.toLocaleString('en-US')})` : ''}`,
            transaction,
            href: sample?.href ?? routes.properties.root(transaction),
            count: sample?.count,
          } satisfies NeighborhoodPropertyLink,
        ];
      });

    // Prefer simple city names with counts for directory section
    const directoryCityLinks: NeighborhoodPropertyLink[] = popularNodes.map((n) => {
      const saleLink = (n.relatedPropertyLinks ?? []).find(
        (l) => l.transaction === transaction,
      );
      return {
        label: n.nameAr,
        transaction,
        href: routes.neighborhood.details(...n.pathSegments),
        count: saleLink?.count,
      };
    });

    return {
      popular,
      cityLinks: directoryCityLinks.length ? directoryCityLinks : cityLinks,
    };
  }

  async getByPath(pathSegments: string[]): Promise<NeighborhoodDetailsView | null> {
    const neighborhood = await this.repository.getByPath(pathSegments);
    if (!neighborhood) return null;
    const children = (await this.repository.getChildren(neighborhood.id)).map(
      toChildSummary,
    );
    return {
      neighborhood: {
        ...neighborhood,
        children,
      },
      children,
    };
  }

  async getById(id: string): Promise<Neighborhood | null> {
    return this.repository.getById(id);
  }

  buildMetadata(neighborhood: Neighborhood) {
    return {
      title:
        neighborhood.seo?.title ??
        `أسعار العقارات في ${neighborhood.nameAr} | ${siteConfig.name}`,
      description:
        neighborhood.seo?.description ??
        neighborhood.shortDescription ??
        neighborhood.description ??
        `متوسط سعر المتر وتقييم الحي في ${neighborhood.nameAr}.`,
      path: routes.neighborhood.details(...neighborhood.pathSegments),
      image: neighborhood.heroImage ?? neighborhood.coverImage,
    };
  }
}

let service: NeighborhoodService | null = null;

export function getNeighborhoodService(): NeighborhoodService {
  if (!service) service = new NeighborhoodService();
  return service;
}
