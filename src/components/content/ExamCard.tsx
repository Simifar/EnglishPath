import type { ExamGuide } from '@/data';
import { ContentCard } from './ContentCard';
export function ExamCard({ exam }: { exam: ExamGuide }) { return <ContentCard href={`/exams/${exam.slug}`} favoriteId={exam.id} eyebrow={`Рекомендуемый диапазон: ${exam.cefrLevels.join('–')}`} title={exam.title} description={exam.description} tags={exam.tags} />; }
