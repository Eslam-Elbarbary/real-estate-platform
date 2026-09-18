'use server';

import { revalidatePath } from 'next/cache';
import { getUserFacingErrorMessage } from '@/lib/errors';
import { getAdminPlatformSettings, updateAdminPlatformSettings } from './repository';
import type { UpdatePlatformSettingsInput } from './types';

export type SettingsActionResult =
  | { ok: true }
  | { ok: false; error: string };

function revalidateSettings() {
  revalidatePath('/settings');
}

export async function getPlatformSettingsAction() {
  try {
    const settings = await getAdminPlatformSettings();
    return { ok: true as const, settings };
  } catch (error) {
    return {
      ok: false as const,
      error: getUserFacingErrorMessage(error),
      settings: null,
    };
  }
}

export async function updatePlatformSettingsAction(
  input: UpdatePlatformSettingsInput,
): Promise<SettingsActionResult> {
  try {
    await updateAdminPlatformSettings(input);
    revalidateSettings();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: getUserFacingErrorMessage(error) };
  }
}
