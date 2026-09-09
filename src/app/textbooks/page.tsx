import { Suspense } from 'react';
import TextbooksView, { TextbooksQueryView } from '@/components/catalog/TextbooksView';
export const metadata = { title: 'Учебники', description: 'Каталог учебников английского с описаниями и легальными ссылками на страницы издателей.', alternates: { canonical: '/textbooks' } };

export default function Page() {
  return <Suspense fallback={<TextbooksView />}><TextbooksQueryView /></Suspense>;
}
