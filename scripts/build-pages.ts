import { writeFile } from 'node:fs/promises';
const args = process.argv.slice(2);
function option(name: string) { const index = args.indexOf(name); return index < 0 ? undefined : args[index + 1]; }
const basePath = option('--base-path') ?? process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const siteUrl = option('--site-url') ?? process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:4173${basePath}/`;
const url = new URL(siteUrl);
if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error('Invalid public site URL');
if (url.pathname.replace(/\/$/, '') !== basePath) throw new Error('Site URL pathname must match base path');
const env = { ...process.env, STATIC_EXPORT: 'true', NEXT_PUBLIC_BASE_PATH: basePath, NEXT_PUBLIC_SITE_URL: url.toString() };
const build = Bun.spawn([process.execPath, 'x', '--no-install', 'next', 'build'], { env, stdout: 'inherit', stderr: 'inherit' });
const code = await build.exited;
if (code !== 0) process.exit(code);
await writeFile('out/.nojekyll', '');
await writeFile('.pages-preview.json', JSON.stringify({ basePath, siteUrl: url.toString() }));
console.log('Static Pages build ready in out/');
