import 'server-only';

import { postJson } from '@/lib/api/client';
import { ApiRequestError } from '@/lib/api/errors';
import { runWithRefreshLock } from './refresh-lock';
import {
  clearTokens,
  getRefreshToken,
  saveTokens,
} from './token-session';

interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    roles: string[];
  };
}

const REFRESH_PATH = '/api/v1/auth/refresh';
const LOGOUT_PATH = '/api/v1/auth/logout';

function isValidRefreshData(
  data: RefreshResponseData | undefined,
): data is RefreshResponseData {
  return Boolean(
    data?.accessToken &&
      data.refreshToken &&
      data.user?.id &&
      data.user.email,
  );
}

/**
 * Calls POST /auth/refresh, rotates cookies, returns the new access token.
 * Returns null when refresh is impossible or the API rejects the token.
 */
export async function refreshAccessToken(): Promise<string | null> {
  return runWithRefreshLock(async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const data = await postJson<
        RefreshResponseData,
        { refreshToken: string }
      >(REFRESH_PATH, { refreshToken });

      if (!isValidRefreshData(data)) {
        try {
          await clearTokens();
        } catch {
          // ignore
        }
        return null;
      }

      try {
        await saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      } catch {
        // Cookie writes are only allowed in Server Actions / Route Handlers.
        // Still return the access token for the current request.
      }

      return data.accessToken;
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        (error.code === 'UNAUTHORIZED' || error.status === 401)
      ) {
        try {
          await clearTokens();
        } catch {
          // ignore cookie write restrictions during RSC
        }
        return null;
      }

      if (error instanceof ApiRequestError && error.code === 'NETWORK') {
        throw error;
      }

      try {
        await clearTokens();
      } catch {
        // ignore
      }
      return null;
    }
  });
}

/** Best-effort API revoke; always clears local tokens afterward. */
export async function revokeRefreshToken(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    try {
      await clearTokens();
    } catch {
      // ignore
    }
    return;
  }

  try {
    await postJson<{ message: string }, { refreshToken: string }>(LOGOUT_PATH, {
      refreshToken,
    });
  } catch {
    // Local clear still required even if revoke fails.
  }

  try {
    await clearTokens();
  } catch {
    // ignore
  }
}
