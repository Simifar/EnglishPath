import type { CatalogFilters } from './catalog-filters';
export const searchPageSize = 30;
export function paginateResults<T>(items: T[], value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const requested = raw && /^\d+$/.test(raw) ? Number(raw) : 1;
  const pages = Math.max(1, Math.ceil(items.length / searchPageSize));
  const page = Math.min(pages, Math.max(1, Number.isSafeInteger(requested) ? requested : 1));
  return { total: items.length, pages, page, results: items.slice((page - 1) * searchPageSize, page * searchPageSize) };
}
export function searchPageHref(filters: CatalogFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.level) params.set('level', filters.level);
  if (filters.type) params.set('type', filters.type);
  if (filters.category) params.set('category', filters.category);
  if (filters.free !== undefined) params.set('free', String(filters.free));
  if (page > 1) params.set('page', String(page));
  return '/search?' + params.toString();
}
