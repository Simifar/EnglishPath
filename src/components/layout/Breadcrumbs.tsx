import Link from 'next/link';
type Crumb = { label: string; href?: string };
export function Breadcrumbs({ items }: { items: Crumb[] }) { return <nav aria-label="Хлебные крошки" className="text-sm text-muted-foreground"><ol className="flex flex-wrap gap-2">{items.map((item, index) => <li key={`${item.label}-${index}`} className="flex gap-2"><span aria-hidden={index === 0}>/</span>{item.href ? <Link href={item.href} className="hover:text-primary hover:underline">{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>; }
