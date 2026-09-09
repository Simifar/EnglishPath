import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(process.cwd(), '.next', 'static', 'chunks');
const limitBytes = 400 * 1024;
async function files(path: string): Promise<string[]> { const entries = await readdir(path, { withFileTypes: true }); return (await Promise.all(entries.map((entry) => entry.isDirectory() ? files(join(path, entry.name)) : [join(path, entry.name)]))).flat(); }
const chunks = (await files(root)).filter((file) => file.endsWith('.js'));
const oversized = []; for (const chunk of chunks) { const size = (await stat(chunk)).size; if (size > limitBytes) oversized.push(`${chunk}: ${Math.round(size / 1024)} KiB`); }
if (oversized.length) throw new Error(`JavaScript chunks exceed ${limitBytes / 1024} KiB:\n${oversized.join('\n')}`);
console.log(`Bundle size check passed: ${chunks.length} JavaScript chunks are below ${limitBytes / 1024} KiB.`);
