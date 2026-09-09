import Link from 'next/link';
import { SiteFooter } from '@/components/catalog/SiteFooter';
import { SiteHeader } from '@/components/catalog/SiteHeader';

export default function NotFound() {
  return <><SiteHeader /><main className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6"><p className="text-sm font-semibold text-primary">404</p><h1 className="mt-3 text-4xl font-bold tracking-tight">Страница не найдена</h1><p className="mx-auto mt-4 max-w-xl text-muted-foreground">Возможно, ссылка устарела или такого материала нет в справочнике.</p><Link href="/" className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">На главную</Link></main><SiteFooter /></>;
}
