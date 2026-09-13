import 'server-only';

import { getPublicJson } from '@/lib/api/client';
import type { PublicPropertyDetailsDto } from '@/types/api/public-property';

const PROPERTIES_PATH = '/api/v1/properties';

export async function fetchPropertyDetailsBySlug(
  slug: string,
): Promise<PublicPropertyDetailsDto> {
  return getPublicJson<PublicPropertyDetailsDto>(
    `${PROPERTIES_PATH}/${encodeURIComponent(slug)}`,
  );
}
