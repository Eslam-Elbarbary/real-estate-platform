import 'server-only';

import {
  getJson,
  patchAuthedJson,
  postAuthedJson,
} from '@/lib/api/client';

export interface UserProfileResponse {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  roles: string[];
  isEmailVerified: boolean;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const PROFILE_PATH = '/api/v1/users/me';
const CHANGE_PASSWORD_PATH = '/api/v1/users/me/change-password';

export async function fetchCurrentUserProfile(
  accessToken: string,
): Promise<UserProfileResponse> {
  return getJson<UserProfileResponse>(PROFILE_PATH, accessToken);
}

export async function updateCurrentUserProfile(
  accessToken: string,
  input: UpdateProfileRequest,
): Promise<UserProfileResponse> {
  return patchAuthedJson<UserProfileResponse, UpdateProfileRequest>(
    PROFILE_PATH,
    input,
    accessToken,
  );
}

export async function changeCurrentUserPassword(
  accessToken: string,
  input: { currentPassword: string; newPassword: string },
): Promise<{ message: string }> {
  return postAuthedJson<{ message: string }, typeof input>(
    CHANGE_PASSWORD_PATH,
    input,
    accessToken,
  );
}
