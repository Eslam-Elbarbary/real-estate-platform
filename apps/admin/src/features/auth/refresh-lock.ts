import 'server-only';

/**
 * Coalesces concurrent refresh attempts within the same Node process.
 * Prevents refresh-token rotation races when multiple API calls receive 401 together.
 */
const REFRESH_LOCK_KEY = Symbol.for('admin.auth.refreshInFlight');

type RefreshLockStore = {
  refreshInFlight: Promise<string | false> | null;
};

function getRefreshLockStore(): RefreshLockStore {
  const globalStore = globalThis as typeof globalThis & {
    [REFRESH_LOCK_KEY]?: RefreshLockStore;
  };

  if (!globalStore[REFRESH_LOCK_KEY]) {
    globalStore[REFRESH_LOCK_KEY] = { refreshInFlight: null };
  }

  return globalStore[REFRESH_LOCK_KEY];
}

export function runWithRefreshLock(
  operation: () => Promise<string | false>,
): Promise<string | false> {
  const store = getRefreshLockStore();

  if (store.refreshInFlight) {
    return store.refreshInFlight;
  }

  store.refreshInFlight = operation().finally(() => {
    store.refreshInFlight = null;
  });

  return store.refreshInFlight;
}
