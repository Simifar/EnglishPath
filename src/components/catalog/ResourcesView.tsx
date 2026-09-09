'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resources, type ResourceCategory } from '@/data';
import { ResourceFilterForm } from '@/components/catalog/CatalogFilterForm';
import { ResultCount } from '@/components/catalog/ResultCount';
import { ResourceCard } from '@/components/content/ResourceCard';
import { Container } from '@/components/layout/Container';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { parseResourceFilters } from '@/lib/catalog-filters';
const categoryLabels: Record<ResourceCategory, string> = { grammar: 'Грамматика', reading: 'Чтение', listening: 'Слушание', speaking: 'Общение', dictionary: 'Словари', practice: 'Тренировки', pronunciation: 'Произношение', exams: 'Экзамены' };
export default function ResourcesView({ params = {} }: { params?: Record<string, string | string[] | undefined> }) { const filters = parseResourceFilters(params); const results = resources.filter((item) => (!filters.category || item.category === filters.category) && (!filters.free || item.access !== 'paid')); const categories = [...new Set(results.map((item) => item.category))]; return <><SiteHeader /><main><Container className="py-12"><p className="text-sm font-semibold text-primary">RESOURCES</p><h1 className="mt-2 text-4xl font-bold tracking-tight">Каталог ресурсов</h1><p className="mt-4 max-w-2xl text-muted-foreground">Внешние сервисы и официальные сайты. Условия доступа и стоимость могут меняться — проверяйте их перед использованием.</p><div className="mt-6 flex gap-2 overflow-x-auto pb-1" aria-label="Быстрый выбор категории">{['all', ...Object.keys(categoryLabels)].map((item) => <Link key={item} href={item === 'all' ? '/resources' : `/resources?category=${item}`} className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm font-medium ${filters.category === item ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>{item === 'all' ? 'Все' : categoryLabels[item as ResourceCategory]}</Link>)}</div><ResourceFilterForm key={JSON.stringify(params)} filters={filters} /><div className="mt-6"><ResultCount count={results.length} /></div>{results.length ? <div className="mt-8 space-y-12">{categories.map((category) => <section key={category}><h2 className="text-xl font-bold">{categoryLabels[category]}</h2><div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{results.filter((resource) => resource.category === category).map((resource) => <ResourceCard key={resource.id} resource={resource} />)}</div></section>)}</div> : <div className="mt-4 rounded-xl border border-dashed p-6"><h2 className="font-semibold">Ресурсы не найдены</h2><p className="mt-2 text-sm text-muted-foreground">Сбросьте фильтры или выберите другую категорию.</p></div>}</Container></main><SiteFooter /></>; }

export function ResourcesQueryView() {
  const query = useSearchParams();
  const params: Record<string, string> = {};
  query.forEach((value, key) => { if (!(key in params)) params[key] = value; });
  return <ResourcesView params={params} />;
}
