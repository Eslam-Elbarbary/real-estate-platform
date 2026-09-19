import 'server-only';

import {
  deleteAuthedJson,
  getJson,
  patchAuthedJson,
  postAuthedJson,
} from '@/lib/api/client';
import type {
  AlertDto,
  CreateAlertBody,
  UpdateAlertBody,
} from '@/types/api/alerts';

const ALERTS_PATH = '/api/v1/alerts';

export async function fetchAlerts(accessToken: string): Promise<AlertDto[]> {
  const data = await getJson<AlertDto[]>(ALERTS_PATH, accessToken);
  return Array.isArray(data) ? data : [];
}

export function createAlertApi(
  accessToken: string,
  body: CreateAlertBody,
): Promise<AlertDto> {
  return postAuthedJson<AlertDto, CreateAlertBody>(
    ALERTS_PATH,
    body,
    accessToken,
  );
}

export function updateAlertApi(
  accessToken: string,
  id: string,
  body: UpdateAlertBody,
): Promise<AlertDto> {
  return patchAuthedJson<AlertDto, UpdateAlertBody>(
    `${ALERTS_PATH}/${encodeURIComponent(id)}`,
    body,
    accessToken,
  );
}

export function deleteAlertApi(
  accessToken: string,
  id: string,
): Promise<void> {
  return deleteAuthedJson<void>(
    `${ALERTS_PATH}/${encodeURIComponent(id)}`,
    accessToken,
  );
}
