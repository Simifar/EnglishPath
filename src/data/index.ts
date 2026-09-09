import { examGuides } from './exams';
import { levels } from './levels';
import { resources } from './resources';
import { textbooks } from './textbooks';
import { validateCatalog } from './validate';

export * from './types';
export { examGuides, levels, resources, textbooks };
export function validateCatalogData() { validateCatalog({ levels, textbooks, resources, examGuides }); }
validateCatalogData();
