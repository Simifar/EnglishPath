'use client';
import { useSyncExternalStore } from 'react';
import { favoritesStore } from '@/lib/favorites-store';
export function useFavorites() {
  const snapshot = useSyncExternalStore(favoritesStore.subscribe, favoritesStore.getSnapshot, favoritesStore.getServerSnapshot);
  return { favoriteIds: snapshot.ids, ready: snapshot.ready, persistent: snapshot.persistent, isFavorite: (id: string) => snapshot.ids.includes(id), toggleFavorite: favoritesStore.toggle };
}
