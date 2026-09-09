import { validateCatalogData } from '../src/data';

try { validateCatalogData(); console.log('Content validation passed.'); } catch (error) { console.error(error); process.exit(1); }
