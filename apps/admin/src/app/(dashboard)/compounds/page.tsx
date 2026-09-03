import { CompoundsList } from '@/features/compounds/components/compounds-list';
import { buildAreaLabelMap } from '@/features/compounds/format';
import { getAdminCompounds } from '@/features/compounds';
import { getAdminDevelopers } from '@/features/developers';
import { getAdminSession } from '@/features/auth/service';
import { getLocationTree } from '@/features/locations';
import { createPageMetadata } from '@/lib/seo/metadata';

export const metadata = createPageMetadata({
  title: 'المشاريع',
  description: 'إدارة الكمبوندات والمشاريع.',
  path: '/compounds',
});

function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number,
): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseString(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() ?? '';
}

function parseIsActiveFilter(
  value: string | string[] | undefined,
): boolean | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === 'true') {
    return true;
  }
  if (raw === 'false') {
    return false;
  }
  return undefined;
}

function flattenAreas(
  tree: Awaited<ReturnType<typeof getLocationTree>>,
): Array<{ id: string; nameAr: string | null; nameEn: string }> {
  const areas: Array<{ id: string; nameAr: string | null; nameEn: string }> = [];

  for (const country of tree) {
    for (const city of country.cities) {
      for (const area of city.areas) {
        areas.push(area);
      }
    }
  }

  return areas;
}

export default async function CompoundsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(parsePositiveInt(params.limit, 20), 100);
  const search = parseString(params.search);
  const developerId = parseString(params.developerId);
  const areaId = parseString(params.areaId);
  const isActiveRaw = Array.isArray(params.isActive)
    ? params.isActive[0]
    : params.isActive;
  const isActiveFilter =
    isActiveRaw === 'true' || isActiveRaw === 'false' ? isActiveRaw : '';

  const [result, developersResult, locationTree, session] = await Promise.all([
    getAdminCompounds({
      page,
      limit,
      search,
      developerId: developerId || undefined,
      areaId: areaId || undefined,
      isActive: parseIsActiveFilter(params.isActive),
    }),
    getAdminDevelopers({ limit: 100 }),
    getLocationTree(),
    getAdminSession(),
  ]);
  const roles = session?.user.roles ?? [];
  const permissions = session?.user.permissions ?? [];
  const areaLabelsById = buildAreaLabelMap(flattenAreas(locationTree));

  return (
    <CompoundsList
      result={result}
      developers={developersResult.items}
      areaLabelsById={areaLabelsById}
      roles={roles}
      permissions={permissions}
      filters={{
        page,
        limit,
        search,
        developerId,
        areaId,
        isActive: isActiveFilter,
      }}
    />
  );
}
