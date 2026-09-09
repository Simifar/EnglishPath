import { Suspense } from 'react';
import ResourcesView, { ResourcesQueryView } from '@/components/catalog/ResourcesView';
export const metadata = { title: 'Ресурсы', description: 'Проверенные внешние ресурсы для грамматики, чтения, аудирования, общения и экзаменов.', alternates: { canonical: '/resources' } };

export default function Page() {
  return <Suspense fallback={<ResourcesView />}><ResourcesQueryView /></Suspense>;
}
