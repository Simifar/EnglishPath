const storageKey = 'cortexmap:favorites';
type Snapshot = { ids: string[]; ready: boolean; persistent: boolean };
type StorageAdapter = Pick<Storage, 'getItem' | 'setItem'>;

function parseIds(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && id.length > 0))] : [];
  } catch { return []; }
}

export function createFavoritesStore(getStorage: () => StorageAdapter, watchStorage: (onChange: (key: string | null) => void) => () => void) {
  const serverSnapshot: Snapshot = { ids: [], ready: false, persistent: true };
  let snapshot = serverSnapshot;
  let stopWatching: (() => void) | undefined;
  const listeners = new Set<() => void>();

  function publish(ids: string[], persistent: boolean) {
    if (snapshot.ready && snapshot.persistent === persistent && ids.length === snapshot.ids.length && ids.every((id, index) => id === snapshot.ids[index])) return;
    snapshot = { ids, ready: true, persistent };
    listeners.forEach((listener) => listener());
  }
  function refresh() {
    // Preserve unsaved changes in memory when browser storage is unavailable.
    if (snapshot.ready && !snapshot.persistent) return;
    try { publish(parseIds(getStorage().getItem(storageKey)), true); }
    catch { publish(snapshot.ids, false); }
  }
  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => serverSnapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) {
        stopWatching = watchStorage((key) => { if (key === storageKey || key === null) refresh(); });
        refresh();
      }
      return () => { listeners.delete(listener); if (!listeners.size) { stopWatching?.(); stopWatching = undefined; } };
    },
    toggle(id: string) {
      refresh();
      const ids = snapshot.ids.includes(id) ? snapshot.ids.filter((value) => value !== id) : [...snapshot.ids, id];
      let persistent = true;
      try { getStorage().setItem(storageKey, JSON.stringify(ids)); }
      catch { persistent = false; }
      publish(ids, persistent);
    },
  };
}

export const favoritesStore = createFavoritesStore(
  () => window.localStorage,
  (onChange) => {
    const listener = (event: StorageEvent) => {
      try { if (event.storageArea === window.localStorage) onChange(event.key); } catch { /* Storage may be blocked. */ }
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  },
);
