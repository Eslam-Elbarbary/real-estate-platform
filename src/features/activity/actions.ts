'use server';

import { revalidatePath } from 'next/cache';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import type { PropertyType } from '@/types';
import { getAlertsService } from './alerts/service';
import { getNotesService } from './notes/service';
import type { PropertyAlert, UserNote } from './types';

function requireUserId(): Promise<string> {
  return getServerSession().then((session) => {
    if (!session) throw new Error('UNAUTHORIZED');
    return session.user.id;
  });
}

export async function createAlertAction(input: {
  locationSlugs: string[];
  propertyType: PropertyType;
  transaction: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}): Promise<PropertyAlert> {
  const userId = await requireUserId();
  const alert = await getAlertsService().create(userId, input);
  revalidatePath(routes.alerts);
  return alert;
}

export async function setAlertEnabledAction(
  id: string,
  enabled: boolean,
): Promise<PropertyAlert | null> {
  const userId = await requireUserId();
  const alert = await getAlertsService().setEnabled(userId, id, enabled);
  revalidatePath(routes.alerts);
  return alert;
}

export async function createNoteAction(body: string): Promise<UserNote> {
  const userId = await requireUserId();
  const note = await getNotesService().create(userId, body);
  revalidatePath(routes.notes);
  return note;
}
