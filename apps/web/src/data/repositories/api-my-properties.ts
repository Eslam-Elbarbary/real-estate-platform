import 'server-only';

import { getJson } from '@/lib/api/client';
import type {
  ApiPropertyStatus,
  MyPropertyDto,
} from '@/types/api/my-property';

const MY_PROPERTIES_PATH = '/api/v1/properties/me';

export async function fetchMyProperties(
  accessToken: string,
  status?: ApiPropertyStatus,
): Promise<MyPropertyDto[]> {
  const path = status
    ? `${MY_PROPERTIES_PATH}?status=${encodeURIComponent(status)}`
    : MY_PROPERTIES_PATH;

  const data = await getJson<MyPropertyDto[]>(path, accessToken);
  return Array.isArray(data) ? data : [];
}
