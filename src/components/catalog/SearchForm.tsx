import { withBasePath } from '@/lib/paths';
import { SearchInput } from './SearchInput';
import { FilterPanel } from './FilterPanel';
import type { CatalogFilters } from '@/lib/catalog-filters';
export function SearchForm({ filters }: { filters: CatalogFilters }) { return <form action={withBasePath('/search/')} className="mt-7 space-y-4"><SearchInput defaultValue={filters.q} /><FilterPanel filters={filters} /></form>; }
