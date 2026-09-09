import { cefrLevels, resourceCategories, type CefrLevel, type ResourceCategory } from '@/data';

export const catalogTypes = ['level', 'topic', 'textbook', 'exam', 'resource'] as const;
export type CatalogType = (typeof catalogTypes)[number];
export type CatalogFilters = { q: string; level?: CefrLevel; type?: CatalogType; category?: ResourceCategory; free?: boolean };
type SearchParams = Record<string, string | string[] | undefined>;
const one = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export function parseCatalogFilters(searchParams: SearchParams): CatalogFilters {
  const level = one(searchParams.level)?.toUpperCase(); const type = one(searchParams.type); const category = one(searchParams.category); const free = one(searchParams.free);
  return { q: one(searchParams.q)?.trim() ?? '', level: cefrLevels.includes(level as CefrLevel) ? level as CefrLevel : undefined, type: catalogTypes.includes(type as CatalogType) ? type as CatalogType : undefined, category: resourceCategories.includes(category as ResourceCategory) ? category as ResourceCategory : undefined, free: free === 'true' ? true : free === 'false' ? false : undefined };
}

export function hasActiveFilters(filters: CatalogFilters) { return Boolean(filters.q || filters.level || filters.type || filters.category || filters.free !== undefined); }

export type TextbookFilters = { level?: CefrLevel; publisher?: string; format?: string; purpose?: string };
export type ResourceFilters = { category?: ResourceCategory; free?: boolean };
export function parseTextbookFilters(searchParams: SearchParams): TextbookFilters { const level = one(searchParams.level)?.toUpperCase(); return { level: cefrLevels.includes(level as CefrLevel) ? level as CefrLevel : undefined, publisher: one(searchParams.publisher) || undefined, format: one(searchParams.format) || undefined, purpose: one(searchParams.purpose) || undefined }; }
export function parseResourceFilters(searchParams: SearchParams): ResourceFilters { const category = one(searchParams.category); const free = one(searchParams.free); return { category: resourceCategories.includes(category as ResourceCategory) ? category as ResourceCategory : undefined, free: free === 'true' ? true : undefined }; }
