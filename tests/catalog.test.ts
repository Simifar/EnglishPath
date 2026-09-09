import { expect, test } from 'bun:test';
import { levels, textbooks, resources, examGuides } from '../src/data';
import { validateCatalog } from '../src/data/validate';
import { officialUrlSchema } from '../src/data/types';
import baseline from '../docs/catalog-baseline.json';
import before from '../docs/catalog-before-model-migration.json';
const catalog = { levels, textbooks, resources, examGuides };
const copy = () => structuredClone(catalog);

test('migration preserves every published ID and URL', () => {
  const collections = { levels, textbooks, resources, exams: examGuides };
  const prefixes = { levels: '/plans/', textbooks: '/textbooks/', resources: '/resources/', exams: '/exams/' };
  const current = Object.entries(collections).flatMap(([collection, records]) => records.map(({ id, slug }) => ({ collection, id, slug, url: prefixes[collection as keyof typeof prefixes] + slug })));
  expect(current).toEqual(expect.arrayContaining(baseline));
  for (const oldLevel of before.levels) {
    const level = levels.find(item => item.id === oldLevel.id)!;
    expect(level.textbookIds).toEqual(expect.arrayContaining(oldLevel.textbookIds));
    const topics = [...level.grammar, ...level.vocabulary, ...level.skills].map(topic => topic.id);
    expect(topics).toEqual(expect.arrayContaining([...oldLevel.grammar, ...oldLevel.vocabulary, ...oldLevel.skills].map(topic => topic.id)));
  }
});
test('titles can change independently of IDs, slugs and level references', () => {
  const changed = copy(); changed.textbooks[0].title = 'Новое название книги'; changed.resources[0].title = 'Новое название ресурса';
  expect(() => validateCatalog(changed)).not.toThrow();
  expect(changed.textbooks[0].id).toBe(textbooks[0].id);
  expect(changed.textbooks[0].slug).toBe(textbooks[0].slug);
  expect(changed.levels[0].textbookIds).toEqual(levels[0].textbookIds);
});
test('validation rejects missing or repeated relationships', () => {
  for (const kind of ['textbookIds', 'resourceIds'] as const) {
    const changed = copy(); changed.levels[0][kind] = ['missing'];
    expect(() => validateCatalog(changed)).toThrow();
    changed.levels[0][kind] = kind === 'textbookIds' ? [textbooks[0].id, textbooks[0].id] : [resources[0].id, resources[0].id];
    expect(() => validateCatalog(changed)).toThrow();
  }
  const linked = copy(); linked.levels[0].resourceIds = [resources[0].id];
  expect(() => validateCatalog(linked)).not.toThrow();
});
test('topic IDs are unique across all levels and cannot collide with catalog IDs', () => {
  const changed = copy(); changed.levels[1].grammar[0].id = changed.levels[0].grammar[0].id;
  expect(() => validateCatalog(changed)).toThrow('duplicate id');
  changed.levels[1].grammar[0].id = changed.resources[0].id;
  expect(() => validateCatalog(changed)).toThrow('duplicate id');
});
test('material URLs reject unsafe schemes and credentials', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'file:///tmp/book', 'ftp://example.com/book', 'https://name:password@example.com']) expect(officialUrlSchema.safeParse(url).success).toBe(false);
  expect(officialUrlSchema.safeParse('https://example.com/book').success).toBe(true);
  const changed = copy(); changed.examGuides[0].officialMaterials[0].url = 'javascript:alert(1)';
  expect(() => validateCatalog(changed)).toThrow();
});
test('unassessed levels and pending reviews are explicit', () => {
  expect(resources.every(resource => resource.cefrLevels.length === 0 && resource.levelStatus === 'unassessed')).toBe(true);
  const changed = copy(); changed.resources[0].cefrLevels = ['B1'];
  expect(() => validateCatalog(changed)).toThrow('CEFR');
  changed.resources[0].levelStatus = 'assessed'; expect(() => validateCatalog(changed)).not.toThrow();
  changed.resources[0].reviewStatus = 'verified'; expect(() => validateCatalog(changed)).toThrow('dates');
});
test('verified records need guidance, dated review and explicit access details', () => {
  const changed = copy(); const resource = changed.resources[0];
  resource.reviewStatus = 'verified'; resource.verifiedAt = '2026-09-09'; resource.linkCheckedAt = '2026-09-09';
  expect(() => validateCatalog(changed)).toThrow('guidance');
  resource.audience = 'Описание аудитории'; resource.howToUse = 'Рекомендация по использованию'; resource.limitations = []; resource.registration = 'no';
  expect(() => validateCatalog(changed)).not.toThrow();
  resource.verifiedAt = '2099-01-01'; expect(() => validateCatalog(changed)).toThrow('future');
});
