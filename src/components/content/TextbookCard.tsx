import type { Textbook } from '@/data';
import { ContentCard } from './ContentCard';
export function TextbookCard({ textbook }: { textbook: Textbook }) { return <ContentCard href={`/textbooks/${textbook.slug}`} favoriteId={textbook.id} eyebrow={`CEFR ${textbook.cefrLevels.join('–')}`} title={textbook.title} description={textbook.description} tags={textbook.tags}><p className="mt-2 text-sm text-muted-foreground">{textbook.authors.join(', ')}</p><p className="mt-1 text-xs text-muted-foreground">{textbook.publisher} · {textbook.format}</p></ContentCard>; }
